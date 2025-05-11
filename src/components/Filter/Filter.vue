<template>
  <aside
    class="md:bg-[#ffffff] bg-[#f8f5e9] p-4 rounded-lg shadow-sm w-64 font-instrument max-h-[480px]"
  >
    <h2 class="font-bold text-[#661c1c] mb-2 font-itim text-lg">BỘ LỌC</h2>

    <!-- Khuyến mãi -->
    <div class="mb-4">
      <label class="flex items-center space-x-2">
        <input
          type="checkbox"
          v-model="filters.promo"
          class="appearance-none w-4 h-4 border-2 border-[#400B0B] rounded-sm bg-[#661C1C]/50 checked:bg-[#661C1C] checked:border-[#400B0B] transition custom-checkbox"
        />
        <span>Khuyến mãi</span>
      </label>
    </div>

    <hr class="my-2 border-[#ccc]" />

    <!-- Giá -->
    <div class="mb-4">
      <h3 class="font-semibold mb-1 text-[#661c1c] font-itim text-base">Giá</h3>

      <!-- Checkbox option -->
      <div v-for="price in priceOptions" :key="price.value" class="mb-1">
        <label class="flex items-center space-x-2">
          <input
            type="checkbox"
            :checked="filters.price === price.value"
            @change="
              filters.price =
                price.value === filters.price ? null : price.value;
              filters.priceMin = '';
              filters.priceMax = '';
            "
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
          <input
            type="checkbox"
            v-model="filters.age"
            :checked="filters.age === age.value"
            @change="filters.age = age.value === filters.age ? null : age.value"
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
          <input
            type="checkbox"
            v-model="filters.type"
            :checked="filters.type === type.value"
            @change="
              filters.type = type.value === filters.type ? null : type.value
            "
            class="appearance-none w-4 h-4 border-2 border-[#400B0B] rounded-sm bg-[#661C1C]/50 checked:bg-[#661C1C] checked:border-[#400B0B] transition custom-checkbox"
          />
          <span>{{ type.label }}</span>
        </label>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive, watch } from "vue";

const filters = reactive({
  promo: false,
  price: null,
  priceMin: null,
  priceMax: null,
  age: null,
  type: null,
});

const priceOptions = [
  { label: "<100.000 đ", value: "lt100" },
  { label: "100.000 đ - 300.000 đ", value: "btw100_300" },
  { label: ">300.000 đ", value: "gt300" },
];

const ageOptions = [
  { label: "Trên 18 tuổi", value: "18plus" },
  { label: "Mọi lứa tuổi", value: "all" },
];

const typeOptions = [
  { label: "Bìa mềm", value: "soft" },
  { label: "Bìa cứng", value: "hard" },
  { label: "Khác", value: "other" },
];

const emit = defineEmits(["change"]);
watch(
  filters,
  () => {
    let finalPriceFilter = null;

    if (filters.priceMin != null || filters.priceMax != null) {
      finalPriceFilter = {
        min: filters.priceMin || 0,
        max: filters.priceMax || Infinity,
      };
    } else if (filters.price) {
      finalPriceFilter = filters.price; // giữ nguyên chuỗi 'lt50', 'btw50_200', v.v.
    }

    emit("change", {
      promo: filters.promo,
      price: finalPriceFilter,
      age: filters.age,
      type: filters.type,
    });
  },
  { deep: true }
);

watch(
  () => [filters.priceMin, filters.priceMax],
  ([min, max]) => {
    if (min || max) {
      filters.price = null;
    }
  }
);
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
