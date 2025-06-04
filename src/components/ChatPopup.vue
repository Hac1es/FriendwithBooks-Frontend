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
        <div class="flex space-x-3">
          <button class="text-amber-400 hover:text-amber-500">
            <AlertTriangleIcon class="h-5 w-5" />
          </button>
          <button class="text-gray-400 hover:text-gray-500">
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Chat messages -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.sender === 'user' ? 'flex justify-end' : 'flex'"
        >
          <div
            v-if="msg.sender === 'support'"
            class="w-8 h-8 rounded-full bg-gray-300 mr-2 self-end overflow-hidden"
          >
            <img
              :src="msg.senderAvatar || '/user.png'"
              alt="Support"
              class="h-8 w-8 rounded-full"
            />
          </div>
          <div
            class="bg-white rounded-lg p-3 max-w-xs shadow-sm border border-gray-200 relative"
          >
            <p class="text-gray-800">{{ msg.text }}</p>
          </div>
          <div
            v-if="msg.sender === 'user'"
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

      <!-- Input area -->
      <div class="p-4 border-t bg-white">
        <div
          class="flex items-center border border-gray-300 rounded-full overflow-hidden pl-4 pr-2 py-2"
        >
          <input
            v-model="message"
            type="text"
            placeholder="Chúng tôi có thể hỗ trợ bạn như thế nào?"
            class="flex-1 outline-none text-gray-700"
            @keyup.enter="sendMessage"
          />
          <div class="flex space-x-2">
            <button class="text-gray-500 hover:text-gray-700">
              <PaperclipIcon class="h-5 w-5" />
            </button>
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  AlertTriangle as AlertTriangleIcon,
  Trash as TrashIcon,
  Paperclip as PaperclipIcon,
  Send as SendIcon,
} from "lucide-vue-next";
import { useStore } from "vuex";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useRouter } from "vue-router";

// Store & user info
const store = useStore();
const isVisible = computed(() => store.state.isChatVisible);
const userInfo = computed(() => store.state.userInfo);
const router = useRouter();

// Chat state
const message = ref("");
const messages = ref([
  {
    text: "Chào bạn! Tôi có thể giúp gì cho bạn?",
    sender: "support",
    senderAvatar: "/user.png",
  },
]);
const connection = ref(null);

function handleUnauthorized() {
  // Xóa token
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  // Đóng chat popup
  store.commit("hideChat");
  // Chuyển hướng về login
  router.push("/login");
  // Thông báo cho user
  alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
}

// SignalR setup
const initializeSignalR = async () => {
  try {
    console.log(localStorage.getItem("token"));
    connection.value = new HubConnectionBuilder()
      .withUrl("https://localhost:7129/api/chathub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    // Lắng nghe tin nhắn mới từ server
    connection.value.on("ReceiveMessage", (fullName, avatar, msg) => {
      messages.value.push({
        text: msg,
        sender: "support",
        senderName: fullName,
        senderAvatar: avatar,
      });
    });

    connection.value.onclose((error) => {
      if (error && error.message && error.message.includes("401")) {
        handleUnauthorized();
      }
    });

    await connection.value.start();
    console.log("SignalR Connected!");
  } catch (err) {
    // Bắt lỗi 401
    if (err && err.message && err.message.includes("401")) {
      handleUnauthorized();
    } else {
      console.error("SignalR Connection Error: ", err);
    }
  }
};

// Gửi tin nhắn lên server
const sendMessage = async () => {
  if (
    !message.value.trim() ||
    !connection.value ||
    connection.value.state !== "Connected"
  )
    return;

  // Hiển thị tin nhắn của user ngay lập tức
  messages.value.push({
    text: message.value,
    sender: "user",
  });

  // Gửi lên server
  try {
    await connection.value.invoke(
      "SendMessage",
      Number(userInfo.value.id),
      String(userInfo.value.name),
      String(userInfo.value.avatar),
      String(message.value),
      0
    );
  } catch (err) {
    console.error("SendMessage error:", err);
  }

  message.value = "";
};

// Đóng chat popup
const close = () => store.commit("hideChat");

// Đóng popup khi click ra ngoài
const chatBox = ref(null);
function handleClickOutside(event) {
  if (chatBox.value && !chatBox.value.contains(event.target)) {
    close();
  }
}

// Lifecycle
onMounted(async () => {
  await initializeSignalR();
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  if (connection.value) connection.value.stop();
});
</script>
