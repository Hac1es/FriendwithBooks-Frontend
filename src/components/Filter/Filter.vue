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
import { defineEmits } from "vue";
import { useFilter } from "../../composables/useFilter.js";

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
} = useFilter(emit);
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
