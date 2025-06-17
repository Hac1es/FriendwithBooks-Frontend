import { ref, reactive, watch, onMounted } from "vue";
import axios from "../utils/axios";

export function useFilter(emit) {
  const categories = ref({});
  const categoryTree = ref({ parent: null, sub: null });
  const categoryMappings = ref({});
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
    return categoryMappings.value[parent]?.[sub];
  };

  const buildCategoryMapping = (apiData) => {
    const result = {};

    for (const parentCategory in apiData) {
      const subcategories = apiData[parentCategory];

      if (!Array.isArray(subcategories) || subcategories.length === 0) {
        continue;
      }

      result[parentCategory] = {};

      for (const item of subcategories) {
        if (item.name && item.categoryID !== undefined) {
          result[parentCategory][item.name] = item.categoryID;
        }
      }
    }

    return result;
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/Book/category");
      categories.value = response.data;
      categoryMappings.value = buildCategoryMapping(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  onMounted(fetchCategories);

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
    fetchCategories,
  };
}
