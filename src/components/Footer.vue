<template>
    <footer class="bg-white py-8 px-4 border-t">
        <div class="max-w-screen mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 justify-items-center text-center">
            <!-- Logo -->
            <div class="flex items-center hidden md:block">
                <img src="/Logo-Footer.png" alt="Logo" class="w-[200px] mb-2" />
            </div>
    
            <!-- Liên hệ -->
            <div>
                <h3 class="text-lg font-semibold text-[#661010] mb-2">LIÊN HỆ</h3>
                <div class="grid md:text-left">
                    <p>Địa chỉ: Linh Trung, Thủ Đức</p>
                    <p>Hotline: 0123456789</p>
                    <p>Email: abc1234@gm.uit.edu.vn</p>
                </div>
            </div>
    
            <!-- Liên kết -->
            <div class="hidden md:block">
                <h3 class="text-lg font-semibold text-[#661010] mb-2">LIÊN KẾT</h3>
                <div class="grid md:grid-cols-2 md:text-left gap-x-10">
                    <div>
                        <ol class="list-disc">
                            <li><a href="#" class="hover:underline">Trang chủ</a></li>
                            <li><a href="#" class="hover:underline">Sản phẩm</a></li>
                        </ol>
                    </div>
                    <div>
                        <ol class="list-disc">
                            <li><a href="#" class="hover:underline">Chính sách</a></li>
                            <li><a href="#" class="hover:underline">Hỗ trợ</a></li>
                        </ol>
                    </div>
                </div>
            </div>
    
            <!-- Find Us -->
            <div>
                <h3 class="text-lg font-semibold text-[#661010] mb-3">FIND US</h3>
                <div class="flex gap-10">
                    <a href="#"><img src="/Facebook.png" alt="Facebook" class="w-8 h-8" /></a>
                    <a href="#"><img src="/Youtube.png" alt="YouTube" class="w-8 h-8" /></a>
                    <a href="#"><img src="/Instagram.png" alt="Instagram" class="w-8 h-8" /></a>
                </div>
            </div>
        </div>
    
        <!-- Payment/Shipping Logos -->
        <div class="max-w-screen mx-auto mt-10 flex-wrap justify-around gap-10 hidden md:flex">
            <img src="/Ghn.png" alt="GHN" class="h-10" />
            <img src="/Vnpay.png" alt="VNPay" class="h-10" />
            <img src="/Ahamove.png" alt="AhaMove" class="h-10" />
            <img src="/Momo.png" alt="Momo" class="h-10" />
            <img src="/Vnpost.png" alt="VNPost" class="h-10" />
        </div>
    </footer>
</template>     