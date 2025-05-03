<template>
  <!-- Chỉ render nội dung nếu prop isOpen là true -->
  <div
    v-if="props.isOpen"
    class="fixed bottom-0 right-0 w-96 bg-white rounded-t-lg lg:rounded-lg shadow-xl z-40 border border-gray-200 flex flex-col"
    style="max-height: 70%; height: 500px;"
    role="dialog"
    aria-modal="true"
    aria-labelledby="chat-header"
   >
    <!-- Header -->
    <div id="chat-header" class="bg-white p-3 border-b flex justify-between items-center rounded-t-lg">
      <h2 class="text-lg font-semibold text-gray-800">Hỗ trợ</h2>
      <div class="flex space-x-2 items-center">
        <button class="text-gray-400 hover:text-gray-600" aria-label="Cảnh báo">
          <AlertTriangleIcon class="h-5 w-5" />
        </button>
        <button class="text-gray-400 hover:text-gray-600" aria-label="Xóa lịch sử trò chuyện">
          <TrashIcon class="h-5 w-5" />
        </button>
        <button
          @click="$emit('close')"  
          class="text-gray-500 hover:text-gray-700"
          aria-label="Đóng cửa sổ hỗ trợ"
        >
          <XIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Chat messages -->
    <div class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4" ref="chatMessagesContainer">
      <div v-for="(msg, index) in messages" :key="index"
           :class="msg.sender === 'user' ? 'flex justify-end' : 'flex'">
        <!-- Avatar, Message content ... (giữ nguyên như code trước) -->
         <div v-if="msg.sender === 'support'" class="w-8 h-8 rounded-full mr-2 self-end overflow-hidden flex-shrink-0">
            <img src="/user.png" alt="Support Avatar" class="h-full w-full object-cover" />
          </div>

          <div :class="[
            'rounded-lg p-3 max-w-xs shadow-sm border text-sm',
            msg.sender === 'user' ? 'bg-amber-100 border-amber-200' : 'bg-white border-gray-200'
           ]">
            <p class="text-gray-800">{{ msg.text }}</p>
          </div>

          <div v-if="msg.sender === 'user'" class="w-8 h-8 rounded-full ml-2 self-end overflow-hidden flex-shrink-0">
            <img src="/user.png" alt="User Avatar" class="h-full w-full object-cover" />
          </div>
      </div>
       <!-- Phần tử tham chiếu để cuộn xuống cuối -->
       <div ref="chatEnd"></div>
    </div>

    <!-- Input area -->
    <div class="p-3 border-t bg-white">
       <form @submit.prevent="sendMessage" class="flex items-center border border-gray-300 rounded-full overflow-hidden pl-4 pr-1 py-1">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Nhập tin nhắn..."
            class="flex-1 outline-none text-gray-700 text-sm bg-transparent"
            aria-label="Nhập tin nhắn hỗ trợ"
            ref="messageInput"
          />
          <div class="flex space-x-1">
            <button type="button" class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" aria-label="Đính kèm tệp">
              <PaperclipIcon class="h-5 w-5" />
            </button>
            <button
              type="submit"
              :disabled="!newMessage.trim()"
              class="p-2 rounded-full text-white"
              :class="newMessage.trim() ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-300 cursor-not-allowed'"
              aria-label="Gửi tin nhắn"
            >
              <SendIcon class="h-5 w-5" />
            </button>
          </div>
        </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import {
  AlertTriangle as AlertTriangleIcon,
  Trash as TrashIcon,
  Paperclip as PaperclipIcon,
  Send as SendIcon,
  X as XIcon
} from 'lucide-vue-next';

// Định nghĩa props mà component này nhận từ cha
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  }
});

// Định nghĩa sự kiện mà component này có thể phát ra
const emit = defineEmits(['close']);

// --- Logic nội bộ của chat window ---
const newMessage = ref(''); // Đổi tên từ message để tránh trùng lặp nếu có
const messages = ref([
   {
    text: 'Shop giúp mình đổi mô hình Luffy Gear 5 được không ạ? Nó có chi tiết bị lỗi',
    sender: 'user',
    timestamp: '10:30 AM'
  },
  {
    text: 'Cảm ơn bạn đã liên hệ bộ phận hỗ trợ khách hàng của FriendwithBooks. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!',
    sender: 'support',
    timestamp: '10:31 AM'
  }
]);
const chatEnd = ref(null);
const chatMessagesContainer = ref(null); // Tham chiếu đến div chứa tin nhắn
const messageInput = ref(null); // Tham chiếu đến input

function sendMessage() {
  const trimmedMessage = newMessage.value.trim();
  if (!trimmedMessage) return;

  messages.value.push({
    text: trimmedMessage,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  newMessage.value = '';

  scrollToBottom();

  // Simulate support response
  setTimeout(() => {
    messages.value.push({
      text: 'Chúng tôi đã nhận được tin nhắn của bạn và sẽ xử lý sớm. Vui lòng đợi trong giây lát.',
      sender: 'support',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
     scrollToBottom();
  }, 1500);
}

function scrollToBottom() {
  nextTick(() => {
    if (chatEnd.value) {
      chatEnd.value.scrollIntoView({ behavior: 'smooth' });
    }
    // Hoặc dùng scrollTop nếu muốn cuộn container
    // if (chatMessagesContainer.value) {
    //    chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
    // }
  });
}

// Theo dõi khi prop isOpen thay đổi thành true (chat được mở)
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    scrollToBottom();
    // Tự động focus vào input khi mở chat
    nextTick(() => {
        messageInput.value?.focus();
    })
  }
});

// Theo dõi khi có tin nhắn mới để cuộn xuống
watch(messages, () => {
    if (props.isOpen) { // Chỉ cuộn nếu chat đang mở
        scrollToBottom();
    }
}, { deep: true });

</script>

<style scoped>
/* Thêm style nếu cần */
input[type="text"] {
  min-width: 0;
}
</style>