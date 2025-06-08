<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../utils/supabase";
import { onMounted } from "vue";
import axios from "../utils/axios";

const router = useRouter();
const store = useStore();

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    const email = data.session.user.email;
    const name = data.session.user.user_metadata.full_name;

    try {
      const response = await axios.post("/Auth/googleLogin", {
        Email: email,
        FullName: name,
      });
      if (response.status === 200) {
        alert("Đăng nhập Google thành công!");
        const decoded = jwtDecode(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(decoded));
        store.dispatch("login", decoded.role);
        store.dispatch("setUserInfo", decoded);
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Đăng nhập Google thành công!"
      );
      console.log(error);
    }
  }
});
</script>