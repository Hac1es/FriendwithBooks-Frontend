<template>
    <div class="min-h-screen bg-[#fdf9e5] flex items-center justify-center px-4">
        <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl flex gap-8">
            <!-- Form bên trái -->
            <div class="flex-1">
                <p class="block text-gray-600 mb-2">Email</p>
                <input type="email" class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none" v-model="email" />
        
                <p class="block text-gray-600 mb-2">Mật khẩu</p>
                <input type="password" class="w-full p-4 rounded-xl bg-gray-200 outline-none" v-model="password" />
        
                <button class="bg-yellow-300 font-semibold py-3 mt-6 w-full rounded-xl hover:bg-yellow-400" @click="register">
                    Đăng ký
                </button>
        
                <div class="text-center mt-4 text-gray-600 text-sm">
                    Đã có tài khoản? <a @click="goToLogin" class="text-black font-medium cursor-pointer hover:underline">Đăng nhập</a>
                </div>
            </div>
    
            <!-- Google Sign-in bên phải -->
            <div class="flex items-center justify-center mt-7">
                <button class="flex items-center gap-2 px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100">
                    <img src="/Google.png" alt="Google" class="w-6 h-6" />
                    <span class="text-gray-600 font-medium">Đăng ký với Google</span>
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    
    const router = useRouter()
    const email = ref('')
    const password = ref('')

    const register = () => {
        // Thực hiện logic đăng ký
        console.log('Đăng ký với', email.value, password.value)
    }
    
    const goToLogin = () => {
        router.push('/Login')
    }
</script>