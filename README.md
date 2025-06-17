# FriendWithBooks - Frontend

Đây là phần Frontend của đồ án FriendwithBooks, một ứng dụng web để bán sách qua mạng Internet, có 2 giao diện: Admin và User

## 🛠️ Công nghệ sử dụng

- Vue 3 + Vite
- Tailwind CSS
- SignalR
- Axios

## 🚀 Cài đặt và chạy

```bash
# 1. Cài các gói cần thiết
npm install

# 2. Khởi động project
npm run dev
```

## ⚙️ Cấu hình API endpoint

Trước khi chạy ứng dụng, hãy sửa URL API để trỏ về đúng backend bạn đang host:

- `src/axios.js`
- `src/components/ChatInterface.vue`
- `src/components/ChatPopup.vue`

Tìm và thay:

```
https://friendwithbooks.id.vn/api
```

thành:

```
https://your-server-domain.com/api
```

⚠️ Đảm bảo backend có hỗ trợ CORS và đã mở cổng cho frontend kết nối SignalR.

## 🎉 Have fun!
