<template>
  <div>
    <Header />
    <Breadcrumb :crumbs="crumbs" />
    <div class="relative pb-16">
      <div
        class="md:mt-10 mt-3 w-full md:w-[calc(100%-224px)] mx-auto flex md:gap-16 max-md:flex-col"
      >
        <Filter />
        <div
          class="grid md:grid-cols-3 grid-cols-2 md:gap-x-24 gap-x-5 gap-y-10 grow shrink max-md:w-full max-md:mx-auto px-5 mb-10"
        >
          <ProdCard
            v-for="data in fakeData"
            :key="data.id"
            :productId="data.id"
            :imgSrc="data.image"
            :title="data.name"
            :price="data.price"
            :oldPrice="data.oldPrice"
            :discount="data.discount"
            :scale="respScaling"
            @click="() => goToDetail(data.id)"
          />
        </div>
      </div>
      <div class="flex justify-center mb-6 max-md:w-[80%] max-md:mx-auto">
        <n-config-provider :theme-overrides="themeOverride">
          <n-pagination
            :default-page="1"
            page-count="10"
            :page-slot="respPageSlot"
          />
        </n-config-provider>
      </div>
      <BackButton class="absolute bottom-8 right-10" />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Header from "../components/Header/index.vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import Filter from "../components/Filter/index.vue";
import ProdCard from "../components/ProdCard.vue";
import Footer from "../components/Footer.vue";
import { NConfigProvider } from "naive-ui";
import BackButton from "../components/BackButton.vue";
import { useRouter } from "vue-router";

const fakeData = [
  {
    id: 1,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1015/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 2,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1025/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 3,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1035/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 4,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1045/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 5,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1055/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 6,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1065/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 7,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1075/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 8,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1076/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
  {
    id: 9,
    name: "Tiệm Sách Của Nàng",
    image: "https://picsum.photos/id/1077/300/400",
    oldPrice: 125000,
    price: 100000,
    discount: "20",
  },
];

const crumbs = [
  { name: "Trang chủ", link: "/" },
  { name: "Sản phẩm", link: "/Products" },
  { name: "Tiểu thuyết" },
];

let windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

let respScaling = computed(() => (windowWidth.value < 768 ? 0.9 : 1));
let respPageSlot = computed(() => (windowWidth.value < 768 ? 5 : 10));

const themeOverride = {
  Pagination: {
    itemTextColorHover: "#400b0b",
    itemTextColorPressed: "#400b0b",
    itemTextColorActive: "#400b0b",
    buttonBorder: "1px solid #400b0b",
    buttonBorderHover: "1px solid #400b0b",
    buttonBorderPressed: "1px solid #400b0b",
    itemBorderActive: "1px solid #400b0b",
  },
};

const router = useRouter();
function goToDetail(id) {
  router.push(`/Products/${id}`);
}
</script>
