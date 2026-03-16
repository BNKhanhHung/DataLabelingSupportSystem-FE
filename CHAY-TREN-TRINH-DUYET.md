# Mở project trên trình duyệt (Web)

## Tại sao mở trong Cursor được nhưng không mở trên web được?

- **Trong Cursor:** Bạn chỉ mở **file code** (đọc/sửa), không cần server.
- **Trên web (trình duyệt):** Cần **chạy 2 server** (Backend + Frontend) và mở **đúng địa chỉ** (http://localhost:3000), **không** mở bằng double-click file .html (file://).

Nếu bạn double-click `login.html` → trình duyệt mở `file:///...` → gọi API sang Backend dễ bị **CORS** hoặc bị chặn → đăng nhập / dữ liệu không chạy.

---

## Cách mở đúng trên trình duyệt

### Bước 1: Chạy Backend (nếu chưa chạy)

Mở **PowerShell hoặc Terminal**, chạy:

```bash
cd C:\Users\khong\OneDrive\Desktop\DataLabelingSupportSystem-BE
mvn spring-boot:run
```

Đợi đến khi thấy dòng kiểu: `Started ... in ... seconds`. Giữ terminal này mở.

### Bước 2: Chạy Frontend bằng web server

Mở **một terminal mới**, chạy:

```bash
cd C:\Users\khong\OneDrive\Desktop\DataLabelingSupportSystem-FE
npx serve -l 3000
```

Khi thấy `Accepting connections at http://localhost:3000` là đã chạy. Giữ terminal này mở.

### Bước 3: Mở bằng Google Chrome (hoặc trình duyệt bất kỳ)

- **Không** double-click file `login.html`.
- Mở Chrome, gõ vào thanh địa chỉ:

  **http://localhost:3000**

  hoặc

  **http://localhost:3000/login.html**

- Enter. Trang đăng nhập sẽ load và gọi API Backend bình thường.

---

## Tóm tắt

| Cách mở | Kết quả |
|--------|--------|
| Double-click `login.html` (file://) | Trang hiện nhưng đăng nhập/API dễ lỗi (CORS) |
| Mở **http://localhost:3000** sau khi chạy `npx serve` | Đúng cách, dùng được đầy đủ |

**Nhớ:** Luôn chạy Backend (port 8080) + Frontend qua `npx serve` (port 3000), rồi mở **http://localhost:3000** trên trình duyệt.
