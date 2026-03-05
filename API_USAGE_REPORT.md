# Báo cáo API Backend vs Frontend

So sánh các API backend với mức độ sử dụng trên frontend (DataLabeling_FE).

---

## 1. API ĐÃ ĐƯỢC FRONTEND SỬ DỤNG

| Backend API | Method | Frontend sử dụng |
|-------------|--------|------------------|
| **Auth** | | |
| `/api/auth/login` | POST | `login.html` |
| **Users** | | |
| `/api/users` | GET | `user-management.html`, `assign-task.html`, `admin.html` |
| `/api/users/{id}` | GET | (gián tiếp qua form edit) |
| `/api/users/{id}` | PUT | `user-management.html` |
| `/api/users/{id}` | DELETE | `user-management.html` |
| `/api/users/me` | GET | `user-dashboard.html`, `my-profile.html`, `manager.html`, `admin.html` |
| `/api/users` | POST | `user-management.html` |
| `/api/users/me/password` | PATCH | `change-password.html` |
| **Projects** | | |
| `/api/projects` | GET | `assign-task.html`, `manager.html`, `admin.html`, `create-project.html` (list) |
| `/api/projects` | POST | `create-project.html` |
| **Tasks** | | |
| `/api/tasks` | GET | `manager.html` (đếm) |
| `/api/tasks/{id}` | GET | `annotator-label.html` |
| `/api/tasks/annotator/{annotatorId}` | GET | `user-dashboard.html`, `my-profile.html`, `annotator-tasks.html` |
| `/api/tasks/reviewer/{reviewerId}` | GET | `my-profile.html` |
| `/api/tasks` | POST | `assign-task.html` |
| **Datasets** | | |
| `/api/datasets/project/{projectId}` | GET | `assign-task.html` |
| **DataItems** | | |
| `/api/data-items` | GET | `export-data.html` |
| `/api/data-items/dataset/{datasetId}/status/{status}` | GET | `assign-task.html` (status=NEW) |
| **Annotations** | | |
| `/api/annotations/task/{taskId}` | GET | `annotator-label.html` |
| `/api/annotations` | POST | `annotator-label.html` |
| **ReviewFeedbacks** | | |
| `/api/review-feedbacks` | GET | `manager-review.html` |
| `/api/review-feedbacks/reviewer/{reviewerId}` | GET | `reviewer-review.html` |

---

## 2. API BACKEND CHƯA ĐƯỢC FRONTEND SỬ DỤNG

### 2.1. Cả resource không được gọi (cfg.roles, cfg.labels, cfg.userRoles không xuất hiện trong fetchWithAuth)

| Resource | Các endpoint chưa dùng | Ghi chú |
|----------|------------------------|--------|
| **Roles** `/api/roles` | GET, GET /{id}, POST, PUT /{id}, DELETE /{id} | Toàn bộ API roles không được gọi. Có thể dùng cho màn quản lý role / phân quyền. |
| **Labels** `/api/labels` | GET, GET /{id}, GET /project/{projectId}, POST, PUT /{id}, DELETE /{id} | Toàn bộ API labels không được gọi. Có thể dùng cho màn cấu hình nhãn theo dự án. |
| **UserRoles** `/api/user-roles` | GET, GET /{id}, GET /user/{userId}, POST, DELETE /{id} | Toàn bộ API user-roles không được gọi. Có thể dùng cho gán user–role–project. |

### 2.2. Một số endpoint trong resource đã dùng

| Resource | Endpoint chưa dùng | Ghi chú |
|----------|--------------------|--------|
| **Auth** | POST `/api/auth/register` | Có trong api-config nhưng không có trang đăng ký gọi. |
| **Users** | GET `/api/users/{id}` | Có thể dùng cho xem chi tiết user (hiện chỉ dùng khi edit). |
| **Projects** | GET `/api/projects/{id}` | Chi tiết 1 dự án. |
| | GET `/api/projects/search?name=` | Tìm dự án theo tên. |
| | PUT `/api/projects/{id}` | Cập nhật dự án. |
| | DELETE `/api/projects/{id}` | Xóa dự án. |
| **Tasks** | GET `/api/tasks/project/{projectId}` | Danh sách task theo dự án. |
| | GET `/api/tasks/search?name=&status=` | Tìm task theo tên dự án / trạng thái. |
| | PATCH `/api/tasks/{id}/status` | Cập nhật trạng thái task. |
| | DELETE `/api/tasks/{id}` | Xóa task. |
| **Datasets** | GET `/api/datasets` | Tất cả dataset (phân trang). |
| | GET `/api/datasets/{id}` | Chi tiết 1 dataset. |
| | POST `/api/datasets` | Tạo dataset (cần cho tạo dataset trong dự án). |
| | PUT `/api/datasets/{id}` | Cập nhật dataset. |
| | DELETE `/api/datasets/{id}` | Xóa dataset. |
| **DataItems** | GET `/api/data-items/{id}` | Chi tiết 1 data item. |
| | GET `/api/data-items/dataset/{datasetId}` | Tất cả item trong dataset (không lọc status). |
| | POST `/api/data-items` | Tạo data item (JSON). |
| | POST `/api/data-items/upload` | Upload file tạo data item. |
| | PATCH `/api/data-items/{id}/status` | Cập nhật trạng thái data item. |
| | DELETE `/api/data-items/{id}` | Xóa data item. |
| **Annotations** | GET `/api/annotations` | Tất cả annotation. |
| | GET `/api/annotations/{id}` | Chi tiết 1 annotation. |
| | PATCH `/api/annotations/{id}/content` | Sửa nội dung (khi REJECTED). |
| | DELETE `/api/annotations/{id}` | Xóa annotation. |
| **ReviewFeedbacks** | GET `/api/review-feedbacks/{id}` | Chi tiết 1 review. |
| | GET `/api/review-feedbacks/task/{taskId}` | Review theo task. |
| | POST `/api/review-feedbacks` | Gửi review (approve/reject). |
| | DELETE `/api/review-feedbacks/{id}` | Xóa review. |

---

## 3. TÓM TẮT

- **Resource chưa dùng hoàn toàn:** Roles, Labels, UserRoles.
- **Endpoint quan trọng chưa dùng:**
  - **Datasets:** POST (tạo dataset), PUT, DELETE — cần nếu Manager tạo/sửa/xóa dataset trong dự án.
  - **ReviewFeedbacks:** POST — cần cho màn Reviewer gửi phê duyệt/từ chối.
  - **Tasks:** GET /project/{projectId}, PATCH status, DELETE — hữu ích cho Manager xem task theo dự án, đổi trạng thái, xóa.
  - **Projects:** GET /{id}, PUT, DELETE, search — cho màn chi tiết/sửa/xóa/tìm dự án.
  - **DataItems:** upload, PATCH status, POST, DELETE — cho quản lý data item và upload file.
  - **Annotations:** PATCH /{id}/content — cho annotator sửa lại sau khi bị reject.
- **Auth:** `/api/auth/register` đã có backend, frontend chưa có trang đăng ký.

File này được tạo tự động từ kiểm tra code backend và frontend.
