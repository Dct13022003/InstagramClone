# Instagram Clone

Một ứng dụng mạng xã hội **full-stack** được xây dựng dựa trên ý tưởng của Instagram,
nhằm luyện tập phát triển ứng dụng web thực tế với các tính năng phổ biến như
xác thực người dùng, đăng bài, nhắn tin thời gian thực và tối ưu hiệu năng.

---

## 🔗 Demo
- Live demo: *(đang cập nhật)*
- Video demo: *(đang cập nhật)*

---

## ✨ Tính năng
- Đăng ký / đăng nhập người dùng (JWT)
- Đăng bài viết kèm hình ảnh
- Thích và bình luận bài viết
- Upload hình ảnh lên Cloudinary
- Thông báo thời gian thực
- Nhắn tin trực tiếp với infinite scroll
- Quản lý trang cá nhân người dùng
- Giao diện responsive cho mobile và desktop

---

## 🛠️ Công nghệ sử dụng

### Frontend 
- React  
- Tailwind CSS
- TanStack  
- Zustand (quản lý state)

### Backend
- Node.js  
- Express  
- MongoDB  
- Socket.IO  

### Dịch vụ & công cụ khác
- Cloudinary  
- JWT Authentication  
- RESTful API  

---

## 🏗️ Tổng quan kiến trúc
- Frontend giao tiếp với backend thông qua RESTful API
- Các tính năng realtime (thông báo, nhắn tin) được xử lý bằng Socket.IO
- MongoDB lưu trữ dữ liệu người dùng, bài viết, tin nhắn và thông báo
- Infinite scroll giúp tải dữ liệu theo từng phần, tối ưu hiệu năng
- Quản lý state toàn cục bằng Zustand nhằm giảm re-render không cần thiết

---

## 🗃️ Thiết kế cơ sở dữ liệu
Các collection chính:
- User  
- Post  
- Comment  
- Message  
- Notification
- Like
- Follow

---

## ⚙️ Cài đặt & chạy dự án

### Yêu cầu
- Node.js >= 18  
- MongoDB  
### Cấu hình biến môi trường
```
MONGODB_URI=''
JWT_SECRET=''
CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''
```
### Cài đặt
```bash
git clone https://github.com/your-username/instagram-clone.git
cd instagram-clone
npm install
