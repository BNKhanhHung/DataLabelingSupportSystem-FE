# Data Labeling Support System – Frontend

🎯 Frontend của hệ thống **Data Labeling Support System** – hỗ trợ gán nhãn dữ liệu (data labeling) cho các bài toán AI/ML.

Frontend giao tiếp với Backend (Java / Spring Boot) thông qua REST API.

---

## Chạy trên localhost (giống Backend)

Cả hai chạy trên **localhost**:

| Thành phần | URL |
|------------|-----|
| **Backend** | http://localhost:8080 |
| **Frontend** | http://localhost:3000 |

- **Backend:** trong thư mục `DataLabelingSupportSystem-BE` chạy `mvn spring-boot:run`.
- **Frontend:** trong thư mục `DataLabeling_FE` chạy `npx --yes serve -l 3000`.

File `api-config.js` đã cấu hình `baseUrl: 'http://localhost:8080'` để gọi Backend.

---

## 🚀 Công nghệ sử dụng

- HTML / JavaScript
- CSS
- 🔗 REST API (Backend tại localhost:8080)

---
