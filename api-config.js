/**
 * Cấu hình kết nối Backend - DataLabelingSupportSystem_BE
 * Sửa baseUrl nếu backend chạy ở URL khác.
 *
 * API paths (gọi qua API.fetchWithAuth(cfg.xxx + '...') hoặc fetch):
 * - baseUrl + loginPath → POST login (login.html)
 * - users: GET /me, GET ?, POST, PUT /:id, PATCH /me/password, DELETE /:id (user-management, admin, change-password, my-profile)
 * - projects: GET ?, GET /:id, POST, PUT /:id (manager, project-detail, create-project, assign-task, create-label, create-dataset, create-dataitem)
 * - tasks: GET ?, GET /:id, GET /:id/items, GET /project/:id, GET /annotator/:id, GET /reviewer/:id (chỉ SUBMITTED), POST, PATCH /:id/status, PATCH /:id/due-date, PATCH /:id/submit, PATCH /:id/complete-review, DELETE /:id
 * - labels: GET /project/:id, POST (project-detail, create-label)
 * - datasets: GET /project/:id, POST (project-detail, assign-task, create-dataset, create-dataitem)
 * - dataItems: GET ?, GET /dataset/:id, GET /dataset/:id/status/NEW, POST, POST /bulk, POST /upload (project-detail, assign-task, create-dataitem, export-data)
 * - annotations: GET /task/:id, POST, PATCH /:id/content (annotator-label, reviewer-task-review)
 * - reviewFeedbacks: GET /task/:id, GET /reviewer/:id, POST (reviewer-task-review, reviewer-review, manager-review, annotator-label)
 * - notifications: GET ?, GET /unread-count, PATCH /:id/read, PATCH /read-all, POST /check-overdue (notifications.js, manager, user-dashboard)
 *
 * File này chỉ gán window.API_CONFIG — không gọi mạng. Mọi trang (trừ login) nên load api-config.js trước api-helper.js.
 */
window.API_CONFIG = {
    // Host backend (ví dụ http://localhost:8080). Không có dấu / cuối (helper sẽ nối path).
    baseUrl: 'http://localhost:8080',
    // Đường dẫn đăng nhập tương đối baseUrl — login.html dùng trực tiếp.
    loginPath: '/api/auth/login',
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register'
    },
    users: '/api/users',           // CRUD user, /me, /me/password
    roles: '/api/roles',           // Danh sách vai trò hệ thống
    projects: '/api/projects',     // Dự án
    tasks: '/api/tasks',           // Task + assign, submit, review...
    userRoles: '/api/user-roles',  // Gán vai trò user (nếu dùng)
    labels: '/api/labels',         // Nhãn theo project
    datasets: '/api/datasets',     // Dataset theo project
    dataItems: '/api/data-items',  // Data item, bulk, upload
    annotations: '/api/annotations',
    reviewFeedbacks: '/api/review-feedbacks',
    notifications: '/api/notifications'
};
