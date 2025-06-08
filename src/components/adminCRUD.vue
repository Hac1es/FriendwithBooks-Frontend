<template>
  <div class="min-h-screen py-3">
    <!-- Main Content -->
    <div class="container mx-auto px-4 flex flex-col md:flex-row">
      <!-- Sidebar Filters -->
      <div class="hidden md:block">
        <Filter 
          class="mr-4" 
          @filter-change="handleFilterChange"
          :categories="allCategories"
        />
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
                placeholder="Tìm kiếm theo tên sách hoặc ID sản phẩm" 
                class="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                @keyup.enter="searchBooks"
                @input="onSearchInput"
              />
              <button 
                class="absolute right-2 top-1/2 transform -translate-y-1/2"
                @click="searchBooks"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <!-- Clear search button -->
              <button 
                v-if="searchQuery"
                class="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="clearSearch"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex space-x-2">
              <button 
                class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-sm transition-colors duration-200 flex items-center"
                @click="openAddBookModal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                THÊM SÁCH
              </button>
              <button 
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm transition-colors duration-200 flex items-center"
                @click="openFlashSaleManagement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                FLASH SALE
              </button>
            </div>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="mb-4 flex flex-wrap gap-2">
          <span class="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
          <span v-if="currentFilters.promo" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Khuyến mãi
            <button @click="removeFilter('promo')" class="ml-1 text-blue-600 hover:text-blue-800">×</button>
          </span>
          <span v-if="currentFilters.price" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Giá: {{ getPriceFilterText(currentFilters.price) }}
            <button @click="removeFilter('price')" class="ml-1 text-green-600 hover:text-green-800">×</button>
          </span>
          <span v-if="currentFilters.age" class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            Độ tuổi: {{ getAgeFilterText(currentFilters.age) }}
            <button @click="removeFilter('age')" class="ml-1 text-purple-600 hover:text-purple-800">×</button>
          </span>
          <span v-if="currentFilters.type" class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            Hình thức: {{ getTypeFilterText(currentFilters.type) }}
            <button @click="removeFilter('type')" class="ml-1 text-orange-600 hover:text-orange-800">×</button>
          </span>
          <span v-if="currentFilters.selectedCategoryId" class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
            Danh mục: {{ getCategoryName(currentFilters.selectedCategoryId) }}
            <button @click="removeFilter('category')" class="ml-1 text-indigo-600 hover:text-indigo-800">×</button>
          </span>
          <button @click="clearAllFilters" class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full hover:bg-red-200">
            Xóa tất cả
          </button>
        </div>

        <!-- Search Results Info -->
        <div v-if="searchQuery && !isLoading" class="mb-4 text-sm text-gray-600">
          <span v-if="totalItems > 0">
            Tìm thấy {{ totalItems }} kết quả cho "{{ searchQuery }}"
          </span>
          <span v-else>
            Không tìm thấy kết quả nào cho "{{ searchQuery }}"
          </span>
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
          <p class="mt-1 text-gray-500">
            {{ searchQuery ? 'Thử tìm kiếm với từ khóa khác.' : 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.' }}
          </p>
          <button 
            class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            @click="resetFilters"
          >
            {{ searchQuery ? 'Xóa tìm kiếm' : 'Xóa bộ lọc' }}
          </button>
        </div>
        
        <!-- Product Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="book in filteredBooks" 
            :key="book.bookID" 
            class="bg-white rounded-lg shadow-sm overflow-hidden relative"
          >
            <!-- Product ID Badge -->
            <div class="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-md font-medium z-10">
              ID: {{ book.bookID }}
            </div>
            
            <!-- Flash Sale Badge -->
            <div v-if="book.isFlashSale" class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-medium z-10 animate-pulse">
              FLASH SALE
            </div>
            
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
              
              <!-- Stock info -->
              <div class="text-center text-xs text-gray-500 mt-1">
                Tồn kho: {{ book.stock || 0 }}
              </div>
              
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

        <!-- Enhanced Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <!-- First Page Button with Text -->
            <button 
              @click="changePage(1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 font-medium"
              title="Trang đầu tiên"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span class="hidden sm:inline">Đầu</span>
            </button>
            
            <!-- Previous Page Button -->
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              title="Trang trước"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="hidden sm:inline ml-1">Trước</span>
            </button>
            
            <!-- Page Numbers -->
            <div class="flex items-center space-x-1">
              <!-- Show first page if not in visible range -->
              <template v-if="visiblePages[0] > 1">
                <button 
                  @click="changePage(1)"
                  class="px-3 py-2 rounded-md border bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  1
                </button>
                <span v-if="visiblePages[0] > 2" class="px-2 text-gray-500">...</span>
              </template>
              
              <!-- Visible page numbers -->
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 rounded-md border',
                  page === currentPage 
                    ? 'bg-amber-600 border-amber-600 text-white font-medium' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <!-- Show last page if not in visible range -->
              <template v-if="visiblePages[visiblePages.length - 1] < totalPages">
                <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="px-2 text-gray-500">...</span>
                <button 
                  @click="changePage(totalPages)"
                  class="px-3 py-2 rounded-md border bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {{ totalPages }}
                </button>
              </template>
            </div>
            
            <!-- Next Page Button -->
            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              title="Trang sau"
            >
              <span class="hidden sm:inline mr-1">Sau</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <!-- Last Page Button with Text -->
            <button 
              @click="changePage(totalPages)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 font-medium"
              title="Trang cuối cùng"
            >
              <span class="hidden sm:inline">Cuối</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>

        <!-- Enhanced Pagination Info -->
        <div v-if="totalPages > 1" class="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 space-y-2 sm:space-y-0">
          <div>
            Trang {{ currentPage }} / {{ totalPages }} ({{ totalItems }} sản phẩm)
          </div>
          <div class="flex items-center space-x-4">
            <!-- Quick jump to page -->
            <div class="flex items-center space-x-2">
              <label for="pageJump" class="text-sm">Đi tới trang:</label>
              <input 
                id="pageJump"
                type="number" 
                :min="1" 
                :max="totalPages"
                v-model.number="jumpToPage"
                @keyup.enter="handlePageJump"
                class="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="1"
              />
              <button 
                @click="handlePageJump"
                :disabled="!jumpToPage || jumpToPage < 1 || jumpToPage > totalPages"
                class="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Đi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Flash Sale Management Modal -->
    <div v-if="showFlashSaleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-6xl w-full my-8 max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center p-4 border-b bg-white">
          <h2 class="text-xl font-bold text-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quản lý Flash Sale
          </h2>
          <button @click="showFlashSaleModal = false" class="text-gray-500 hover:text-gray-700 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1">
          <!-- Add New Flash Sale Section -->
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 class="text-lg font-medium text-red-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Thêm Flash Sale mới
            </h3>
            <form @submit.prevent="createFlashSale" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <!-- Book Selection with Search -->
              <div class="lg:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Chọn sách</label>
                <div class="relative">
                  <input 
                    type="text"
                    v-model="bookSearchQuery"
                    @input="filterBooks"
                    @focus="showBookDropdown = true"
                    @blur="handleBookInputBlur"
                    placeholder="Tìm kiếm sách theo tên, tác giả hoặc ID..."
                    class="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  
                  <!-- Dropdown for book selection -->
                  <div v-if="showBookDropdown && filteredBooksForSelection.length > 0" 
                       class="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    <div v-for="book in filteredBooksForSelection.slice(0, 8)" 
                         :key="book.bookID"
                         @mousedown.prevent="selectBook(book)"
                         class="flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                      <img :src="book.imgURL1 || '/placeholder.svg?height=32&width=24'" 
                           alt="" 
                           class="w-6 h-8 object-cover rounded mr-2 flex-shrink-0">
                      <div class="flex-1 min-w-0">
                        <div class="text-xs font-medium text-gray-900 truncate">{{ book.title }}</div>
                        <div class="text-xs text-gray-500">ID: {{ book.bookID }} • {{ book.author }}</div>
                      </div>
                    </div>
                    <div v-if="filteredBooksForSelection.length > 8" class="p-2 text-center text-xs text-gray-500 bg-gray-50">
                      Và {{ filteredBooksForSelection.length - 8 }} sách khác...
                    </div>
                  </div>
                  
                  <!-- Selected book display -->
                  <div v-if="selectedBookForFlashSale" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div class="flex items-center text-sm">
                      <img :src="selectedBookForFlashSale.imgURL1 || '/placeholder.svg?height=32&width=24'" 
                           alt="" 
                           class="w-6 h-8 object-cover rounded mr-2">
                      <div class="flex-1">
                        <div class="font-medium text-gray-900 truncate">{{ selectedBookForFlashSale.title }}</div>
                        <div class="text-xs text-gray-500">ID: {{ selectedBookForFlashSale.bookID }}</div>
                      </div>
                      <button type="button" @click="clearSelectedBookForFlashSale" class="text-red-500 hover:text-red-700 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
                <input 
                  type="number" 
                  v-model="newFlashSale.discountPercent"
                  min="1" 
                  max="90"
                  class="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="20"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                <input 
                  type="datetime-local" 
                  v-model="newFlashSale.startTime"
                  class="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                <input 
                  type="datetime-local" 
                  v-model="newFlashSale.endTime"
                  class="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>
              
              <div class="lg:col-span-5 flex justify-end">
                <button 
                  type="submit"
                  :disabled="!canCreateFlashSale || isLoading"
                  class="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Tạo Flash Sale
                </button>
              </div>
            </form>
          </div>

          <!-- Flash Sales List -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-800">Danh sách Flash Sale</h3>
              <div class="text-sm text-gray-500">
                Tổng: {{ allFlashSales.length }}
              </div>
            </div>
            
            <!-- Filter tabs -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button 
                @click="flashSaleFilter = 'all'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  flashSaleFilter === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                Tất cả ({{ allFlashSales.length }})
              </button>
              <button 
                @click="flashSaleFilter = 'active'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  flashSaleFilter === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                Hoạt động ({{ activeFlashSales.length }})
              </button>
              <button 
                @click="flashSaleFilter = 'upcoming'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  flashSaleFilter === 'upcoming' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                Sắp tới ({{ upcomingFlashSales.length }})
              </button>
              <button 
                @click="flashSaleFilter = 'expired'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  flashSaleFilter === 'expired' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                Đã kết thúc ({{ expiredFlashSales.length }})
              </button>
            </div>

            <!-- Flash Sales Table -->
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sách</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="flashSale in filteredFlashSales" :key="flashSale.flashSaleID" class="hover:bg-gray-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center">
                          <img :src="flashSale.bookImgURL || '/placeholder.svg?height=32&width=24'" alt="" class="w-8 h-10 object-cover rounded mr-3">
                          <div class="min-w-0 flex-1">
                            <div class="text-sm font-medium text-gray-900 truncate">{{ flashSale.bookTitle }}</div>
                            <div class="text-xs text-gray-500">ID: {{ flashSale.bookID }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{{ flashSale.discountPercent }}%
                        </span>
                      </td>
                      <td class="px-4 py-3 text-xs text-gray-900">
                        <div>{{ formatDateTime(flashSale.startTime) }}</div>
                        <div class="text-gray-500">{{ formatDateTime(flashSale.endTime) }}</div>
                      </td>
                      <td class="px-4 py-3">
                        <span :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          getFlashSaleStatus(flashSale) === 'active' ? 'bg-green-100 text-green-800' :
                          getFlashSaleStatus(flashSale) === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        ]">
                          {{ getFlashSaleStatusText(flashSale) }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex space-x-2">
                          <button 
                            @click="editFlashSale(flashSale)"
                            class="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            :disabled="getFlashSaleStatus(flashSale) === 'expired'"
                          >
                            Sửa
                          </button>
                          <button 
                            @click="deleteFlashSale(flashSale.flashSaleID)"
                            class="text-red-600 hover:text-red-800 text-xs font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="filteredFlashSales.length === 0" class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p class="text-sm text-gray-500">Không có Flash Sale nào</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Flash Sale Modal -->
    <div v-if="showEditFlashSaleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-bold text-red-600">Chỉnh sửa Flash Sale</h2>
          <button @click="showEditFlashSaleModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <form @submit.prevent="updateFlashSale" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
              <input 
                type="number" 
                v-model="editingFlashSale.discountPercent"
                min="1" 
                max="90"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
              <input 
                type="datetime-local" 
                v-model="editingFlashSale.startTime"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
              <input 
                type="datetime-local" 
                v-model="editingFlashSale.endTime"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                required
              />
            </div>
            <div class="flex justify-end space-x-3 pt-2">
              <button 
                type="button"
                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                @click="showEditFlashSaleModal = false"
              >
                Hủy
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                :disabled="isLoading"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Book Modal -->
    <div v-if="showBookModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-5xl w-full my-8 max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center p-4 border-b bg-white">
          <h2 class="text-lg font-bold">{{ isEditMode ? 'Chỉnh sửa sách' : 'Thêm sách mới' }}</h2>
          <button @click="showBookModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1">
          <form @submit.prevent="saveBook">
            <!-- Image Upload Section -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2 font-medium text-sm">Hình ảnh sản phẩm</label>
              <div class="grid grid-cols-3 gap-3">
                <!-- Image 1 -->
                <div class="space-y-1">
                  <label class="text-xs text-gray-600">Ảnh chính</label>
                  <div 
                    class="relative border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-amber-500 transition-colors cursor-pointer h-32"
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
                    
                    <div v-if="!imagePreviews.img1" class="text-center h-full flex flex-col justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="mt-1 text-xs text-gray-600">Kéo thả ảnh</p>
                    </div>
                    
                    <div v-else class="relative h-full">
                      <img :src="imagePreviews.img1" alt="Preview" class="w-full h-full object-cover rounded" />
                      <button 
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        @click.stop="removeImage('img1')"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <input 
                    type="url" 
                    v-model="editingBook.imgURL1" 
                    placeholder="URL ảnh"
                    class="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    @input="handleUrlInput('img1')"
                  />
                </div>

                <!-- Image 2 -->
                <div class="space-y-1">
                  <label class="text-xs text-gray-600">Ảnh phụ 1</label>
                  <div 
                    class="relative border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-amber-500 transition-colors cursor-pointer h-32"
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
                    
                    <div v-if="!imagePreviews.img2" class="text-center h-full flex flex-col justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="mt-1 text-xs text-gray-600">Kéo thả ảnh</p>
                    </div>
                    
                    <div v-else class="relative h-full">
                      <img :src="imagePreviews.img2" alt="Preview" class="w-full h-full object-cover rounded" />
                      <button 
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        @click.stop="removeImage('img2')"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <input 
                    type="url" 
                    v-model="editingBook.imgURL2" 
                    placeholder="URL ảnh"
                    class="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    @input="handleUrlInput('img2')"
                  />
                </div>

                <!-- Image 3 -->
                <div class="space-y-1">
                  <label class="text-xs text-gray-600">Ảnh phụ 2</label>
                  <div 
                    class="relative border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-amber-500 transition-colors cursor-pointer h-32"
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
                    
                    <div v-if="!imagePreviews.img3" class="text-center h-full flex flex-col justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="mt-1 text-xs text-gray-600">Kéo thả ảnh</p>
                    </div>
                    
                    <div v-else class="relative h-full">
                      <img :src="imagePreviews.img3" alt="Preview" class="w-full h-full object-cover rounded" />
                      <button 
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        @click.stop="removeImage('img3')"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <input 
                    type="url" 
                    v-model="editingBook.imgURL3" 
                    placeholder="URL ảnh"
                    class="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    @input="handleUrlInput('img3')"
                  />
                </div>
              </div>
              <div v-if="uploadError" class="mt-2 text-red-600 text-xs">{{ uploadError }}</div>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="lg:col-span-3">
                <label class="block text-gray-700 mb-1 text-sm font-medium">Tiêu đề *</label>
                <input 
                  type="text" 
                  v-model="editingBook.title" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Tác giả *</label>
                <input 
                  type="text" 
                  v-model="editingBook.author" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Nhà xuất bản *</label>
                <input 
                  type="text" 
                  v-model="editingBook.supplier" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Danh mục *</label>
                <select 
                  v-model="editingBook.categoryID" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                >
                  <option v-for="category in allCategories" :key="category.categoryID" :value="category.categoryID">
                    {{ category.categoryName }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Giá (đ) *</label>
                <input 
                  type="number" 
                  v-model="editingBook.price" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Giảm giá (%)</label>
                <input 
                  type="number" 
                  v-model="editingBook.discount" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Tồn kho *</label>
                <input 
                  type="number" 
                  v-model.number="editingBook.stock" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  min="0"
                  step="1"
                  required
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Năm xuất bản</label>
                <input 
                  type="number" 
                  v-model.number="editingBook.publishYear" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  min="1000"
                  max="2030"
                  step="1"
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Số trang</label>
                <input 
                  type="number" 
                  v-model="editingBook.pageNum" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Ngôn ngữ</label>
                <input 
                  type="text" 
                  v-model="editingBook.language" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Độ tuổi</label>
                <select 
                  v-model="editingBook.ageGroup" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                >
                  <option value="12">Trên 12 tuổi</option>
                  <option value="18">Trên 18 tuổi</option>
                  <option value="all">Mọi lứa tuổi</option>
                </select>
              </div>
              
              <div>
                <label class="block text-gray-700 mb-1 text-sm font-medium">Hình thức</label>
                <select 
                  v-model="editingBook.binding" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                >
                  <option value="Bìa mềm">Bìa mềm</option>
                  <option value="Bìa cứng">Bìa cứng</option>
                  <option value="Bìa da">Bìa da</option>
                </select>
              </div>
              
              <div class="lg:col-span-3">
                <label class="block text-gray-700 mb-1 text-sm font-medium">Mô tả *</label>
                <textarea 
                  v-model="editingBook.description" 
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                ></textarea>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                @click="showBookModal = false"
              >
                Hủy
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm"
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
              <!-- Info Section -->
              <div class="space-y-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ quickViewBook.title }}</h3>
                  <p class="text-gray-600">{{ quickViewBook.author }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">ID:</span>
                    <span class="font-medium ml-2">{{ quickViewBook.bookID }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Nhà xuất bản:</span>
                    <span class="font-medium ml-2">{{ quickViewBook.supplier || 'Không có thông tin' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Năm xuất bản:</span>
                    <span class="font-medium ml-2">{{ 
                      quickViewBook.publishYear 
                        ? (typeof quickViewBook.publishYear === 'string' 
                            ? new Date(quickViewBook.publishYear).getFullYear() 
                            : quickViewBook.publishYear)
                        : 'Không có thông tin' 
                    }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Số trang:</span>
                    <span class="font-medium ml-2">{{ quickViewBook.pageNum }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Ngôn ngữ:</span>
                    <span class="font-medium ml-2">{{ quickViewBook.language }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Hình thức:</span>
                    <span class="font-medium ml-2">{{ quickViewBook.binding }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Độ tuổi:</span>
                    <span class="font-medium ml-2">{{ getAgeFilterText(quickViewBook.ageGroup) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Tồn kho:</span>
                    <span class="font-medium ml-2">{{ quickViewBook.stock !== undefined ? quickViewBook.stock : 'Không có thông tin' }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-2xl font-bold text-green-600">{{ formatPrice(calculateDiscountPrice(quickViewBook.price, quickViewBook.discount)) }} đ</span>
                    <span v-if="quickViewBook.discount > 0" class="bg-red-500 text-white text-xs px-2 py-1 rounded">-{{ quickViewBook.discount }}%</span>
                  </div>
                  <div v-if="quickViewBook.discount > 0" class="text-gray-500 line-through">{{ formatPrice(quickViewBook.price) }} đ</div>
                </div>

                <div v-if="quickViewBook.description" class="space-y-2">
                  <h4 class="font-medium text-gray-900">Mô tả:</h4>
                  <p class="text-gray-600 text-sm">{{ quickViewBook.description }}</p>
                </div>

                <div class="flex space-x-2 pt-4">
                  <button 
                    class="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex-1"
                    @click="openEditBookModal(quickViewBook)"
                  >
                    Chỉnh sửa
                  </button>
                  <button 
                    class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex-1"
                    @click="confirmDeleteBook(quickViewBook)"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
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
const searchTimeout = ref(null);

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
const allBooks = ref([]);

// Pagination
const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const totalPages = ref(0);
const jumpToPage = ref(null);

// Quick view book
const quickViewBook = ref(null);

// Flash Sale Management
const showFlashSaleModal = ref(false);
const showEditFlashSaleModal = ref(false);
const allFlashSales = ref([]);
const flashSaleFilter = ref('all');
const newFlashSale = ref({
  bookID: '',
  discountPercent: null,
  startTime: '',
  endTime: ''
});
const editingFlashSale = ref({
  flashSaleID: null,
  discountPercent: null,
  startTime: '',
  endTime: ''
});

// Book selection for flash sale
const bookSearchQuery = ref('');
const showBookDropdown = ref(false);
const selectedBookForFlashSale = ref(null);
const filteredBooksForSelection = ref([]);

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

// Delete confirmation
const showDeleteConfirmation = ref(false);
const bookToDelete = ref(null);

// Computed properties
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

const hasActiveFilters = computed(() => {
  return currentFilters.value.promo || 
         currentFilters.value.price || 
         currentFilters.value.age || 
         currentFilters.value.type || 
         currentFilters.value.selectedCategoryId;
});

const canCreateFlashSale = computed(() => {
  return selectedBookForFlashSale.value && 
         newFlashSale.value.discountPercent && 
         newFlashSale.value.discountPercent >= 1 &&
         newFlashSale.value.discountPercent <= 90 &&
         newFlashSale.value.startTime && 
         newFlashSale.value.endTime &&
         new Date(newFlashSale.value.startTime) < new Date(newFlashSale.value.endTime);
});

const activeFlashSales = computed(() => {
  const now = new Date();
  return allFlashSales.value.filter(fs => 
    new Date(fs.startTime) <= now && new Date(fs.endTime) >= now
  );
});

const upcomingFlashSales = computed(() => {
  const now = new Date();
  return allFlashSales.value.filter(fs => new Date(fs.startTime) > now);
});

const expiredFlashSales = computed(() => {
  const now = new Date();
  return allFlashSales.value.filter(fs => new Date(fs.endTime) < now);
});

const filteredFlashSales = computed(() => {
  switch (flashSaleFilter.value) {
    case 'active':
      return activeFlashSales.value;
    case 'upcoming':
      return upcomingFlashSales.value;
    case 'expired':
      return expiredFlashSales.value;
    default:
      return allFlashSales.value;
  }
});

// Enhanced search functionality
const isSearching = computed(() => {
  return searchQuery.value && searchQuery.value.trim().length > 0;
});

const isNumericSearch = computed(() => {
  return isSearching.value && /^\d+$/.test(searchQuery.value.trim());
});

// Filter handling
const handleFilterChange = (filters) => {
  currentFilters.value = { ...filters };
  currentPage.value = 1;
  fetchBooks();
};

const removeFilter = (filterType) => {
  switch (filterType) {
    case 'promo':
      currentFilters.value.promo = false;
      break;
    case 'price':
      currentFilters.value.price = null;
      currentFilters.value.priceMin = null;
      currentFilters.value.priceMax = null;
      break;
    case 'age':
      currentFilters.value.age = null;
      break;
    case 'type':
      currentFilters.value.type = null;
      break;
    case 'category':
      currentFilters.value.selectedCategoryId = null;
      break;
  }
  currentPage.value = 1;
  fetchBooks();
};

const clearAllFilters = () => {
  currentFilters.value = {
    promo: false,
    price: null,
    priceMin: null,
    priceMax: null,
    age: null,
    type: null,
    selectedCategoryId: null
  };
  currentPage.value = 1;
  fetchBooks();
};

// Filter text helpers
const getPriceFilterText = (price) => {
  switch (price) {
    case 'lt100': return 'Dưới 100k';
    case 'btw100_300': return '100k - 300k';
    case 'gt300': return 'Trên 300k';
    default: return price;
  }
};

const getAgeFilterText = (age) => {
  switch (age) {
    case '12': return 'Trên 12 tuổi';
    case '18': return 'Trên 18 tuổi';
    case 'all': return 'Mọi lứa tuổi';
    default: return age;
  }
};

const getTypeFilterText = (type) => {
  switch (type) {
    case 'soft': return 'Bìa mềm';
    case 'hard': return 'Bìa cứng';
    case 'leather': return 'Bìa da';
    default: return type;
  }
};

const getCategoryName = (categoryId) => {
  const category = allCategories.value.find(c => c.categoryID === categoryId);
  return category ? category.categoryName : 'Không xác định';
};

// Flash Sale Management Functions
const openFlashSaleManagement = async () => {
  showFlashSaleModal.value = true;
  await fetchAllFlashSales();
  await fetchAllBooks();
};

const fetchAllFlashSales = async () => {
  try {
    const response = await axios.get('/admin/flash-sale');
    allFlashSales.value = response.data;
  } catch (err) {
    console.error('Error fetching flash sales:', err);
    error.value = 'Không thể tải danh sách Flash Sale';
  }
};

const fetchAllBooks = async () => {
  try {
    // Fetch multiple pages to get all books
    let allBooksData = [];
    let currentPage = 1;
    let hasMorePages = true;
    
    while (hasMorePages && currentPage <= 10) { // Limit to 10 pages to avoid infinite loop
      const response = await axios.get(`/admin/products?page=${currentPage}&pageSize=100`);
      const data = response.data;
      
      if (data.items && data.items.length > 0) {
        allBooksData = [...allBooksData, ...data.items];
        hasMorePages = currentPage < data.totalPages;
        currentPage++;
      } else {
        hasMorePages = false;
      }
    }
    
    allBooks.value = allBooksData;
    filteredBooksForSelection.value = allBooksData;
  } catch (err) {
    console.error('Error fetching all books:', err);
    // Fallback: try to get books from the current filtered list
    if (filteredBooks.value.length > 0) {
      allBooks.value = filteredBooks.value;
      filteredBooksForSelection.value = filteredBooks.value;
    }
  }
};

const filterBooks = () => {
  if (!bookSearchQuery.value.trim()) {
    filteredBooksForSelection.value = allBooks.value;
    return;
  }
  
  const query = bookSearchQuery.value.toLowerCase().trim();
  filteredBooksForSelection.value = allBooks.value.filter(book => {
    const titleMatch = book.title && book.title.toLowerCase().includes(query);
    const authorMatch = book.author && book.author.toLowerCase().includes(query);
    const idMatch = book.bookID && book.bookID.toString().includes(query);
    const supplierMatch = book.supplier && book.supplier.toLowerCase().includes(query);
    
    return titleMatch || authorMatch || idMatch || supplierMatch;
  });
};

const createFlashSale = async () => {
  try {
    isLoading.value = true;
    
    // Validate required fields
    if (!selectedBookForFlashSale.value) {
      alert('Vui lòng chọn sách');
      return;
    }
    
    if (!newFlashSale.value.discountPercent || newFlashSale.value.discountPercent < 1 || newFlashSale.value.discountPercent > 90) {
      alert('Vui lòng nhập phần trăm giảm giá từ 1% đến 90%');
      return;
    }
    
    if (!newFlashSale.value.startTime) {
      alert('Vui lòng chọn thời gian bắt đầu');
      return;
    }
    
    if (!newFlashSale.value.endTime) {
      alert('Vui lòng chọn thời gian kết thúc');
      return;
    }
    
    const startTime = new Date(newFlashSale.value.startTime);
    const endTime = new Date(newFlashSale.value.endTime);
    
    if (startTime >= endTime) {
      alert('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
      return;
    }
    
    const flashSaleData = {
      bookID: parseInt(selectedBookForFlashSale.value.bookID),
      discountPercent: parseInt(newFlashSale.value.discountPercent),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    };

    console.log('Sending flash sale data:', flashSaleData);

    await axios.post('/admin/flash-sale', flashSaleData);
    
    // Reset form
    newFlashSale.value = {
      bookID: '',
      discountPercent: null,
      startTime: '',
      endTime: ''
    };
    
    // Clear selected book
    clearSelectedBookForFlashSale();
    
    // Refresh flash sales list
    await fetchAllFlashSales();
    
    alert('Đã thêm Flash Sale thành công!');
    
  } catch (err) {
    console.error('Error creating flash sale:', err);
    
    let errorMessage = 'Có lỗi xảy ra khi thêm Flash Sale.';
    
    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;
      
      if (status === 400) {
        if (data.message) {
          errorMessage = data.message;
        } else if (data.errors) {
          const validationErrors = [];
          Object.keys(data.errors).forEach(field => {
            validationErrors.push(`${field}: ${data.errors[field].join(', ')}`);
          });
          errorMessage = validationErrors.join('; ');
        } else {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
      } else if (status === 401) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (status === 404) {
        errorMessage = 'Không tìm thấy API endpoint. Vui lòng liên hệ admin.';
      } else if (status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (err.request) {
      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    alert(errorMessage);
  } finally {
    isLoading.value = false;
  }
};

const editFlashSale = (flashSale) => {
  editingFlashSale.value = {
    flashSaleID: flashSale.flashSaleID,
    discountPercent: flashSale.discountPercent,
    startTime: new Date(flashSale.startTime).toISOString().slice(0, 16),
    endTime: new Date(flashSale.endTime).toISOString().slice(0, 16)
  };
  showEditFlashSaleModal.value = true;
};

const updateFlashSale = async () => {
  try {
    isLoading.value = true;
    
    const updateData = {
      discountPercent: parseInt(editingFlashSale.value.discountPercent),
      startTime: new Date(editingFlashSale.value.startTime).toISOString(),
      endTime: new Date(editingFlashSale.value.endTime).toISOString()
    };

    await axios.put(`/admin/flash-sale/${editingFlashSale.value.flashSaleID}`, updateData);
    
    showEditFlashSaleModal.value = false;
    await fetchAllFlashSales();
    
    alert('Đã cập nhật Flash Sale thành công!');
  } catch (err) {
    console.error('Error updating flash sale:', err);
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert('Có lỗi xảy ra khi cập nhật Flash Sale.');
    }
  } finally {
    isLoading.value = false;
  }
};

const deleteFlashSale = async (flashSaleId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa Flash Sale này?')) {
    return;
  }
  
  try {
    await axios.delete(`/admin/flash-sale/${flashSaleId}`);
    await fetchAllFlashSales();
    alert('Đã xóa Flash Sale thành công!');
  } catch (err) {
    console.error('Error deleting flash sale:', err);
    alert('Có lỗi xảy ra khi xóa Flash Sale.');
  }
};

const getFlashSaleStatus = (flashSale) => {
  const now = new Date();
  const startTime = new Date(flashSale.startTime);
  const endTime = new Date(flashSale.endTime);
  
  if (now < startTime) return 'upcoming';
  if (now >= startTime && now <= endTime) return 'active';
  return 'expired';
};

const getFlashSaleStatusText = (flashSale) => {
  const status = getFlashSaleStatus(flashSale);
  switch (status) {
    case 'active': return 'Đang hoạt động';
    case 'upcoming': return 'Sắp diễn ra';
    case 'expired': return 'Đã kết thúc';
    default: return 'Không xác định';
  }
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN');
};

// Debounced search input handler
const onSearchInput = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value !== searchQuery.value.trim()) {
      searchQuery.value = searchQuery.value.trim();
    }
    searchBooks();
  }, 300);
};

// Clear search
const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  fetchBooks();
};

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
  
  const urlField = imageKey === 'img1' ? 'imgURL1' : 
                  imageKey === 'img2' ? 'imgURL2' : 'imgURL3';
  editingBook.value[urlField] = '';

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

// Enhanced fetch books function with search and filter support
// Trong adminCRUD.vue, thay đổi hàm fetchBooks
const fetchBooks = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const queryParams = new URLSearchParams({
      page: currentPage.value,
      pageSize: pageSize.value
    });

    // Add search parameter
    if (isSearching.value) {
      if (isNumericSearch.value) {
        queryParams.append('id', searchQuery.value.trim());
      } else {
        queryParams.append('title', searchQuery.value.trim());
      }
    }

    // Add filter parameters
    if (currentFilters.value.promo) {
      queryParams.append('promo', 'true');
    }
    
    if (currentFilters.value.price) {
      queryParams.append('price', currentFilters.value.price);
    }
    
    if (currentFilters.value.age) {
      queryParams.append('age', currentFilters.value.age);
    }
    
    if (currentFilters.value.type) {
      queryParams.append('type', currentFilters.value.type);
    }
    
    if (currentFilters.value.selectedCategoryId) {
      queryParams.append('categoryId', currentFilters.value.selectedCategoryId);
    }

    console.log('Fetching with params:', queryParams.toString());

    // Sử dụng endpoint admin mới
    const response = await axios.get(`/Book/admin/query?${queryParams.toString()}`);
    const data = response.data;

    console.log('API Response:', data);

    // Get flash sales to mark books
    const flashSalesResponse = await axios.get('/Home/FlashSale');
    const flashSaleBooks = new Set(flashSalesResponse.data.map(fs => fs.bookID));

    // Mapping dữ liệu với đầy đủ thông tin
    filteredBooks.value = data.items.map((book) => ({
      ...book,
      isFlashSale: flashSaleBooks.has(book.bookID),
      discountPrice: book.discount > 0 ? book.price * (100 - book.discount) / 100 : book.price,
      originalPrice: book.price
    }));

    currentPage.value = data.currentPage;
    totalItems.value = data.totalItems;
    totalPages.value = data.totalPages;
    
  } catch (err) {
    console.error("Error fetching books:", err);
    
    if (err.response && err.response.status === 404 && isSearching.value) {
      filteredBooks.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
      currentPage.value = 1;
    } else {
      error.value = 'Không thể tải danh sách sách. Vui lòng thử lại.';
    }
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

// Enhanced search books function
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

// Fetch detailed book info
const fetchProductDetails = async (bookId) => {
  try {
    const response = await axios.get(`/admin/products/${bookId}`);
    console.log('Detailed book response:', response.data); // Debug log
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
    
    // Fetch detailed book info
    const detailedBook = await fetchProductDetails(book.bookID);
    
    // Merge data, prioritizing detailed book data
    quickViewBook.value = {
      ...book,           // Base data from list
      ...detailedBook,   // Detailed data from API (this should override)
      // Ensure these fields are properly set
      stock: detailedBook.stock !== undefined ? detailedBook.stock : (book.stock || 0),
      supplier: detailedBook.supplier || book.supplier || 'Không có',
      description: detailedBook.description || book.description || '',
    };
    
    console.log('Quick view book data:', quickViewBook.value); // Debug log
  } catch (err) {
    console.error('Error in openQuickView:', err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

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
const openEditBookModal = async (book) => {
  console.log('Opening edit modal for book:', book);
  
  isEditMode.value = true;
  
  // Xử lý publishYear từ DateTime sang năm
  let publishYear = new Date().getFullYear();
  if (book.publishYear) {
    if (typeof book.publishYear === 'string') {
      // Nếu là string DateTime, extract năm
      const year = new Date(book.publishYear).getFullYear();
      publishYear = isNaN(year) ? new Date().getFullYear() : year;
    } else if (typeof book.publishYear === 'number') {
      // Nếu đã là số năm
      publishYear = book.publishYear;
    }
  }
  
  editingBook.value = {
    bookID: book.bookID,
    title: book.title || '',
    author: book.author || '',
    description: book.description || '',
    price: Number(book.price) || 0,
    stock: parseInt(book.stock) || 0,
    categoryID: Number(book.categoryID) || allCategories.value[0]?.categoryID || null,
    discount: Number(book.discount) || 0,
    imgURL1: book.imgURL1 || '',
    imgURL2: book.imgURL2 || '',
    imgURL3: book.imgURL3 || '',
    supplier: book.supplier || '',
    publishYear: publishYear, // Sử dụng năm đã xử lý
    pageNum: Number(book.pageNum) || 0,
    language: book.language || 'Tiếng Việt',
    binding: book.binding || 'Bìa mềm',
    ageGroup: book.ageGroup || 'all',
    avgRating: Number(book.avgRating) || 0,
    totalRating: Number(book.totalRating) || 0
  };
  
  console.log('Editing book data:', editingBook.value);
  
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

// Save book
const saveBook = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    if (!editingBook.value.title || !editingBook.value.author || !editingBook.value.price) {
      throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc (Tiêu đề, Tác giả, Giá)');
    }

    // Xử lý publishYear - chuyển năm thành DateTime cho backend
    const publishYear = Number(editingBook.value.publishYear) || new Date().getFullYear();


    const bookData = {
      ...(isEditMode.value && editingBook.value.bookID && { bookID: Number(editingBook.value.bookID) }),
      
      title: String(editingBook.value.title).trim(),
      author: String(editingBook.value.author).trim(),
      description: String(editingBook.value.description || '').trim(),
      price: Number(editingBook.value.price),
      stock: parseInt(editingBook.value.stock) || 0,
      categoryID: Number(editingBook.value.categoryID),
      discount: Number(editingBook.value.discount) || 0,
      
      imgURL1: String(editingBook.value.imgURL1 || ''),
      imgURL2: String(editingBook.value.imgURL2 || ''),
      imgURL3: String(editingBook.value.imgURL3 || ''),
      
      supplier: String(editingBook.value.supplier || '').trim(),
      publishYear: publishYear, // Gửi như DateTime
      pageNum: Number(editingBook.value.pageNum) || 0,
      language: String(editingBook.value.language || 'Tiếng Việt').trim(),
      binding: String(editingBook.value.binding || 'Bìa mềm').trim(),
      ageGroup: String(editingBook.value.ageGroup || 'all').trim(),
      
      avgRating: 0,
      totalRating: 0
    };

    if (bookData.price <= 0) {
      throw new Error('Giá sách phải lớn hơn 0');
    }
    
    if (bookData.discount < 0 || bookData.discount > 100) {
      throw new Error('Giảm giá phải từ 0% đến 100%');
    }
    
    if (bookData.stock < 0) {
      throw new Error('Số lượng tồn kho không thể âm');
    }
    
    if (!Number.isInteger(bookData.stock)) {
      throw new Error('Số lượng tồn kho phải là số nguyên');
    }
    
    if (!bookData.categoryID || bookData.categoryID <= 0) {
      throw new Error('Vui lòng chọn danh mục');
    }

    let response;
    
    if (isEditMode.value && editingBook.value.bookID) {
      response = await axios.put(`/admin/products/${editingBook.value.bookID}`, bookData);
    } else {
      const { bookID, ...createData } = bookData;
      response = await axios.post(`/admin/products`, createData);
    }
    
    await fetchBooks();
    
    showBookModal.value = false;
    resetImageStates();
    
    alert(isEditMode.value ? 'Đã cập nhật sách thành công!' : 'Đã thêm sách mới thành công!');
    
  } catch (err) {
    console.error('Error saving book:', err);
    
    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;
      
      if (status === 400) {
        let errorMessage = 'Dữ liệu không hợp lệ. ';
        
        if (data.errors) {
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
      error.value = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      console.error('Network error:', err.request);
    } else if (err.message) {
      error.value = err.message;
    } else {
      error.value = 'Có lỗi không xác định xảy ra. Vui lòng thử lại.';
    }
  } finally {
    isLoading.value = false;
  }
};

const handlePageJump = () => {
  if (jumpToPage.value && jumpToPage.value >= 1 && jumpToPage.value <= totalPages.value) {
    changePage(jumpToPage.value);
    jumpToPage.value = null;
  }
};

const confirmDeleteBook = (book) => {
  bookToDelete.value = book;
  showDeleteConfirmation.value = true;
  quickViewBook.value = null;
};

const deleteBook = async () => {
  if (!bookToDelete.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
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

// Watch for search query changes
watch(searchQuery, (newValue) => {
  if (!newValue || newValue.trim() === '') {
    if (filteredBooks.value.length === 0 && !isLoading.value) {
      fetchBooks();
    }
  }
});

const handleBookInputBlur = () => {
  // Delay hiding dropdown to allow click events to fire
  setTimeout(() => {
    showBookDropdown.value = false;
  }, 200);
};

const selectBook = (book) => {
  selectedBookForFlashSale.value = book;
  newFlashSale.value.bookID = book.bookID;
  bookSearchQuery.value = `${book.title} (ID: ${book.bookID})`;
  showBookDropdown.value = false;
};

const clearSelectedBookForFlashSale = () => {
  selectedBookForFlashSale.value = null;
  newFlashSale.value.bookID = '';
  bookSearchQuery.value = '';
  showBookDropdown.value = false;
  filteredBooksForSelection.value = allBooks.value;
};

// Initialize
onMounted(async () => {
  await fetchCategories();
  await fetchBooks();
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showBookDropdown.value = false;
    }
  });
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

/* Search input enhancements */
.search-input:focus {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* Product card hover effects */
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Pagination button styles */
.pagination-btn {
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ID badge styles */
.id-badge {
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Flash sale badge animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>