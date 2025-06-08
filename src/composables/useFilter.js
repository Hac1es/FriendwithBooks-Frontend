import { ref, reactive, watch, onMounted } from "vue";
import axios from "../utils/axios";

export function useFilter(emit) {
  const categories = ref({});
  const categoryTree = ref({ parent: null, sub: null });

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

  let debounceTimer = null;

  const emitFilter = () => {
    emit("filterChange", {
      filters: { ...filters },
      categoryTree: { ...categoryTree.value },
    });
  };

  const selectCategory = (categoryId, parentCategory, subCategory) => {
    if (
      filters.selectedCategoryId === categoryId &&
      categoryTree.value.parent === parentCategory &&
      categoryTree.value.sub === subCategory
    ) {
      filters.selectedCategoryId = null;
      categoryTree.value = { parent: null, sub: null };
    } else {
      filters.selectedCategoryId = categoryId;
      categoryTree.value = {
        parent: parentCategory,
        sub: subCategory,
      };
    }
    emitFilter();
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
        Novel: 11,
        "Business & Management": 12,
        "Science & Technology": 13,
        "History & Politics": 14,
      },
    };
    return categoryMappings[parent]?.[sub];
  };

  onMounted(async () => {
    try {
      const response = await axios.get("/Book/category");
      categories.value = response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  });

  watch(
    () => filters.price,
    (newVal) => {
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
        }, 1000);
      }
    }
  );

  return {
    categories,
    categoryTree,
    filters,
    priceOptions,
    ageOptions,
    typeOptions,
    selectCategory,
    getCategoryId,
  };
}
