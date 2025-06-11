<template>
  <div class="flex m-4 flex-col">
    <!-- Main Content -->
    <div class="flex-1 container mx-auto flex">
      <!-- Sidebar -->
      <div class="w-1/4 mr-4 border-gray-200">
        <!-- Search -->
        <div class="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none"
          />
          <SearchIcon
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          />
        </div>

        <!-- Conversation List -->
        <div class="space-y-2">
          <div
            class="space-y-2 min-h-[200px] flex items-center justify-center"
            v-if="isLoading"
          >
            <n-spin />
          </div>
          <div
            v-else
            v-for="(conv, index) in conversations"
            :key="index"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white"
            @click="getConv(conv.partnerId)"
          >
            <div class="relative">
              <img
                :src="conv.partnerAvatar"
                alt="User Avatar"
                class="h-10 w-10 rounded-full"
              />
              <span
                class="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"
              ></span>
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-800">
                {{ conv.partnerName }}
              </p>
              <p class="text-sm text-gray-500">
                {{
                  conv.isAdminSendLast
                    ? `Bạn: ${conv.lastMessage}`
                    : conv.lastMessage
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div
        class="w-3/4 bg-white rounded-lg border border-gray-200 h-[550px]"
        :class="isLoading.value ? 'flex justify-center items-center' : ''"
      >
        <div
          v-if="isLoading"
          class="flex flex-1 justify-center items-center h-full"
        >
          <n-spin />
        </div>
        <div class="flex flex-col h-full" v-else>
          <!-- Chat Header -->
          <div
            class="p-4 border-b border-gray-200 flex items-center justify-between"
          >
            <div class="flex items-center">
              <img
                :src="currentPartner.avatar"
                alt="User Avatar"
                class="h-10 w-10 rounded-full"
              />
              <div class="ml-3">
                <p class="font-medium">{{ currentPartner.name }}</p>
                <p class="text-xs text-gray-500">#{{ currentPartner.id }}</p>
              </div>
            </div>
            <button
              @click="deleteConversation"
              class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              title="Xóa cuộc trò chuyện"
            >
              <Trash2 class="h-5 w-5" />
            </button>
          </div>

          <!-- Messages -->
          <div
            class="flex-1 p-4 overflow-y-auto space-y-6"
            ref="messagesContainer"
          >
            <div
              v-for="(msg, idx) in conversation.messages"
              :key="msg.id || idx"
              :class="
                msg.senderId === Number(userInfo.id)
                  ? 'flex items-center justify-end'
                  : 'flex items-center'
              "
            >
              <!-- Nếu là tin nhắn của người khác -->
              <template v-if="msg.senderId !== Number(userInfo.id)">
                <div
                  class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-xs text-purple-600"
                >
                  <img
                    :src="msg.senderAvatar || '/user.png'"
                    class="h-8 w-8 rounded-full"
                  />
                </div>
                <div class="ml-2 max-w-md">
                  <div class="bg-gray-100 rounded-lg p-3 text-sm">
                    <p>{{ msg.message || msg.text }}</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{
                      new Date(msg.timestamp).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    }}
                  </p>
                </div>
              </template>
              <!-- Nếu là tin nhắn của mình -->
              <template v-else>
                <div class="mr-2 max-w-md">
                  <div class="bg-indigo-400 rounded-lg p-3 text-sm text-white">
                    <p>{{ msg.message || msg.text }}</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 text-right">
                    {{
                      new Date(msg.timestamp).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    }}
                  </p>
                </div>
                <img
                  :src="msg.senderAvatar || '/user.png'"
                  alt="User Avatar"
                  class="h-8 w-8 rounded-full"
                />
              </template>
            </div>
          </div>

          <!-- Message Input -->
          <div class="p-4 border-t border-gray-200">
            <div
              class="flex items-center border border-gray-300 rounded-full overflow-hidden"
            >
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                class="flex-1 px-4 py-2 focus:outline-none bg-white"
                v-model="message"
                @keyup.enter="sendMessage"
              />
              <button
                class="p-2 text-indigo-500 hover:text-indigo-700 mr-3"
                @click="sendMessage"
              >
                <SendIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SearchIcon, SendIcon, Trash2 } from "lucide-vue-next";
import axios from "../utils/axios";
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  reactive,
  nextTick,
  watch,
} from "vue";
import { useStore } from "vuex";
import { HubConnectionBuilder } from "@microsoft/signalr";

const store = useStore();
const userInfo = computed(() => store.state.userInfo);

const conversations = ref([]);
const conversation = ref([]);
const currentPartner = ref({});
const message = ref("");
const connection = ref(null);
const isLoading = ref(false);
const currentPartnerId = ref(null);
const messagesContainer = ref(null);

const getConversation = async () => {
  isLoading.value = true;
  const response = await axios.get("/Chat/conversations/partners");
  conversations.value = response.data.partners;

  // Tự động load cuộc trò chuyện đầu tiên nếu có
  if (conversations.value.length > 0 && !currentPartnerId.value) {
    await getConv(conversations.value[0].partnerId);
  }
  isLoading.value = false;
};

const getConv = async (partnerId) => {
  isLoading.value = true;
  const response = await axios.get(
    `/Chat/conversations?partnerId=${partnerId}`
  );
  conversation.value = response.data;
  currentPartner.value = {
    name: response.data.messages?.[0]?.sender,
    id: partnerId,
    avatar: response.data.messages?.[0]?.senderAvatar,
  };
  currentPartnerId.value = partnerId;
  isLoading.value = false;
};

function handleUnauthorized() {
  // Xóa token
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
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

const initializeSignalR = async () => {
  try {
    connection.value = new HubConnectionBuilder()
      .withUrl("https://friendwithbooks.id.vn/api/chathub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    // Lắng nghe tin nhắn mới từ server
    connection.value.on("ReceiveMessage", (msg) => {
      if (
        Number(currentPartnerId.value) === msg.senderId ||
        Number(currentPartnerId.value) === msg.receiverId
      ) {
        conversation.value.messages.push({
          text: msg.message,
          sender: "admin",
          senderName: msg.sender,
          senderAvatar: msg.senderAvatar,
          id: msg.id,
          timestamp: msg.timestamp,
        });
        localStorage.setItem("latestMessageId", msg.id);
        scrollToBottom();
      }

      // Cập nhật nhanh cuộc trò chuyện
      const idx = conversations.value.findIndex(
        (c) => c.partnerId === msg.senderId || c.partnerId === msg.receiverId
      );
      if (idx !== -1) {
        const targetConv = conversations.value[idx];
        targetConv.lastMessage = msg.message;
        targetConv.isAdminSendLast = msg.senderId === Number(userInfo.value.id);

        // Di chuyển cuộc trò chuyện này lên đầu danh sách
        conversations.value.splice(idx, 1);
        conversations.value.unshift(targetConv);
      } else {
        const newConv = {
          partnerId:
            msg.senderId === Number(userInfo.value.id)
              ? msg.receiverId
              : msg.senderId,
          partnerName: msg.sender,
          partnerAvatar: msg.senderAvatar || "/user.png",
          lastMessage: msg.message,
          isAdminSendLast: msg.senderId === Number(userInfo.value.id),
        };

        conversations.value.unshift(newConv);
      }
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

const sendMessage = async () => {
  if (
    !message.value.trim() ||
    !connection.value ||
    connection.value.state !== "Connected" ||
    !currentPartnerId.value
  )
    return;

  // Hiển thị tin nhắn của user ngay lập tức
  const msgObj = {
    message: message.value,
    senderId: Number(userInfo.value.id),
    sender: userInfo.value.name,
    senderAvatar: userInfo.value.avatar,
    receiverId: currentPartnerId.value,
    timestamp: new Date().toISOString(),
  };
  const currentCov = conversations.value.find(
    (c) => c.partnerId === currentPartnerId.value
  );
  if (currentCov) {
    currentCov.lastMessage = message.value;
    currentCov.isAdminSendLast = true;
  }
  conversation.value.messages.push(msgObj);
  scrollToBottom();

  // Gửi lên server
  try {
    await connection.value.invoke(
      "SendMessage",
      String(message.value),
      currentPartnerId.value
    );
  } catch (err) {
    console.error("SendMessage error:", err);
  }

  message.value = "";
};

const deleteConversation = async () => {
  if (!currentPartnerId.value) return;

  // Xác nhận xóa
  const confirmed = confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này?");
  if (!confirmed) return;

  try {
    const response = await axios.delete(
      `/Chat/message?partnerId=${currentPartnerId.value}`
    );
    if (response.data.success) {
      // Xóa khỏi danh sách conversations
      const index = conversations.value.findIndex(
        (conv) => conv.partnerId === currentPartnerId.value
      );
      if (index !== -1) {
        conversations.value.splice(index, 1);
      }

      // Reset current conversation
      conversation.value = { messages: [] };
      currentPartner.value = {};
      currentPartnerId.value = null;

      // Load cuộc trò chuyện đầu tiên nếu còn
      if (conversations.value.length > 0) {
        await getConv(conversations.value[0].partnerId);
      }

      alert("Đã xóa thành công cuộc trò chuyện!");
    } else {
      alert("Không thể xóa cuộc trò chuyện. Vui lòng thử lại!");
    }
  } catch (error) {
    console.error("Delete conversation error:", error);
    alert("Có lỗi xảy ra khi xóa cuộc trò chuyện!");
  }
};

onMounted(async () => {
  await getConversation();
  await initializeSignalR();
  scrollToBottom();
});

watch(
  () => conversation.value,
  (newVal) => {
    if (newVal?.messages) {
      nextTick(() => scrollToBottom());
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (connection.value) connection.value.stop();
});
</script>
