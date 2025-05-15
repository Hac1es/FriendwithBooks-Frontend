<template>
  <div class="min-h-screen py-6">
    <!-- Main Content -->
    <div class="container mx-auto px-4 flex flex-col md:flex-row">
      <!-- Mobile Filter Toggle -->
      <div class="md:hidden mb-4">
        <button 
          class="w-full py-2 px-4 bg-amber-100 rounded-md flex items-center justify-between"
          @click="showMobileFilters = !showMobileFilters"
        >
          <span class="font-medium">Bộ lọc</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="{ 'transform rotate-180': showMobileFilters }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Filters -->
      <div 
        class="w-full md:w-64 md:pr-6 mb-6 md:mb-0"
        :class="{ 'hidden': !showMobileFilters }"
        v-show="showMobileFilters || !isMobile"
      >
        <div class="mb-6">
          <h3 class="font-bold mb-3">BỘ LỌC</h3>
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-amber-600" 
              id="sale" 
              v-model="filters.onSale"
              @change="applyFilters"
            />
            <label for="sale" class="ml-2 text-sm">Khuyến mãi</label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold mb-3">Loại sách</h3>
          <div v-for="(category, index) in bookCategories" :key="index" class="flex items-center mb-2">
            <input 
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-amber-600" 
              :id="'cat-' + index" 
              v-model="filters.categories[index]"
              @change="applyFilters"
            />
            <label :for="'cat-' + index" class="ml-2 text-sm">{{ category }}</label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold mb-3">Giá</h3>
          <div v-for="(price, index) in priceRanges" :key="index" class="flex items-center mb-2">
            <input 
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-amber-600" 
              :id="'price-' + index" 
              v-model="filters.priceRanges[index]"
              @change="applyFilters"
            />
            <label :for="'price-' + index" class="ml-2 text-sm">{{ price }}</label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold mb-3">Độ tuổi:</h3>
          <div v-for="(age, index) in ageRanges" :key="index" class="flex items-center mb-2">
            <input 
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-amber-600" 
              :id="'age-' + index" 
              v-model="filters.ageRanges[index]"
              @change="applyFilters"
            />
            <label :for="'age-' + index" class="ml-2 text-sm">{{ age }}</label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold mb-3">Hình thức:</h3>
          <div v-for="(format, index) in bookFormats" :key="index" class="flex items-center mb-2">
            <input 
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-amber-600" 
              :id="'format-' + index" 
              v-model="filters.formats[index]"
              @change="applyFilters"
            />
            <label :for="'format-' + index" class="ml-2 text-sm">{{ format }}</label>
          </div>
        </div>

        <button 
          class="w-full py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 md:hidden"
          @click="showMobileFilters = false"
        >
          Áp dụng
        </button>
      </div>

      <!-- Product Grid -->
      <div class="flex-1">
        <!-- Admin Controls -->
        <div class="mb-6 flex justify-between items-center">
          <h1 class="text-xl font-bold text-amber-800">Quản lý sản phẩm</h1>
          <div class="flex items-center">
            <div class="relative mr-4">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Tìm kiếm sản phẩm" 
                class="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                @keyup.enter="searchBooks"
              />
              <button 
                class="absolute right-2 top-1/2 transform -translate-y-1/2"
                @click="searchBooks"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button 
              class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors duration-200 flex items-center"
              @click="openAddBookModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              THÊM
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong class="font-bold">Lỗi!</strong>
          <span class="block sm:inline"> {{ error }}</span>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredBooks.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Không tìm thấy sách</h3>
          <p class="mt-1 text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
          <button 
            class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            @click="resetFilters"
          >
            Xóa bộ lọc
          </button>
        </div>
        
        <!-- Product Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(book, index) in paginatedBooks" 
            :key="index" 
            class="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div class="h-64 overflow-hidden relative">
              <img :src="book.image" alt="Book cover" class="w-full h-full object-cover" />
              
              <!-- Quick View Button -->
              <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button 
                  class="bg-white text-amber-800 px-4 py-2 rounded-md hover:bg-amber-100 transform transition hover:scale-105"
                  @click="openQuickView(book)"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-medium text-center mb-2">{{ book.title }}</h3>
              <div class="flex justify-center items-center space-x-2">
                <span class="font-medium">{{ book.discountPrice }} đ</span>
                <span class="bg-red-800 text-white text-xs px-2 py-0.5 rounded">-{{ book.discount }}%</span>
              </div>
              <div class="text-gray-500 text-sm text-center line-through">{{ book.originalPrice }} đ</div>
              
              <!-- Admin Controls -->
              <div class="flex mt-3 space-x-2">
                <button 
                  class="bg-amber-800 text-white px-4 py-1 rounded flex-1 text-sm hover:bg-amber-900 transition-colors"
                  @click="openEditBookModal(book)"
                >
                  SỬA
                </button>
                <button 
                  class="bg-black text-white px-4 py-1 rounded flex-1 text-sm hover:bg-gray-800 transition-colors"
                  @click="confirmDeleteBook(book)"
                >
                  XÓA
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>

    <!-- Quick View Modal -->
    <div v-if="quickViewBook" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-4xl w-full my-8">
        <div class="flex justify-end p-2 sticky top-0 bg-white z-10">
          <button @click="quickViewBook = null" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/3">
              <img :src="quickViewBook.image" alt="Book cover" class="w-full h-auto object-cover rounded-md" />
            </div>
            <div class="md:w-2/3 md:pl-6 mt-4 md:mt-0">
              <h2 class="text-2xl font-bold">{{ quickViewBook.title }}</h2>
              <div class="mt-2 flex items-center">
                <div class="flex text-amber-500">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'text-gray-300': i > quickViewBook.rating }" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600">({{ quickViewBook.reviewCount }} đánh giá)</span>
              </div>
              <div class="mt-4 flex items-center">
                <span class="text-2xl font-bold text-amber-800">{{ quickViewBook.discountPrice }} đ</span>
                <span class="ml-2 text-gray-500 line-through">{{ quickViewBook.originalPrice }} đ</span>
                <span class="ml-2 bg-red-800 text-white text-xs px-2 py-0.5 rounded">-{{ quickViewBook.discount }}%</span>
              </div>
              <div class="mt-4">
                <h3 class="font-medium">Mô tả:</h3>
                <p class="mt-2 text-gray-600">{{ quickViewBook.description }}</p>
              </div>
              <div class="mt-4">
                <h3 class="font-medium">Thông tin chi tiết:</h3>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <div class="text-gray-600">Tác giả:</div>
                  <div>{{ quickViewBook.author }}</div>
                  <div class="text-gray-600">Nhà xuất bản:</div>
                  <div>{{ quickViewBook.publisher }}</div>
                  <div class="text-gray-600">Năm xuất bản:</div>
                  <div>{{ quickViewBook.year }}</div>

                  <div class="text-gray-600">Loại sách:</div>
                  <div>{{ quickViewBook.category }}</div>
                  <div class="text-gray-600">Hình thức:</div>
                  <div>{{ quickViewBook.format }}</div>
                  <div class="text-gray-600">Độ tuổi:</div>
                  <div>{{ quickViewBook.ageGroup }}</div>
                </div>
              </div>
              <div class="mt-6 flex space-x-4 sticky bottom-0 bg-white pt-4">
                <button 
                  class="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                  @click="openEditBookModal(quickViewBook)"
                >
                  Chỉnh sửa
                </button>
                <button 
                  class="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors duration-200"
                  @click="confirmDeleteBook(quickViewBook)"
                >
                  Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Book Modal -->
    <div v-if="showBookModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-2xl w-full my-8">
        <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 class="text-xl font-bold">{{ isEditMode ? 'Chỉnh sửa sách' : 'Thêm sách mới' }}</h2>
          <button @click="showBookModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <form @submit.prevent="saveBook">
            <!-- Image Upload Section -->
            <div class="mb-6">
              <label class="block text-gray-700 mb-2">Hình ảnh sách</label>
              <div class="flex flex-col md:flex-row gap-4">
                <!-- Image Preview -->
                <div class="w-full md:w-1/3 flex flex-col items-center">
                  <div class="w-full h-48 bg-gray-100 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center">
                    <img 
                      v-if="imagePreview" 
                      :src="imagePreview" 
                      alt="Book cover preview" 
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="text-gray-400 text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Chưa có ảnh</p>
                    </div>
                  </div>
                  <button 
                    v-if="imagePreview" 
                    type="button" 
                    class="mt-2 text-red-600 hover:text-red-800 text-sm"
                    @click="removeImage"
                  >
                    Xóa ảnh
                  </button>
                </div>
                
                <!-- Upload Options -->
                <div class="w-full md:w-2/3">
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Tải ảnh lên</label>
                    <div class="relative border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-amber-500 transition-colors">
                      <input 
                        type="file" 
                        ref="fileInput"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        @change="handleFileUpload"
                      />
                      <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="mt-2 text-sm text-gray-600">Kéo thả ảnh vào đây hoặc <span class="text-amber-600 font-medium">chọn ảnh</span></p>
                        <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                      </div>
                    </div>
                    <div v-if="uploadError" class="mt-2 text-red-600 text-sm">
                      {{ uploadError }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 mb-1">Hoặc nhập URL ảnh</label>
                    <div class="flex">
                      <input 
                        type="text" 
                        v-model="editingBook.image" 
                        class="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button 
                        type="button"
                        class="bg-amber-100 text-amber-800 px-3 py-2 rounded-r-md hover:bg-amber-200"
                        @click="previewUrlImage"
                      >
                        Xem trước
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-gray-700 mb-1">Tiêu đề</label>
                <input 
                  type="text" 
                  v-model="editingBook.title" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Giá gốc (đ)</label>
                <input 
                  type="number" 
                  v-model="editingBook.originalPrice" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Giảm giá (%)</label>
                <input 
                  type="number" 
                  v-model="editingBook.discount" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Tác giả</label>
                <input 
                  type="text" 
                  v-model="editingBook.author" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Nhà xuất bản</label>
                <input 
                  type="text" 
                  v-model="editingBook.publisher" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Năm xuất bản</label>
                <input 
                  type="number" 
                  v-model="editingBook.year" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                
                <label class="block text-gray-700 mb-1">Độ tuổi</label>
                <select 
                  v-model="editingBook.ageGroup" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option v-for="(ageGroup, index) in ageRanges" :key="index" :value="ageGroup">
                    {{ ageGroup }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1">Loại sách</label>
                <select 
                  v-model="editingBook.category" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option v-for="(category, index) in bookCategories" :key="index" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Hình thức</label>
                <select 
                  v-model="editingBook.format" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option v-for="(format, index) in bookFormats" :key="index" :value="format">
                    {{ format }}
                  </option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-gray-700 mb-1">Mô tả</label>
                <textarea 
                  v-model="editingBook.description" 
                  rows="4"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                ></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3 sticky bottom-0 bg-white pt-4 pb-2">
              <button 
                type="button"
                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                @click="showBookModal = false"
              >
                Hủy
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                {{ isEditMode ? 'Lưu thay đổi' : 'Thêm sách' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-md w-full p-6 my-8">
        <h3 class="text-lg font-bold mb-4">Xác nhận xóa</h3>
        <p class="mb-6">Bạn có chắc chắn muốn xóa sách "{{ bookToDelete?.title }}" không? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end space-x-3">
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            @click="showDeleteConfirmation = false"
          >
            Hủy
          </button>
          <button 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            @click="deleteBook"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// Responsive state
const isMobile = ref(false);
const showMobileFilters = ref(false);

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    showMobileFilters.value = true;
  } else {
    showMobileFilters.value = false;
  }
};

// Add event listener for resize
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// Search functionality
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref(null);

// Book categories and filters
const bookCategories = ref([
  'Tiểu thuyết',
  'Self-help',
  'Truyện tranh',
  'Chính trị',
  'Khoa học & Giáo dục'
]);

const priceRanges = ref([
  '<50.000 đ',
  '50.000 đ - 200.000 đ',
  '>200.000 đ'
]);

const ageRanges = ref([
  'Trên 18 tuổi',
  'Mọi lứa tuổi'
]);

const bookFormats = ref([
  'Bìa mềm',
  'Bìa cứng',
  'Khác'
]);

// Filter state
const filters = ref({
  onSale: false,
  categories: Array(bookCategories.value.length).fill(false),
  priceRanges: Array(priceRanges.value.length).fill(false),
  ageRanges: Array(ageRanges.value.length).fill(false),
  formats: Array(bookFormats.value.length).fill(false)
});

// Reset filters
const resetFilters = () => {
  filters.value = {
    onSale: false,
    categories: Array(bookCategories.value.length).fill(false),
    priceRanges: Array(priceRanges.value.length).fill(false),
    ageRanges: Array(ageRanges.value.length).fill(false),
    formats: Array(bookFormats.value.length).fill(false)
  };
  searchQuery.value = '';
  applyFilters();
};

// Sample book data with more details
const allBooks = ref([
  {
    id: 1,
    title: 'TIỆM SÁCH CỦA NÀNG',
    image: 'https://media.istockphoto.com/id/1269703329/vi/vec-to/pixel-ngh%E1%BB%87-thu%E1%BA%ADt-8-bit-d%E1%BB%85-th%C6%B0%C6%A1ng-m%C3%A8o-con-trong-n%C6%B0%E1%BB%9Bc-th%C3%BA-c%C6%B0ng-pixel-n%C3%B3i-wow-h%C3%ACnh-minh-h%E1%BB%8Da.jpg?s=612x612&w=0&k=20&c=sKwIFKcrusX5xgsBdTUoT5HtpHSy58R6zz8-fWJ5f_w=',
    discountPrice: '100.000',
    originalPrice: '125.000',
    discount: '20',
    author: 'Nguyễn Nhật Ánh',
    publisher: 'NXB Trẻ',
    year: 2023,
    rating: 4,
    reviewCount: 28,
    category: 'Tiểu thuyết',
    description: 'Một câu chuyện đầy cảm xúc về tiệm sách nhỏ và những con người với những câu chuyện riêng của họ. Cuốn sách mang đến cho độc giả những khoảnh khắc ấm áp và suy ngẫm về cuộc sống.',
    format: 'Bìa mềm',
    ageGroup: 'Mọi lứa tuổi'
  }
]);

// Create more sample books
for (let i = 2; i <= 12; i++) {
  allBooks.value.push({
    id: i,
    title: 'TIỆM SÁCH CỦA NÀNG',
    image: 'https://media.istockphoto.com/id/1269703329/vi/vec-to/pixel-ngh%E1%BB%87-thu%E1%BA%ADt-8-bit-d%E1%BB%85-th%C6%B0%C6%A1ng-m%C3%A8o-con-trong-n%C6%B0%E1%BB%9Bc-th%C3%BA-c%C6%B0ng-pixel-n%C3%B3i-wow-h%C3%ACnh-minh-h%E1%BB%8Da.jpg?s=612x612&w=0&k=20&c=sKwIFKcrusX5xgsBdTUoT5HtpHSy58R6zz8-fWJ5f_w=',
    discountPrice: '100.000',
    originalPrice: '125.000',
    discount: '20',
    author: 'Nguyễn Nhật Ánh',
    publisher: 'NXB Trẻ',
    year: 2023,
    rating: 4,
    reviewCount: 28,
    category: 'Tiểu thuyết',
    description: 'Một câu chuyện đầy cảm xúc về tiệm sách nhỏ và những con người với những câu chuyện riêng của họ. Cuốn sách mang đến cho độc giả những khoảnh khắc ấm áp và suy ngẫm về cuộc sống.',
    format: 'Bìa mềm',
    ageGroup: 'Mọi lứa tuổi'
  });
}

// Books after filtering
const filteredBooks = ref([...allBooks.value]);

// Apply filters
const applyFilters = () => {
  isLoading.value = true;
  error.value = null;
  
  // Simulate API call
  setTimeout(() => {
    try {
      filteredBooks.value = allBooks.value.filter(book => {
        // Filter by search query
        if (searchQuery.value && !book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
            !book.author.toLowerCase().includes(searchQuery.value.toLowerCase())) {
          return false;
        }
        
        // Filter by sale
        if (filters.value.onSale && parseInt(book.discount) === 0) {
          return false;
        }
        
        // Filter by category
        const selectedCategories = filters.value.categories.map((selected, index) => 
          selected ? bookCategories.value[index] : null).filter(Boolean);
        
        if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
          return false;
        }
        
        // More filters can be implemented here
        
        return true;
      });
      
      // Reset to first page when filters change
      currentPage.value = 1;
      isLoading.value = false;
    } catch (err) {
      error.value = 'Có lỗi xảy ra khi lọc sách. Vui lòng thử lại sau.';
      isLoading.value = false;
    }
  }, 500); // Simulate loading delay
};

// Search books
const searchBooks = () => {
  applyFilters();
};

// Pagination
const currentPage = ref(1);
const booksPerPage = 9;

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / booksPerPage);
});

const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  return filteredBooks.value.slice(startIndex, endIndex);
});


// Quick view functionality
const quickViewBook = ref(null);

const openQuickView = (book) => {
  quickViewBook.value = book;
};

// Book modal (add/edit)
const showBookModal = ref(false);
const isEditMode = ref(false);
const editingBook = ref({
  title: '',
  originalPrice: '',
  discount: '0',
  author: '',
  publisher: '',
  year: new Date().getFullYear(),
  category: '',
  description: '',
  image: 'https://media.istockphoto.com/id/1269703329/vi/vec-to/pixel-ngh%E1%BB%87-thu%E1%BA%ADt-8-bit-d%E1%BB%85-th%C6%B0%C6%A1ng-m%C3%A8o-con-trong-n%C6%B0%E1%BB%9Bc-th%C3%BA-c%C6%B0ng-pixel-n%C3%B3i-wow-h%C3%ACnh-minh-h%E1%BB%8Da.jpg?s=612x612&w=0&k=20&c=sKwIFKcrusX5xgsBdTUoT5HtpHSy58R6zz8-fWJ5f_w=',
  rating: 0,
  reviewCount: 0,
  format: 'Bìa mềm',
  ageGroup: 'Mọi lứa tuổi'
});

// Image upload functionality
const fileInput = ref(null);
const imagePreview = ref(null);
const uploadError = ref(null);
const selectedFile = ref(null);

// Handle file upload
const handleFileUpload = (event) => {
  uploadError.value = null;
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    uploadError.value = 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)';
    return;
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    uploadError.value = 'Kích thước file không được vượt quá 5MB';
    return;
  }
  
  // Store the file for later use
  selectedFile.value = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    // Clear the URL input since we're using an uploaded file
    editingBook.value.image = '';
  };
  reader.readAsDataURL(file);
};

// Preview image from URL
const previewUrlImage = () => {
  if (!editingBook.value.image) {
    uploadError.value = 'Vui lòng nhập URL ảnh';
    return;
  }
  
  // Clear any previous file upload
  selectedFile.value = null;
  
  // Set the preview to the URL
  imagePreview.value = editingBook.value.image;
};

// Remove image
const removeImage = () => {
  imagePreview.value = null;
  selectedFile.value = null;
  editingBook.value.image = '';
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Open add book modal
const openAddBookModal = () => {
  isEditMode.value = false;
  editingBook.value = {
    title: '',
    originalPrice: '',
    discount: '0',
    author: '',
    publisher: '',
    year: new Date().getFullYear(),
    category: bookCategories.value[0],
    description: '',
    image: '',
    rating: 0,
    reviewCount: 0,
    format: 'Bìa mềm',
    ageGroup: 'Mọi lứa tuổi'
  };
  imagePreview.value = null;
  selectedFile.value = null;
  uploadError.value = null;
  showBookModal.value = true;
};

// Open edit book modal
const openEditBookModal = (book) => {
  isEditMode.value = true;
  editingBook.value = { ...book };
  imagePreview.value = book.image;
  selectedFile.value = null;
  uploadError.value = null;
  showBookModal.value = true;
  
  // Close quick view if open
  quickViewBook.value = null;
};

// Upload image to server (simulated)
const uploadImage = async () => {
  if (!selectedFile.value && !editingBook.value.image) {
    return null;
  }
  
  if (selectedFile.value) {
    // In a real application, you would upload the file to your server here
    // For this example, we'll simulate a successful upload and return the data URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(imagePreview.value);
      }, 500);
    });
  }
  
  // If using URL, just return it
  return editingBook.value.image;
};

// Save book (add or update)
const saveBook = async () => {
  // Validate that we have an image
  if (!imagePreview.value && !editingBook.value.image) {
    uploadError.value = 'Vui lòng tải lên hoặc nhập URL ảnh sách';
    return;
  }
  
  // Upload image if needed
  const imageUrl = await uploadImage();
  
  if (!imageUrl) {
    uploadError.value = 'Không thể tải ảnh lên. Vui lòng thử lại.';
    return;
  }
  
  // Calculate discounted price
  const originalPrice = parseInt(editingBook.value.originalPrice);
  const discount = parseInt(editingBook.value.discount);
  const discountPrice = (originalPrice * (100 - discount) / 100).toString();
  
  if (isEditMode.value) {
    // Update existing book
    const index = allBooks.value.findIndex(book => book.id === editingBook.value.id);
    if (index !== -1) {
      allBooks.value[index] = {
        ...editingBook.value,
        image: imageUrl,
        discountPrice
      };
    }
  } else {
    // Add new book
    const newBook = {
      id: allBooks.value.length + 1,
      ...editingBook.value,
      image: imageUrl,
      discountPrice
    };
    allBooks.value.push(newBook);
  }
  
  // Apply filters to update display
  applyFilters();
  
  // Close modal
  showBookModal.value = false;
  
  // Show confirmation
  alert(isEditMode.value ? 'Đã cập nhật sách thành công!' : 'Đã thêm sách mới thành công!');
};

// Delete confirmation
const showDeleteConfirmation = ref(false);
const bookToDelete = ref(null);

const confirmDeleteBook = (book) => {
  bookToDelete.value = book;
  showDeleteConfirmation.value = true;
  
  // Close quick view if open
  quickViewBook.value = null;
};

// Delete book
const deleteBook = () => {
  if (bookToDelete.value) {
    const index = allBooks.value.findIndex(book => book.id === bookToDelete.value.id);
    if (index !== -1) {
      allBooks.value.splice(index, 1);
      
      // Apply filters to update display
      applyFilters();
      
      // Show confirmation
      alert('Đã xóa sách thành công!');
    }
  }
  
  // Close confirmation modal
  showDeleteConfirmation.value = false;
  bookToDelete.value = null;
};

// Initialize
onMounted(() => {
  applyFilters();
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b45309;
}

/* File upload drag and drop */
input[type="file"] {
  cursor: pointer;
}
</style>