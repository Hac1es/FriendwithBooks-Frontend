<template>
    <div>
      <!-- Chat popup - always visible -->
      <div 
        class="fixed bottom-0 right-0 w-96 bg-white rounded-lg shadow-xl z-40 border border-gray-200 flex flex-col"
        style="max-height: 70%;"
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
          <div v-for="(msg, index) in messages" :key="index" 
               :class="msg.sender === 'user' ? 'flex justify-end' : 'flex'">
            
            <div v-if="msg.sender === 'support'" class="w-8 h-8 rounded-full bg-gray-300 mr-2 self-end overflow-hidden">
              <img src="/user.png" alt="Support" class="h-8 w-8 rounded-full" />
            </div>
            
            <div class="bg-white rounded-lg p-3 max-w-xs shadow-sm border border-gray-200 relative">
              <p class="text-gray-800">{{ msg.text }}</p>
            </div>
            
            <div v-if="msg.sender === 'user'" class="w-8 h-8 rounded-full bg-gray-300 ml-2 self-end overflow-hidden">
              <img src="/user.png" alt="User" class="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
  
        <!-- Input area -->
        <div class="p-4 border-t bg-white">
          <div class="flex items-center border border-gray-300 rounded-full overflow-hidden pl-4 pr-2 py-2">
            <input 
              v-model="message" 
              type="text" 
              placeholder="Chúng tôi có thể hỗ trợ bạn như thế nào?" 
              class="flex-1 outline-none text-gray-700"
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
  import { ref } from 'vue'
  import { 
    AlertTriangle as AlertTriangleIcon,
    Trash as TrashIcon,
    Paperclip as PaperclipIcon,
    Send as SendIcon
  } from 'lucide-vue-next'
  
  const message = ref('')
  const messages = ref([
    {
      text: 'Shop giúp mình đổi mô hình Luffy Gear 5 được không ạ? Nó có chi tiết bị lỗi',
      sender: 'user'
    },
    {
      text: 'Cảm ơn bạn đã liên hệ bộ phận hỗ trợ khách hàng của FriendwithBooks. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!',
      sender: 'support'
    }
  ])
  
  function sendMessage() {
    if (!message.value.trim()) return
    
    messages.value.push({
      text: message.value,
      sender: 'user'
    })
    
    message.value = ''
    
    // Simulate response
    setTimeout(() => {
      messages.value.push({
        text: 'Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm.',
        sender: 'support'
      })
    }, 1000)
  }
  </script>
  
  