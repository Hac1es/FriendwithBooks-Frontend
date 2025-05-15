<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <router-view />
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isAuthenticated", "role"]),
  },
  mounted() {
    if (this.isAuthenticated && this.role === "admin") {
      this.$router.push("/admin/chat");
    }
  },
};
</script>