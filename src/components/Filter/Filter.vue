<template>
  <aside
    class="md:bg-[#ffffff] bg-[#f8f5e9] p-4 rounded-lg shadow-sm w-64 font-instrument max-h-[900px]"
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
                filters.selectedCategoryId === getCategoryId(parent, sub),
            }"
            @click="selectCategory(getCategoryId(parent, sub), parent, sub)"
          >
            <span class="text-sm">{{ sub }}</span>
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
    <div>
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
  </aside>
</template>

<script setup>
import { ref, reactive, watch, onMounted, defineEmits } from "vue";
import axios from "axios";

const categories = ref({});

const categoryTree = ref({ parent: null, sub: null });

const emitFilter = () => {
  emit("filterChange", {
    filters: { ...filters },
    categoryTree: { ...categoryTree.value },
  });
};

onMounted(async () => {
  try {
    const response = await axios.get(
      "https://localhost:7129/api/Book/category"
    );
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

const filters = reactive({
  promo: false,
  price: null,
  priceMin: null,
  priceMax: null,
  age: null,
  type: null,
  selectedCategoryId: null,
});

const priceOptions = [
  { label: "<100.000 đ", value: "lt100" },
  { label: "100.000 đ - 300.000 đ", value: "btw100_300" },
  { label: ">300.000 đ", value: "gt300" },
];

const ageOptions = [
  { label: "Trên 12 tuổi", value: "12" },
  { label: "Trên 18 tuổi", value: "18" },
  { label: "Mọi lứa tuổi", value: "all" },
];

const typeOptions = [
  { label: "Bìa mềm", value: "soft" },
  { label: "Bìa cứng", value: "hard" },
  { label: "Bìa da", value: "leather" },
];

const emit = defineEmits(["filterChange"]);
let debounceTimer = null;

const selectCategory = (categoryId, parentCategory, subCategory) => {
  filters.selectedCategoryId = categoryId;
  categoryTree.value = {
    parent: parentCategory,
    sub: subCategory,
  };
  console.log("Selected category:", categoryTree.value);
  emitFilter();
};

watch(
  () => filters.price,
  (newVal, oldVal) => {
    if (newVal) {
      filters.priceMin = null;
      filters.priceMax = null;
    }
  },
  { immediate: true }
);

watch(
  () => [
    filters.promo,
    filters.age,
    filters.type,
    filters.price,
    filters.selectedCategoryId,
  ],
  () => {
    emitFilter();
    console.log("Filters changed:", filters);
  }
);

watch(
  () => [filters.priceMin, filters.priceMax],
  ([min, max]) => {
    if (min || max) {
      filters.price = null;
    }

    clearTimeout(debounceTimer);
    const isValid = min !== null && max !== null && min !== "" && max !== "";
    if (isValid) {
      debounceTimer = setTimeout(() => {
        emitFilter();
        console.log("Filters changed (debounced):", filters);
      }, 1000);
    }
  }
);

// Thêm helper function để tính categoryId
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
      Novel: 11,
      "Business & Management": 12,
      "Science & Technology": 13,
      "History & Politics": 14,
    },
  };

  return categoryMappings[parent]?.[sub];
};
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
