<template>
  <div class="flex m-4 flex-col min-h-screen">
    <!-- Main Content -->
    <div class="flex-1 container mx-auto flex">
      <!-- Sidebar -->
      <div class="w-1/4 p-4 border-gray-200">
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
            v-for="(conv, index) in conversations"
            :key="index"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white"
            @click="getConv(conv.partnerId)"
          >
            <div class="relative">
              <img
                :src="conv.senderAvatar"
                alt="User Avatar"
                class="h-10 w-10 rounded-full"
              />
              <span
                class="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"
              ></span>
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-800">
                {{ conv.sender == userInfo.name ? "Bạn: " : conv.sender }}
              </p>
              <p class="text-sm text-gray-500">{{ conv.lastMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div
        class="w-3/4 flex flex-col bg-white rounded-lg border border-gray-200"
      >
        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-200 flex items-center">
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

        <!-- Messages -->
        <div class="flex-1 p-4 overflow-y-auto space-y-6">
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
            />
            <button class="p-2 text-gray-500 hover:text-gray-700">
              <PaperclipIcon class="h-5 w-5" />
            </button>
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
</template>

<script setup>
import { SearchIcon, PaperclipIcon, SendIcon } from "lucide-vue-next";
import axios from "../utils/axios";
import { ref, onMounted, onBeforeUnmount, computed, reactive } from "vue";
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

const getConversation = async () => {
  const response = await axios.get("/Chat/conversations/partners");
  conversations.value = response.data.partners;
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

const initializeSignalR = async () => {
  try {
    connection.value = new HubConnectionBuilder()
      .withUrl("https://localhost:7129/api/chathub", {
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
        localStorage.setItem("latestMessageId", id);
      }
    });

    await connection.value.start();
    console.log("SignalR Connected!");
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
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
  conversation.value.messages.push(msgObj);

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

onMounted(() => {
  getConversation();
  initializeSignalR();
});

onBeforeUnmount(() => {
  if (connection.value) connection.value.stop();
});
</script>
