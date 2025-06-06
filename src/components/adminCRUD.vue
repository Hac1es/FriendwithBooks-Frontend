<template>
  <div class="min-h-screen py-3">

    <!-- Main Content -->
    <div class="container mx-auto px-4 flex flex-col md:flex-row">
      <!-- Sidebar Filters -->
      <div class="hidden md:block">
        <Filter class="mr-4" />
      </div>
      <!-- Product Grid -->
      <div class="flex-1">
        <!-- Admin Controls -->
        <div class="mb-4 flex justify-between items-center">
          <div class="w-full flex items-center">
            <div class="relative w-full mr-4">
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
            v-for="book in filteredBooks" 
            :key="book.bookID" 
            class="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div class="h-64 overflow-hidden relative">
              <img :src="book.imgURL1 || '/placeholder.svg?height=256&width=192'" alt="Book cover" class="w-full h-full object-cover" />
              
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
                <span class="font-medium">{{ formatPrice(calculateDiscountPrice(book.price, book.discount)) }} đ</span>
                <span v-if="book.discount > 0" class="bg-red-800 text-white text-xs px-2 py-0.5 rounded">-{{ book.discount }}%</span>
              </div>
              <div v-if="book.discount > 0" class="text-gray-500 text-sm text-center line-through">{{ formatPrice(book.price) }} đ</div>
              
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

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 rounded-md border',
                page === currentPage 
                  ? 'bg-amber-600 border-amber-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            
            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </nav>
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
              <img :src="quickViewBook.imgURL1 || '/placeholder.svg?height=400&width=300'" alt="Book cover" class="w-full h-auto object-cover rounded-md" />
            </div>
            <div class="md:w-2/3 md:pl-6 mt-4 md:mt-0">
              <h2 class="text-2xl font-bold">{{ quickViewBook.title }}</h2>
              <div class="mt-2 flex items-center">
                <div class="flex text-amber-500">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'text-gray-300': i > Math.floor(quickViewBook.avgRating || 0) }" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600">({{ quickViewBook.totalRating || 0 }} đánh giá)</span>
              </div>
              <div class="mt-4 flex items-center">
                <span class="text-2xl font-bold text-amber-800">{{ formatPrice(calculateDiscountPrice(quickViewBook.price, quickViewBook.discount)) }} đ</span>
                <span v-if="quickViewBook.discount > 0" class="ml-2 text-gray-500 line-through">{{ formatPrice(quickViewBook.price) }} đ</span>
                <span v-if="quickViewBook.discount > 0" class="ml-2 bg-red-800 text-white text-xs px-2 py-0.5 rounded">-{{ quickViewBook.discount }}%</span>
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
                  <div>{{ quickViewBook.supplier }}</div>
                  <div class="text-gray-600">Năm xuất bản:</div>
                  <div>{{ quickViewBook.publishYear }}</div>
                  <div class="text-gray-600">Số trang:</div>
                  <div>{{ quickViewBook.pageNum }}</div>
                  <div class="text-gray-600">Ngôn ngữ:</div>
                  <div>{{ quickViewBook.language }}</div>
                  <div class="text-gray-600">Hình thức:</div>
                  <div>{{ quickViewBook.binding }}</div>
                  <div class="text-gray-600">Độ tuổi:</div>
                  <div>{{ quickViewBook.ageGroup }}</div>
                  <div class="text-gray-600">Tồn kho:</div>
                  <div>{{ quickViewBook.stock }}</div>
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
      <div class="bg-white rounded-lg max-w-4xl w-full my-8">
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
              <label class="block text-gray-700 mb-2 font-medium">Hình ảnh sản phẩm</label>
              
              <!-- Image Upload Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Image 1 -->
                <div class="space-y-2">
                  <label class="text-sm text-gray-600">Ảnh chính</label>
                  <div 
                    class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-amber-500 transition-colors cursor-pointer"
                    :class="{ 
                      'border-amber-500 bg-amber-50': dragStates.img1,
                      'border-green-500 bg-green-50': imagePreviews.img1
                    }"
                    @dragover.prevent="handleDragOver('img1')"
                    @dragleave.prevent="handleDragLeave('img1')"
                    @drop.prevent="handleDrop($event, 'img1')"
                    @click="triggerFileInput('img1')"
                  >
                    <input 
                      ref="fileInput1"
                      type="file" 
                      class="hidden"
                      accept="image/*"
                      @change="handleFileSelect($event, 'img1')"
                    />
                    
                    <div v-if="!imagePreviews.img1" class="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="mt-2 text-sm text-gray-600">Kéo thả ảnh vào đây</p>
                      <p class="text-xs text-gray-500">hoặc click để chọn</p>
                    </div>
                    
                    <div v-else class="relative">
                      <img :src="imagePreviews.img1" alt="Preview" class="w-full h-32 object-cover rounded" />
                      <button 
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        @click.stop="removeImage('img1')"
                      >
                        ×
                      </button>
                      <div v-if="uploadProgress.img1 > 0 && uploadProgress.img1 < 100" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <div class="text-white text-sm">{{ uploadProgress.img1 }}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- URL Input Alternative -->
                  <div class="mt-2">
                    <input 
                      type="url" 
                      v-model="editingBook.imgURL1" 
                      placeholder="Hoặc nhập URL ảnh"
                      class="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      @input="handleUrlInput('img1')"
                    />
                  </div>
                </div>

                <!-- Image 2 -->
                <div class="space-y-2">
                  <label class="text-sm text-gray-600">Ảnh phụ 1</label>
                  <div 
                    class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-amber-500 transition-colors cursor-pointer"
                    :class="{ 
                      'border-amber-500 bg-amber-50': dragStates.img2,
                      'border-green-500 bg-green-50': imagePreviews.img2
                    }"
                    @dragover.prevent="handleDragOver('img2')"
                    @dragleave.prevent="handleDragLeave('img2')"
                    @drop.prevent="handleDrop($event, 'img2')"
                    @click="triggerFileInput('img2')"
                  >
                    <input 
                      ref="fileInput2"
                      type="file" 
                      class="hidden"
                      accept="image/*"
                      @change="handleFileSelect($event, 'img2')"
                    />
                    
                    <div v-if="!imagePreviews.img2" class="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="mt-2 text-sm text-gray-600">Kéo thả ảnh vào đây</p>
                      <p class="text-xs text-gray-500">hoặc click để chọn</p>
                    </div>
                    
                    <div v-else class="relative">
                      <img :src="imagePreviews.img2" alt="Preview" class="w-full h-32 object-cover rounded" />
                      <button 
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        @click.stop="removeImage('img2')"
                      >
                        ×
                      </button>
                      <div v-if="uploadProgress.img2 > 0 && uploadProgress.img2 < 100" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <div class="text-white text-sm">{{ uploadProgress.img2 }}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-2">
                    <input 
                      type="url" 
                      v-model="editingBook.imgURL2" 
                      placeholder="Hoặc nhập URL ảnh"
                      class="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      @input="handleUrlInput('img2')"
                    />
                  </div>
                </div>

                <!-- Image 3 -->
                <div class="space-y-2">
                  <label class="text-sm text-gray-600">Ảnh phụ 2</label>
                  <div 
                    class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-amber-500 transition-colors cursor-pointer"
                    :class="{ 
                      'border-amber-500 bg-amber-50': dragStates.img3,
                      'border-green-500 bg-green-50': imagePreviews.img3
                    }"
                    @dragover.prevent="handleDragOver('img3')"
                    @dragleave.prevent="handleDragLeave('img3')"
                    @drop.prevent="handleDrop($event, 'img3')"
                    @click="triggerFileInput('img3')"
                  >
                    <input 
                      ref="fileInput3"
                      type="file" 
                      class="hidden"
                      accept="image/*"
                      @change="handleFileSelect($event, 'img3')"
                    />
                    
                    <div v-if="!imagePreviews.img3" class="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="mt-2 text-sm text-gray-600">Kéo thả ảnh vào đây</p>
                      <p class="text-xs text-gray-500">hoặc click để chọn</p>
                    </div>
                    
                    <div v-else class="relative">
                      <img :src="imagePreviews.img3" alt="Preview" class="w-full h-32 object-cover rounded" />
                      <button 
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        @click.stop="removeImage('img3')"
                      >
                        ×
                      </button>
                      <div v-if="uploadProgress.img3 > 0 && uploadProgress.img3 < 100" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <div class="text-white text-sm">{{ uploadProgress.img3 }}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-2">
                    <input 
                      type="url" 
                      v-model="editingBook.imgURL3" 
                      placeholder="Hoặc nhập URL ảnh"
                      class="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      @input="handleUrlInput('img3')"
                    />
                  </div>
                </div>
              </div>

              <!-- Upload Error Display -->
              <div v-if="uploadError" class="mt-2 text-red-600 text-sm">
                {{ uploadError }}
              </div>
            </div>

            <!-- Rest of the form -->
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
                <label class="block text-gray-700 mb-1">Giá (đ)</label>
                <input 
                  type="number" 
                  v-model="editingBook.price" 
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
                  v-model="editingBook.supplier" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Năm xuất bản</label>
                <input 
                  type="number" 
                  v-model="editingBook.publishYear" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Số trang</label>
                <input 
                  type="number" 
                  v-model="editingBook.pageNum" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Ngôn ngữ</label>
                <input 
                  type="text" 
                  v-model="editingBook.language" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Độ tuổi</label>
                <select 
                  v-model="editingBook.ageGroup" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="12">Trên 12 tuổi</option>
                  <option value="18">Trên 18 tuổi</option>
                  <option value="all">Mọi lứa tuổi</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Danh mục</label>
                <select 
                  v-model="editingBook.categoryID" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option v-for="category in allCategories" :key="category.categoryID" :value="category.categoryID">
                    {{ category.categoryName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Hình thức</label>
                <select 
                  v-model="editingBook.binding" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Bìa mềm">Bìa mềm</option>
                  <option value="Bìa cứng">Bìa cứng</option>
                  <option value="Bìa da">Bìa da</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Tồn kho</label>
                <input 
                  type="number" 
                  v-model="editingBook.stock" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                  required
                />
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
                :disabled="isLoading || isUploading"
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
            :disabled="isLoading"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Filter from "./Filter/index.vue";
import axios from "../utils/axios";

// Search functionality
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref(null);

// Image upload states
const isUploading = ref(false);
const uploadError = ref(null);
const dragStates = ref({
  img1: false,
  img2: false,
  img3: false
});
const imagePreviews = ref({
  img1: null,
  img2: null,
  img3: null
});
const uploadProgress = ref({
  img1: 0,
  img2: 0,
  img3: 0
});

// File input refs
const fileInput1 = ref(null);
const fileInput2 = ref(null);
const fileInput3 = ref(null);

// Filter state
const currentFilters = ref({
  promo: false,
  price: null,
  priceMin: null,
  priceMax: null,
  age: null,
  type: null,
  selectedCategoryId: null
});

// Books data
const filteredBooks = ref([]);
const allCategories = ref([]);

// Pagination
const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const totalPages = ref(0);

// Quick view book
const quickViewBook = ref(null);

// Computed pagination
const paginatedBooks = computed(() => {
  return filteredBooks.value;
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Image upload functions
const validateFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)');
  }

  if (file.size > maxSize) {
    throw new Error('Kích thước file không được vượt quá 5MB');
  }

  return true;
};

const handleDragOver = (imageKey) => {
  dragStates.value[imageKey] = true;
};

const handleDragLeave = (imageKey) => {
  dragStates.value[imageKey] = false;
};

const handleDrop = (event, imageKey) => {
  dragStates.value[imageKey] = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFileUpload(files[0], imageKey);
  }
};

const triggerFileInput = (imageKey) => {
  const inputMap = {
    img1: fileInput1,
    img2: fileInput2,
    img3: fileInput3
  };
  inputMap[imageKey].value?.click();
};

const handleFileSelect = (event, imageKey) => {
  const file = event.target.files[0];
  if (file) {
    handleFileUpload(file, imageKey);
  }
};

const handleFileUpload = async (file, imageKey) => {
  try {
    uploadError.value = null;
    validateFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value[imageKey] = e.target.result;
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadImageFile(file, imageKey);

  } catch (err) {
    uploadError.value = err.message;
    console.error('File upload error:', err);
  }
};

// Update the uploadImageFile function to work with the API
const uploadImageFile = async (file, imageKey) => {
  try {
    isUploading.value = true;
    uploadProgress.value[imageKey] = 0;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageType', imageKey);

    const response = await axios.post('/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        uploadProgress.value[imageKey] = progress;
      }
    });

    // Update the corresponding URL field with proper casing for the API
    const urlField = imageKey === 'img1' ? 'imgURL1' : 
                    imageKey === 'img2' ? 'imgURL2' : 'imgURL3';
    editingBook.value[urlField] = response.data.imageUrl;

    uploadProgress.value[imageKey] = 100;
    
  } catch (err) {
    console.error('Upload error:', err);
    uploadError.value = 'Không thể tải ảnh lên. Vui lòng thử lại.';
    removeImage(imageKey);
  } finally {
    isUploading.value = false;
    setTimeout(() => {
      uploadProgress.value[imageKey] = 0;
    }, 1000);
  }
};

const removeImage = (imageKey) => {
  imagePreviews.value[imageKey] = null;
  uploadProgress.value[imageKey] = 0;
  
  // Clear the corresponding URL field
  const urlField = imageKey === 'img1' ? 'imgURL1' : 
                  imageKey === 'img2' ? 'imgURL2' : 'imgURL3';
  editingBook.value[urlField] = '';

  // Reset file input
  const inputMap = {
    img1: fileInput1,
    img2: fileInput2,
    img3: fileInput3
  };
  if (inputMap[imageKey].value) {
    inputMap[imageKey].value.value = '';
  }
};

const handleUrlInput = (imageKey) => {
  const urlField = imageKey === 'img1' ? 'imgURL1' : 
                  imageKey === 'img2' ? 'imgURL2' : 'imgURL3';
  const url = editingBook.value[urlField];
  
  if (url) {
    imagePreviews.value[imageKey] = url;
  } else {
    imagePreviews.value[imageKey] = null;
  }
};

// Reset filters
const resetFilters = () => {
  currentFilters.value = {
    promo: false,
    price: null,
    priceMin: null,
    priceMax: null,
    age: null,
    type: null,
    selectedCategoryId: null
  };
  searchQuery.value = '';
  currentPage.value = 1;
  fetchBooks();
};

// Fetch books from API - Updated to use admin endpoint
const fetchBooks = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.value.toString());
    queryParams.append("pageSize", pageSize.value.toString());
    
    if (searchQuery.value) {
      queryParams.append("search", searchQuery.value);
    }
    
    // Use admin products endpoint
    const response = await axios.get(`/admin/products?${queryParams.toString()}`);
    const data = response.data;

    filteredBooks.value = data.items.map((book) => ({
      bookID: book.bookID,
      title: book.title,
      author: book.author,
      price: book.price,
      discount: book.discount || 0,
      imgURL1: book.imgURL1,
      imgURL2: book.imgURL2,
      imgURL3: book.imgURL3,
      stock: book.stock || 0,
      avgRating: book.avgRating || 0,
      totalRating: book.totalRating || 0,
      description: book.description || '',
      supplier: book.supplier || '',
      publishYear: book.publishYear || new Date().getFullYear(),
      pageNum: book.pageNum || 0,
      language: book.language || 'Tiếng Việt',
      binding: book.binding || 'Bìa mềm',
      ageGroup: book.ageGroup || 'all',
      categoryID: book.categoryID || null,
      discountPrice: book.discount > 0 ? 
        (book.price * (100 - book.discount) / 100) : book.price,
      originalPrice: book.price
    }));

    currentPage.value = data.currentPage;
    totalItems.value = data.totalItems;
    totalPages.value = data.totalPages;
    
  } catch (err) {
    console.error("Error fetching books:", err);
    error.value = "Có lỗi xảy ra khi tải dữ liệu sách. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await axios.get(`/Book/category`);
    
    const categories = [];
    Object.entries(response.data).forEach(([parent, subs]) => {
      subs.forEach(sub => {
        categories.push({
          categoryID: getCategoryId(parent, sub),
          categoryName: `${parent} - ${sub}`
        });
      });
    });
    
    allCategories.value = categories;
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};



// Search books
const searchBooks = () => {
  currentPage.value = 1;
  fetchBooks();
};

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page;
    fetchBooks();
  }
};

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

const calculateDiscountPrice = (price, discount) => {
  if (!discount || discount === 0) return price;
  return price * (100 - discount) / 100;
};

const getCategoryId = (parent, sub) => {
  const categoryMappings = {
    "Sách Tiếng Việt": {
      "Tiểu thuyết": 3,
      "Sách giáo khoa – Tham khảo": 4,
      "Khoa học – Kỹ thuật": 5,
      "Lịch sử – Nghệ thuật - Tôn giáo": 6,
      "Kinh tế": 7,
      "Văn hóa – Địa lý – Du lịch": 8,
      "Chính trị": 9,
    },
    "Foreign Books": {
      "Fantasy & Sci-Fi": 10,
      "Novel": 11,
      "Business & Management": 12,
      "Science & Technology": 13,
      "History & Politics": 14,
    },
  };

  return categoryMappings[parent]?.[sub];
};

// Fetch detailed book info - Updated to use admin endpoint
const fetchProductDetails = async (bookId) => {
  try {
    const response = await axios.get(`/admin/products/${bookId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching book details:', err);
    throw new Error('Không thể tải chi tiết sách.');
  }
};

// Quick view
const openQuickView = async (book) => {
  try {
    isLoading.value = true;
    const detailedBook = await fetchProductDetails(book.bookID);
    quickViewBook.value = {
      ...book,
      ...detailedBook,
      discountPrice: book.discountPrice,
      originalPrice: book.originalPrice
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// Book modal
const showBookModal = ref(false);
const isEditMode = ref(false);
const editingBook = ref({
  bookID: null,
  title: '',
  price: 0,
  discount: 0,
  author: '',
  supplier: '',
  publishYear: new Date().getFullYear(),
  pageNum: 0,
  language: 'Tiếng Việt',
  ageGroup: 'all',
  categoryID: null,
  binding: 'Bìa mềm',
  stock: 0,
  imgURL1: '',
  imgURL2: '',
  imgURL3: '',
  description: '',
  avgRating: 0,
  totalRating: 0
});

// Reset image states when modal opens/closes
const resetImageStates = () => {
  imagePreviews.value = { img1: null, img2: null, img3: null };
  uploadProgress.value = { img1: 0, img2: 0, img3: 0 };
  dragStates.value = { img1: false, img2: false, img3: false };
  uploadError.value = null;
};

// Open add book modal
const openAddBookModal = () => {
  isEditMode.value = false;
  editingBook.value = {
    bookID: null,
    title: '',
    price: 0,
    discount: 0,
    author: '',
    supplier: '',
    publishYear: new Date().getFullYear(),
    pageNum: 0,
    language: 'Tiếng Việt',
    ageGroup: 'all',
    categoryID: allCategories.value[0]?.categoryID || null,
    binding: 'Bìa mềm',
    stock: 0,
    imgURL1: '',
    imgURL2: '',
    imgURL3: '',
    description: '',
    avgRating: 0,
    totalRating: 0
  };
  resetImageStates();
  showBookModal.value = true;
};

// Open edit book modal
const openEditBookModal = (book) => {
  isEditMode.value = true;
  
  // Map the book data to the editing form with proper field names
  editingBook.value = {
    bookID: book.bookID,
    title: book.title || '',
    author: book.author || '',
    description: book.description || '',
    price: Number(book.price) || 0,
    stock: Number(book.stock) || 0,
    categoryID: Number(book.categoryID) || allCategories.value[0]?.categoryID || null,
    discount: Number(book.discount) || 0,
    imgURL1: book.imgURL1 || '',
    imgURL2: book.imgURL2 || '',
    imgURL3: book.imgURL3 || '',
    supplier: book.supplier || '',
    publishYear: Number(book.publishYear) || new Date().getFullYear(),
    pageNum: Number(book.pageNum) || 0,
    language: book.language || 'Tiếng Việt',
    binding: book.binding || 'Bìa mềm',
    ageGroup: book.ageGroup || 'all',
    avgRating: Number(book.avgRating) || 0,
    totalRating: Number(book.totalRating) || 0
  };
  
  // Set image previews for existing images
  imagePreviews.value = {
    img1: book.imgURL1 || null,
    img2: book.imgURL2 || null,
    img3: book.imgURL3 || null
  };
  
  uploadProgress.value = { img1: 0, img2: 0, img3: 0 };
  dragStates.value = { img1: false, img2: false, img3: false };
  uploadError.value = null;
  
  showBookModal.value = true;
  quickViewBook.value = null;
};

// Save book - Updated to use admin endpoints
const saveBook = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Validate required fields
    if (!editingBook.value.title || !editingBook.value.author || !editingBook.value.price) {
      throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc (Tiêu đề, Tác giả, Giá)');
    }

    // Create the book object with exact structure expected by the API
    const bookData = {
      // Only include BookID for updates
      ...(isEditMode.value && editingBook.value.bookID && { bookID: Number(editingBook.value.bookID) }),
      
      title: String(editingBook.value.title).trim(),
      author: String(editingBook.value.author).trim(),
      description: String(editingBook.value.description || '').trim(),
      price: Number(editingBook.value.price),
      stock: Number(editingBook.value.stock) || 0,
      categoryID: Number(editingBook.value.categoryID),
      discount: Number(editingBook.value.discount) || 0,
      
      // Image URLs - ensure they're strings
      imgURL1: String(editingBook.value.imgURL1 || ''),
      imgURL2: String(editingBook.value.imgURL2 || ''),
      imgURL3: String(editingBook.value.imgURL3 || ''),
      
      // Additional fields
      supplier: String(editingBook.value.supplier || '').trim(),
      publishYear: Number(editingBook.value.publishYear) || new Date().getFullYear(),
      pageNum: Number(editingBook.value.pageNum) || 0,
      language: String(editingBook.value.language || 'Tiếng Việt').trim(),
      binding: String(editingBook.value.binding || 'Bìa mềm').trim(),
      ageGroup: String(editingBook.value.ageGroup || 'all').trim(),
      
      // Default values for rating fields
      avgRating: 0,
      totalRating: 0
    };

    // Additional validation
    if (bookData.price <= 0) {
      throw new Error('Giá sách phải lớn hơn 0');
    }
    
    if (bookData.discount < 0 || bookData.discount > 100) {
      throw new Error('Giảm giá phải từ 0% đến 100%');
    }
    
    if (bookData.stock < 0) {
      throw new Error('Số lượng tồn kho không thể âm');
    }
    
    if (!bookData.categoryID || bookData.categoryID <= 0) {
      throw new Error('Vui lòng chọn danh mục');
    }

    console.log('Sending book data:', JSON.stringify(bookData, null, 2));

    let response;
    
    if (isEditMode.value && editingBook.value.bookID) {
      // Update existing book using admin endpoint
      response = await axios.put(`/admin/products/${editingBook.value.bookID}`, bookData);
    } else {
      // Add new book using admin endpoint - remove bookID for creation
      const { bookID, ...createData } = bookData;
      response = await axios.post(`/admin/products`, createData);
    }
    
    console.log('API Response:', response.data);
    
    // Refresh the book list
    await fetchBooks();
    
    // Close modal
    showBookModal.value = false;
    resetImageStates();
    
    // Show success message
    alert(isEditMode.value ? 'Đã cập nhật sách thành công!' : 'Đã thêm sách mới thành công!');
    
  } catch (err) {
    console.error('Error saving book:', err);
    
    // Handle specific error cases
    if (err.response) {
      // Server responded with error status
      const status = err.response.status;
      const data = err.response.data;
      
      console.error('Full error response:', {
        status,
        data,
        headers: err.response.headers,
        config: err.response.config
      });
      
      if (status === 400) {
        // Try to extract more specific error information
        let errorMessage = 'Dữ liệu không hợp lệ. ';
        
        if (data.errors) {
          // Handle validation errors
          const validationErrors = [];
          Object.keys(data.errors).forEach(field => {
            validationErrors.push(`${field}: ${data.errors[field].join(', ')}`);
          });
          errorMessage += validationErrors.join('; ');
        } else if (data.message) {
          errorMessage += data.message;
        } else if (typeof data === 'string') {
          errorMessage += data;
        } else {
          errorMessage += 'Vui lòng kiểm tra lại thông tin đã nhập.';
        }
        
        error.value = errorMessage;
      } else if (status === 401) {
        error.value = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (status === 404) {
        error.value = 'Không tìm thấy API endpoint. Vui lòng liên hệ admin.';
      } else if (status === 422) {
        error.value = data.message || 'Dữ liệu không đúng định dạng.';
      } else if (status === 500) {
        error.value = 'Lỗi server. Vui lòng thử lại sau.';
      } else {
        error.value = data.message || `Lỗi HTTP ${status}. Vui lòng thử lại.`;
      }
    } else if (err.request) {
      // Network error
      error.value = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      console.error('Network error:', err.request);
    } else if (err.message) {
      // Custom error message
      error.value = err.message;
    } else {
      // Unknown error
      error.value = 'Có lỗi không xác định xảy ra. Vui lòng thử lại.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Delete confirmation
const showDeleteConfirmation = ref(false);
const bookToDelete = ref(null);

const confirmDeleteBook = (book) => {
  bookToDelete.value = book;
  showDeleteConfirmation.value = true;
  quickViewBook.value = null;
};

// Delete book - Updated to use admin endpoint
const deleteBook = async () => {
  if (!bookToDelete.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    // Use admin delete endpoint
    await axios.delete(`/admin/products/${bookToDelete.value.bookID}`);
    
    await fetchBooks();
    alert('Đã xóa sách thành công!');
  } catch (err) {
    console.error('Error deleting book:', err);
    
    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;
      
      if (status === 404) {
        error.value = 'Không tìm thấy sách cần xóa.';
      } else if (status === 401) {
        error.value = 'Bạn không có quyền xóa sách.';
      } else {
        error.value = data.message || 'Có lỗi xảy ra khi xóa sách.';
      }
    } else {
      error.value = 'Không thể kết nối đến server. Vui lòng thử lại.';
    }
  } finally {
    isLoading.value = false;
    showDeleteConfirmation.value = false;
    bookToDelete.value = null;
  }
};

// Add function to test API endpoints
const testApiEndpoints = async () => {
  console.log('Testing API endpoints...');
  
  try {
    // Test admin products endpoint
    const adminResponse = await axios.get('/admin/products?page=1&pageSize=5');
    console.log('Admin products API works:', adminResponse.status);
    
    // Test categories endpoint
    const categoriesResponse = await axios.get('/Book/category');
    console.log('Categories API works:', categoriesResponse.status);
    
  } catch (err) {
    console.error('API test failed:', err);
  }
};

// Call test function on mount for debugging
onMounted(async () => {
  await testApiEndpoints();
  await fetchCategories();
  await fetchBooks();
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

/* Drag and drop animations */
.drag-over {
  border-color: #f59e0b;
  background-color: #fef3c7;
}

.upload-progress {
  transition: width 0.3s ease;
}
</style>
