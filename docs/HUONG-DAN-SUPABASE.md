# Hướng dẫn liên kết Supabase để test Backend & Frontend

Backend của bạn dùng Supabase cho **2 mục đích**:
1. **Database** – PostgreSQL (đã cấu hình trong `application.yml`)
2. **Storage** – lưu file (upload qua API, cần cấu hình URL + Service Key)

Frontend **không kết nối trực tiếp** với Supabase; mọi thao tác đều qua Backend API. Luồng: **Frontend → Backend → Supabase**.

---

## Bước 1: Lấy thông tin từ Supabase Dashboard

### 1.1 Đăng nhập Supabase
- Vào [https://supabase.com](https://supabase.com) → Sign in / Đăng ký.
- Mở **Project** (hoặc tạo mới).

### 1.2 Lấy Project URL và API Keys
- Trong project, vào **Settings** (biểu tượng bánh răng) → **API**.
- Ghi lại:
  - **Project URL**: dạng `https://xxxxxxxxxxxxx.supabase.co`
  - **Project API keys**:
    - **anon (public)** – dùng cho client (nếu sau này frontend gọi Supabase trực tiếp).
    - **service_role** – dùng cho **Backend** (bảo mật, không đưa lên frontend).  
  → Backend cần dùng **service_role** làm `SUPABASE_SERVICE_KEY`.

### 1.3 Tạo Storage Bucket (cho upload file)
- Sidebar: **Storage** → **New bucket**.
- **Name**: `data-items` (hoặc tên khác, phải trùng với cấu hình backend).
- **Public bucket**: Bật nếu bạn muốn file upload có URL public (backend đang trả URL public).
- **Create bucket**.

---

## Bước 2: Cấu hình Backend

Có **2 cách**: dùng biến môi trường (khuyến nghị) hoặc sửa file (không nên commit key).

### Cách A: Biến môi trường (khuyến nghị)

**Windows (PowerShell – phiên hiện tại):**
```powershell
$env:SUPABASE_URL = "https://xxxxxxxxxxxxx.supabase.co"
$env:SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
$env:SUPABASE_STORAGE_BUCKET = "data-items"
```

**Windows (CMD):**
```cmd
set SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
set SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
set SUPABASE_STORAGE_BUCKET=data-items
```

Sau đó chạy backend:
```powershell
cd D:\DataLabelingSupportSystem-BE
mvn spring-boot:run
```

**Windows – set vĩnh viễn (User):**
- **Settings** → **System** → **About** → **Advanced system settings** → **Environment Variables**.
- Thêm **User variables**: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_STORAGE_BUCKET`.

### Cách B: File cấu hình local (không commit key)

1. Trong `DataLabelingSupportSystem-BE/src/main/resources/` tạo file **`application-local.yml`** (hoặc dùng `application.yml` chỉ khi chạy local, và đảm bảo file này nằm trong `.gitignore`).

2. Nội dung mẫu:
```yaml
supabase:
  url: https://xxxxxxxxxxxxx.supabase.co
  service-key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  storage:
    bucket: data-items
```

3. Chạy với profile `local`:
```powershell
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
Và trong `application.yml` (hoặc `application-local.yml`) đảm bảo có:
```yaml
spring:
  profiles:
    active: local   # chỉ khi chạy local
```

**Lưu ý:** Đừng commit file chứa **service_role** key lên Git. Nên dùng biến môi trường hoặc secret manager.

---

## Bước 3: Kiểm tra kết nối

### 3.1 Backend ↔ Supabase
- Khởi chạy backend với `SUPABASE_URL` và `SUPABASE_SERVICE_KEY` đúng.
- Nếu có API upload file (ví dụ DataItem upload), gửi request upload → backend gọi Supabase Storage. Upload thành công = Backend ↔ Supabase OK.

### 3.2 Frontend ↔ Backend
- Mở frontend: `http://localhost:3000` (hoặc port bạn dùng).
- Đăng nhập qua form login → frontend gọi `POST /api/auth/login` tới backend.
- Đăng nhập thành công = Frontend ↔ Backend OK.

### 3.3 Test toàn luồng (Frontend → Backend → Supabase)
- Đăng nhập từ frontend.
- Thực hiện chức năng có upload file (nếu có) → file lên Supabase Storage qua backend.
- Kiểm tra trong Supabase: **Storage** → bucket `data-items` → thấy file mới = luồng hoạt động đúng.

---

## Tóm tắt biến cần thiết

| Biến | Mô tả | Lấy ở đâu |
|------|--------|-----------|
| `SUPABASE_URL` | URL project | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | Service role key | Supabase → Settings → API → service_role |
| `SUPABASE_STORAGE_BUCKET` | Tên bucket | Tự đặt khi tạo bucket (mặc định: `data-items`) |

---

## Lỗi thường gặp

- **Backend không start / “Could not resolve placeholder 'SUPABASE_URL'”**  
  → Chưa set biến môi trường hoặc chưa có giá trị trong file cấu hình đang dùng.

- **Upload failed / 401, 403**  
  → Sai `SUPABASE_SERVICE_KEY` (phải dùng **service_role**, không dùng anon). Hoặc bucket chưa tạo / tên bucket sai.

- **CORS khi frontend gọi backend**  
  → Backend đã cấu hình CORS cho origin frontend (localhost:3000, …). Nếu vẫn lỗi, kiểm tra đúng URL backend và CORS trong `SecurityConfig`.

Sau khi set đủ 3 biến và tạo bucket, bạn chỉ cần chạy lại backend và test đăng nhập + (nếu có) upload file để xác nhận kết nối end-to-end.
