<template>
  <aside
    class="md:bg-[#ffffff] bg-[#f8f5e9] p-4 rounded-lg shadow-sm w-64 font-instrument"
  >
    <h2 class="font-bold text-[#661c1c] mb-2 font-itim text-lg">BỘ LỌC</h2>

    <!-- Parent Categories -->
    <div v-for="(subCategories, parent) in categories" :key="parent">
      <div class="flex items-center space-x-2 font-medium cursor-pointer mb-1">
        {{ parent }}
      </div>

      <!-- Sub Categories -->
      <div class="ml-6 space-y-1 mb-1">
        <div
          v-for="(sub, index) in subCategories"
          :key="index"
          class="flex items-center space-x-2"
        >
          <div
            class="flex items-center space-x-2 cursor-pointer hover:text-[#a50202]"
            :class="{
              'text-[#a50202]':
                filters.selectedCategoryId === getCategoryId(parent, sub.name),
            }"
            @click="
              selectCategory(getCategoryId(parent, sub.name), parent, sub.name)
            "
          >
            <span class="text-sm">
              {{ sub.name }}
              <span
                v-if="sub.totalStock !== undefined"
                class="text-xs text-gray-500"
                >({{ sub.totalStock }})</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-2 border-[#ccc]" />

    <!-- Khuyến mãi -->
    <div class="mb-4">
      <label class="flex items-center space-x-2">
        <!-- Checkbox for promo -->
        <input
          type="checkbox"
          v-model="filters.promo"
          class="appearance-none w-4 h-4 border-2 border-[#400B0B] rounded-sm bg-[#661C1C]/50 checked:bg-[#661C1C] checked:border-[#400B0B] transition custom-checkbox"
        />
        <span>Khuyến mãi</span>
      </label>
    </div>

    <!-- Giá -->
    <div class="mb-4">
      <h3 class="font-semibold mb-1 text-[#661c1c] font-itim text-base">Giá</h3>

      <!-- Checkbox option -->
      <div v-for="price in priceOptions" :key="price.value" class="mb-1">
        <label class="flex items-center space-x-2">
          <!-- Price filters -->
          <input
            type="radio"
            :value="price.value"
            v-model="filters.price"
            :name="'price-option'"
            class="appearance-none w-4 h-4 border-2 border-[#400B0B] rounded-sm bg-[#661C1C]/50 checked:bg-[#661C1C] checked:border-[#400B0B] transition custom-checkbox"
          />
          <span>{{ price.label }}</span>
        </label>
      </div>

      <!-- Nhập tay -->
      <div class="flex items-center space-x-2 mt-2">
        <input
          type="number"
          v-model.number="filters.priceMin"
          placeholder="Tối thiểu"
          @input="filters.price = null"
          class="placeholder:text-[#400b0b] w-full px-3 py-2 text-xs border rounded-md bg-[#661C1C]/50 border-[#ccc] focus:outline-none ring-1 ring-[#400b0b] text-[#400b0b] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span class="text-[#999]">–</span>
        <input
          type="number"
          v-model.number="filters.priceMax"
          placeholder="Tối đa"
          @input="filters.price = null"
          class="placeholder:text-[#400b0b] w-full px-3 py-2 text-xs border rounded-md bg-[#661C1C]/50 border-[#ccc] focus:outline-none ring-1 ring-[#400b0b] text-[#400b0b] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
    </div>

    <hr class="my-2 border-[#ccc]" />

    <!-- Độ tuổi -->
    <div class="mb-4">
      <h3 class="font-semibold mb-1 text-[#661c1c] font-itim text-base">
        Độ tuổi:
      </h3>
      <div v-for="age in ageOptions" :key="age.value" class="mb-1">
        <label class="flex items-center space-x-2">
          <!-- Age filters -->
          <input
            type="radio"
            :value="age.value"
            v-model="filters.age"
            :name="'age-option'"
            class="appearance-none w-4 h-4 border-2 border-[#400B0B] rounded-sm bg-[#661C1C]/50 checked:bg-[#661C1C] checked:border-[#400B0B] transition custom-checkbox"
          />
          <span>{{ age.label }}</span>
        </label>
      </div>
    </div>

    <hr class="my-2 border-[#ccc]" />

    <!-- Hình thức -->
    <div class="mb-4">
      <h3 class="font-semibold mb-1 text-[#661c1c] font-itim text-base">
        Hình thức:
      </h3>
      <div v-for="type in typeOptions" :key="type.value" class="mb-1">
        <label class="flex items-center space-x-2">
          <!-- Type filters -->
          <input
            type="radio"
            :value="type.value"
            v-model="filters.type"
            :name="'type-option'"
            class="appearance-none w-4 h-4 border-2 border-[#400B0B] rounded-sm bg-[#661C1C]/50 checked:bg-[#661C1C] checked:border-[#400B0B] transition custom-checkbox"
          />
          <span>{{ type.label }}</span>
        </label>
      </div>
    </div>

    <hr class="my-2 border-[#ccc]" />

    <!-- Category Management Buttons -->
    <div class="space-y-3">
      <!-- Edit Category Button -->
      <button
        @click="showEditModal = true"
        class="w-full bg-[#661C1C] text-white py-2 px-4 rounded-md hover:bg-[#400B0B] transition-colors text-sm font-medium"
      >
        Sửa danh mục
      </button>

      <!-- Delete Category Button -->
      <button
        @click="showDeleteModal = true"
        class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
      >
        Xóa danh mục
      </button>
    </div>

    <!-- Edit Category Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <h3 class="text-lg font-bold text-[#661c1c] mb-4">Sửa danh mục</h3>

        <div class="space-y-4">
          <!-- Category Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Chọn danh mục con:
            </label>
            <select
              v-model="selectedCategoryForEdit"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#661C1C]"
            >
              <option value="">-- Chọn danh mục --</option>
              <template
                v-for="(subCategories, parent) in categories"
                :key="parent"
              >
                <option
                  v-for="(sub, index) in subCategories"
                  :key="`${parent}-${index}`"
                  :value="`${parent}|${sub.name}`"
                  v-if="subCategories && subCategories.length > 0"
                >
                  {{ parent }} - {{ sub.name }}
                </option>
              </template>
            </select>
          </div>

          <!-- New Category Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục mới:
            </label>
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="Nhập tên danh mục mới"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#661C1C]"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="updateCategory"
            :disabled="!selectedCategoryForEdit || !newCategoryName.trim()"
            class="px-4 py-2 bg-[#661C1C] text-white rounded-md hover:bg-[#400B0B] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Category Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <h3 class="text-lg font-bold text-[#661c1c] mb-4">Xóa danh mục</h3>

        <div class="space-y-4">
          <!-- Category Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Chọn danh mục để xóa:
            </label>
            <select
              v-model="selectedCategoryForDelete"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#661C1C]"
            >
              <option value="">-- Chọn danh mục --</option>
              <template
                v-for="(subCategories, parent) in categories"
                :key="parent"
              >
                <!-- Parent category -->
                <option :value="parent">{{ parent }} (danh mục cha)</option>
                <!-- Subcategories -->
                <option
                  v-for="(sub, index) in subCategories"
                  :key="`${parent}-${index}`"
                  :value="sub.name"
                >
                  {{ parent }} - {{ sub.name }}
                </option>
              </template>
            </select>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p class="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Chỉ có thể xóa danh mục không có sách và
              không có danh mục con khác.
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="deleteCategory"
            :disabled="!selectedCategoryForDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineEmits, ref, defineExpose, onMounted } from "vue";
import { useFilter } from "../composables/useFilter.js";
import axios from "../utils/axios";

const emit = defineEmits(["filterChange"]);
const {
  categories,
  categoryTree,
  filters,
  priceOptions,
  ageOptions,
  typeOptions,
  selectCategory,
  getCategoryId,
  fetchCategories,
} = useFilter(emit);

// Modal states
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Edit category states
const selectedCategoryForEdit = ref("");
const newCategoryName = ref("");

// Delete category states
const selectedCategoryForDelete = ref("");

const updateCategory = async () => {
  try {
    if (!selectedCategoryForEdit.value || !newCategoryName.value.trim()) {
      alert("Vui lòng chọn danh mục và nhập tên mới");
      return;
    }

    const [parentName, subCategoryName] =
      selectedCategoryForEdit.value.split("|");
    const categoryId = getCategoryId(parentName, subCategoryName);

    if (!categoryId) {
      alert("Không tìm thấy ID danh mục");
      return;
    }

    const response = await axios.put(`/Book/category/${categoryId}`, {
      newName: newCategoryName.value.trim(),
      newParentName: parentName, // Giữ nguyên danh mục cha
    });

    if (response.status === 200) {
      alert("Cập nhật danh mục thành công!");
      showEditModal.value = false;
      selectedCategoryForEdit.value = "";
      newCategoryName.value = "";
      // Refresh categories
      await fetchCategories();
    }
  } catch (error) {
    console.error("Error updating category:", error);
    const errorMessage =
      error.response?.data || "Có lỗi xảy ra khi cập nhật danh mục";
    alert(errorMessage);
  }
};

const deleteCategory = async () => {
  try {
    if (!selectedCategoryForDelete.value) {
      alert("Vui lòng chọn danh mục để xóa");
      return;
    }

    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${selectedCategoryForDelete.value}"?`
      )
    ) {
      return;
    }

    console.log(selectedCategoryForDelete.value);

    const response = await axios.delete(
      `/Book/category/${encodeURIComponent(selectedCategoryForDelete.value)}`
    );

    if (response.status === 200) {
      alert("Xóa danh mục thành công!");
      showDeleteModal.value = false;
      selectedCategoryForDelete.value = "";
      // Refresh categories
      await fetchCategories();
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    const errorMessage =
      error.response?.data || "Có lỗi xảy ra khi xóa danh mục";
    alert(errorMessage);
  }
};

defineExpose({ fetchCategories });
</script>

<style>
.custom-checkbox {
  position: relative;
}
.custom-checkbox::after {
  content: "✔";
  @apply text-white text-[10px] absolute top-[0px] left-[2px] opacity-0;
}

.custom-checkbox:checked::after {
  @apply opacity-100;
}
</style>
