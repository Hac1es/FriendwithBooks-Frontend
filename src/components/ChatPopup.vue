<template>
  <div v-if="isVisible">
    <!-- Chat popup-->
    <div
      class="fixed bottom-0 right-0 w-96 bg-white rounded-lg shadow-xl z-40 border border-gray-200 flex flex-col min-h-96"
      style="max-height: 70%"
      ref="chatBox"
    >
      <!-- Header -->
      <div class="bg-white p-4 border-b flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Hỗ trợ</h2>
        <button class="text-gray-400 hover:text-gray-500">
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>

      <n-spin :show="isLoading" class="flex-1 flex flex-col">
        <!-- Chat messages -->
        <div
          class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 min-h-0 max-h-72"
          ref="messagesContainer"
        >
          <div
            v-for="(msg, index) in messages"
            :key="msg.id || index"
            :class="
              msg.senderId === Number(userInfo.id)
                ? 'flex justify-end items-end'
                : 'flex items-end'
            "
          >
            <!-- Avatar bên trái nếu là support/admin -->
            <div
              v-if="msg.senderId !== Number(userInfo.id)"
              class="w-8 h-8 rounded-full bg-gray-300 mr-2 self-end overflow-hidden"
            >
              <img
                :src="msg.senderAvatar || '/user.png'"
                alt="Support"
                class="h-8 w-8 rounded-full"
              />
            </div>
            <!-- Nội dung tin nhắn -->
            <div
              class="bg-white rounded-lg p-3 max-w-xs shadow-sm border border-gray-200 relative"
            >
              <p class="text-gray-800">{{ msg.message || msg.text }}</p>
              <span class="block text-xs text-gray-400 mt-1">{{
                msg.sender
              }}</span>
            </div>
            <!-- Avatar bên phải nếu là user -->
            <div
              v-if="msg.senderId === Number(userInfo.id)"
              class="w-8 h-8 rounded-full bg-gray-300 ml-2 self-end overflow-hidden"
            >
              <img
                :src="userInfo.avatar || '/user.png'"
                alt="User"
                class="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </div>
        <template #description> Wait for it... </template>
      </n-spin>

      <!-- Input area -->
      <div class="p-4 border-t bg-white">
        <div
          class="flex items-center border border-gray-300 rounded-full overflow-hidden pl-4 pr-2 py-2"
        >
          <input
            v-model="message"
            type="text"
            placeholder="Chúng tôi có thể hỗ trợ bạn như thế nào?"
            class="flex-1 outline-none text-gray-700 bg-white"
            @keyup.enter="sendMessage"
          />
          <div class="flex space-x-2">
            <button
              @click="sendMessage"
              class="text-gray-500 hover:text-gray-700"
            >
              <SendIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import {
  AlertTriangle as AlertTriangleIcon,
  Trash as TrashIcon,
  Paperclip as PaperclipIcon,
  Send as SendIcon,
} from "lucide-vue-next";
import { useStore } from "vuex";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useRouter } from "vue-router";
import axios from "../utils/axios";

// Store & user info
const store = useStore();
const isVisible = computed(() => store.state.isChatVisible);
const userInfo = computed(() => store.state.userInfo);
const router = useRouter();

// Chat state
const message = ref("");
const messages = ref([]);
const connection = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);
const chatBox = ref(null);
const messagesContainer = ref(null);

const loadMsg = async (page = 1) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const resp = await axios.get(`/Chat/conversations?page=${page}`);
    console.log(resp.data);
    totalPages.value = resp.data.totalPages;
    currentPage.value = resp.data.currentPage;
    if (resp.data.totalCount === 0 && page === 1) {
      messages.value = [
        {
          text: "Chào bạn! Tôi có thể giúp gì cho bạn?",
          sender: "support",
          senderAvatar: "/user.png",
        },
      ];
    } else {
      if (page === 1) {
        messages.value = resp.data.messages;
      } else {
        messages.value = [...resp.data.messages, ...messages.value];
      }
    }
    if (messages.value.length > 0) {
      localStorage.setItem(
        "latestMessageId",
        messages.value[messages.value.length - 1].id
      );
    }
  } catch (err) {
    console.error("Load messages error:", err);
  }
  isLoading.value = false;
};

function handleUnauthorized() {
  // Xóa token
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  // Đóng chat popup
  store.commit("hideChat");
  // Xóa thông tin user
  store.dispatch("logout");
  // Chuyển hướng về login
  router.push("/login");
  // Thông báo cho user
  alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// SignalR setup
const initializeSignalR = async () => {
  if (!userInfo.value) {
    console.log("User not logged in, skipping SignalR initialization");
    return;
  }

  try {
    console.log(localStorage.getItem("token"));
    connection.value = new HubConnectionBuilder()
      .withUrl("https://localhost:7129/api/chathub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    // Lắng nghe tin nhắn mới từ server
    connection.value.on("ReceiveMessage", (msg) => {
      messages.value.push({
        text: msg.message,
        sender: "admin",
        senderName: msg.sender,
        senderAvatar: msg.senderAvatar,
        id: msg.id,
        timestamp: msg.timestamp,
      });
      localStorage.setItem("latestMessageId", msg.id);
      nextTick(() => scrollToBottom());
    });

    connection.value.onclose((error) => {
      if (error && error.message && error.message.includes("401")) {
        handleUnauthorized();
      } else {
        console.log("Connection closed, attempting to reconnect...");
      }
    });

    connection.value.onreconnecting((error) => {
      console.log("Reconnecting to SignalR...", error);
    });

    connection.value.onreconnected((connectionId) => {
      console.log("Reconnected to SignalR with connection ID:", connectionId);
    });

    await connection.value.start();
    console.log("SignalR Connected!");
  } catch (err) {
    if (err && err.message && err.message.includes("401")) {
      handleUnauthorized();
    } else {
      console.error("SignalR Connection Error: ", err);
      alert("Không thể kết nối đến máy chủ chat. Vui lòng thử lại sau!");
    }
  }
};

// Gửi tin nhắn lên server
const sendMessage = async () => {
  if (!userInfo.value) {
    alert("Vui lòng đăng nhập để sử dụng tính năng chat!");
    return;
  }

  if (
    !message.value.trim() ||
    !connection.value ||
    connection.value.state !== "Connected"
  )
    return;

  // Hiển thị tin nhắn của user ngay lập tức
  const tempMessage = {
    text: message.value,
    senderId: Number(userInfo.value.id),
    sender: userInfo.value.name,
    senderAvatar: userInfo.value.avatar,
    timestamp: new Date().toISOString(),
  };
  messages.value.push(tempMessage);
  scrollToBottom();

  // Gửi lên server
  try {
    await connection.value.invoke("SendMessage", String(message.value), 152);
    message.value = "";
  } catch (err) {
    console.error("SendMessage error:", err);
    // Xóa tin nhắn tạm nếu gửi thất bại
    messages.value.pop();
    alert("Không thể gửi tin nhắn. Vui lòng thử lại sau!");
  }
};

// Đóng chat popup
const close = () => store.commit("hideChat");

// Đóng popup khi click ra ngoài
function handleClickOutside(event) {
  if (chatBox.value && !chatBox.value.contains(event.target)) {
    close();
  }
}

function onScroll() {
  const el = chatBox.value;
  if (el && el.scrollTop === 0 && currentPage.value < totalPages.value) {
    loadMsg(currentPage.value + 1);
  }
}

// Lifecycle
onMounted(async () => {
  await initializeSignalR();
  document.addEventListener("click", handleClickOutside);
  await loadMsg(1);

  // Lấy latestMessageId từ localStorage
  const latestMessageId = localStorage.getItem("latestMessageId");
  if (latestMessageId) {
    // Gọi API lấy các tin nhắn mới hơn
    const resp = await axios.get(
      `/Chat/conversations/latest?lastMessageId=${latestMessageId}&partnerId=152`
    );
    if (resp.data && resp.data.length > 0) {
      messages.value = [...messages.value, ...resp.data];
      // Cập nhật lại latestMessageId
      localStorage.setItem(
        "latestMessageId",
        messages.value[messages.value.length - 1].id
      );
    }
  }

  if (chatBox.value) {
    chatBox.value.addEventListener("scroll", onScroll);
  }

  scrollToBottom();
});

watch(
  () => messages.value,
  (newVal) => {
    if (newVal?.messages) {
      nextTick(() => scrollToBottom());
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  if (connection.value) connection.value.stop();
  if (chatBox.value) {
    chatBox.value.removeEventListener("scroll", onScroll);
  }
});
</script>
