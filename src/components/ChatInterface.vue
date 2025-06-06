<template>
  <div class="flex m-4 flex-col min-h-screen">
    <!-- Main Content -->
    <div class="flex-1 container mx-auto flex">
      <!-- Sidebar -->
      <div class="w-1/4 mr-4 border-gray-200">
        <!-- Search -->
        <div class="relative mb-4 ">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none"
          />
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <!-- Conversation List -->
        <div class="space-y-2">
          <div v-for="i in 4" :key="i" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
            <div class="relative">
              <img src="/user.png?height=40&width=40" alt="User Avatar" class="h-10 w-10 rounded-full" />
              <span class="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-800">Bách Chí</p>
              <p class="text-sm text-gray-500">Xin chào cảm ơn</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chat Area -->
      <div class="w-3/4 flex flex-col bg-white rounded-lg border border-gray-200">
        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-200 flex items-center">
          <img src="/user.png?height=40&width=40" alt="User Avatar" class="h-10 w-10 rounded-full" />
          <div class="ml-3">
            <p class="font-medium">Bách Chí</p>
            <p class="text-xs text-gray-500">#CU6798H</p>
          </div>
        </div>
        
        <!-- Messages -->
        <div class="flex-1 p-4 overflow-y-auto space-y-6">
          <!-- Sender Message -->
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-xs text-purple-600">
              DP
            </div>
            <div class="ml-2 max-w-md">
              <div class="bg-gray-100 rounded-lg p-3 text-sm">
                <p>Lorem ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
              <p class="text-xs text-gray-500 mt-1">8:00 PM</p>
            </div>
          </div>
          
          <!-- Receiver Message -->
          <div class="flex items-start justify-end">
            <div class="mr-2 max-w-md">
              <div class="bg-indigo-400 rounded-lg p-3 text-sm text-white">
                <p>Lorem ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
              <p class="text-xs text-gray-500 mt-1 text-right">8:00 PM</p>
            </div>
            <img src="/user.png?height=32&width=32" alt="User Avatar" class="h-8 w-8 rounded-full" />
          </div>
          
          <!-- Sender Message -->
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-xs text-purple-600">
              DP
            </div>
            <div class="ml-2 max-w-md">
              <div class="bg-gray-100 rounded-lg p-3 text-sm">
                <p>Lorem ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
              <p class="text-xs text-gray-500 mt-1">8:00 PM</p>
            </div>
          </div>
          
          <!-- Receiver Message -->
          <div class="flex items-start justify-end">
            <div class="mr-2 max-w-md">
              <div class="bg-indigo-400 rounded-lg p-3 text-sm text-white">
                <p>Lorem ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
              <p class="text-xs text-gray-500 mt-1 text-right">8:00 PM</p>
            </div>
            <img src="/user.png?height=32&width=32" alt="User Avatar" class="h-8 w-8 rounded-full" />
          </div>
        </div>
        
        <!-- Message Input -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center border border-gray-300 rounded-full overflow-hidden">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              class="flex-1 px-4 py-2 focus:outline-none"
            />
            <button class="p-2 text-gray-500 hover:text-gray-700">
              <PaperclipIcon class="h-5 w-5" />
            </button>
            <button class="p-2 text-indigo-500 mr-3 ">
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
  SearchIcon,
  PaperclipIcon,
  SendIcon,
} from 'lucide-vue-next'
</script>

<style scoped>
</style>