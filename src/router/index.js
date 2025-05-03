import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import ForgotPass from '../pages/ForgotPass.vue'

const routes = [
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Register', name: 'Register', component: Register },
    { path: '/ForgotPassword', name: 'ForgotPass', component: ForgotPass },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router