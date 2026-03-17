/**
 * Cấu hình kết nối Backend - DataLabelingSupportSystem_BE
 * Sửa baseUrl nếu backend chạy ở URL khác.
 *
 * API paths (gọi qua API.fetchWithAuth(cfg.xxx + '...') hoặc fetch):
 * - baseUrl + loginPath → POST login (login.html)
 * - users: GET /me, GET ?, POST, PUT /:id, PATCH /me/password, DELETE /:id (user-management, admin, change-password, my-profile)
 * - projects: GET ?, GET /:id, POST, PUT /:id (manager, project-detail, create-project, assign-task, create-label, create-dataset, create-dataitem)
 * - tasks: GET ?, GET /:id, GET /:id/items, GET /project/:id, GET /annotator/:id, GET /reviewer/:id, POST, PATCH /:id/status, PATCH /:id/due-date, PATCH /:id/submit, PATCH /:id/complete-review, DELETE /:id (manager, assign-task, user-dashboard, annotator-tasks, reviewer-tasks, reviewer-task-review, annotator-label, my-profile)
 * - labels: GET /project/:id, POST (project-detail, create-label)
 * - datasets: GET /project/:id, POST (project-detail, assign-task, create-dataset, create-dataitem)
 * - dataItems: GET ?, GET /dataset/:id, GET /dataset/:id/status/NEW, POST, POST /bulk, POST /upload (project-detail, assign-task, create-dataitem, export-data)
 * - annotations: GET /task/:id, POST, PATCH /:id/content (annotator-label, reviewer-task-review)
 * - reviewFeedbacks: GET /task/:id, GET /reviewer/:id, POST (reviewer-task-review, reviewer-review, manager-review, annotator-label)
 * - notifications: GET ?, GET /unread-count, PATCH /:id/read, PATCH /read-all, POST /check-overdue (notifications.js, manager, user-dashboard)
 */
window.API_CONFIG = {
    baseUrl: 'http://localhost:8080',
    loginPath: '/api/auth/login',
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register'
    },
    users: '/api/users',
    roles: '/api/roles',
    projects: '/api/projects',
    tasks: '/api/tasks',
    userRoles: '/api/user-roles',
    labels: '/api/labels',
    datasets: '/api/datasets',
    dataItems: '/api/data-items',
    annotations: '/api/annotations',
    reviewFeedbacks: '/api/review-feedbacks',
    notifications: '/api/notifications'
};
