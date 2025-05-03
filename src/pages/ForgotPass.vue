<template>
    <div class="min-h-screen bg-[#fdf9e5] flex items-center justify-center px-4">
        <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex gap-8">
            <div class="flex-1">
                <p class="block text-gray-600 mb-2">Email</p>
                <input type="email" class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"/>
        
                <p class="block text-gray-600 mb-2">Mã OTP</p>
                <input type="text" class="w-full p-4 rounded-xl bg-gray-200 outline-none"/>
        
                <div class="text-sm font-medium mt-2">
                    <a class="cursor-pointer hover:underline">Gửi mã OTP</a>
                </div>
        
                <button class="bg-yellow-300 font-semibold py-3 mt-6 w-full rounded-xl hover:bg-yellow-400">
                    Xác nhận
                </button>
        
                <div class="text-center mt-4 text-gray-600 text-sm">
                    Có vấn đề? <a class="text-black font-medium cursor-pointer hover:underline">Hỗ trợ</a>
                </div>
            </div>
        </div>
    </div>
</template>