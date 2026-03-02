/**
 * Cấu hình kết nối Backend - DataLabelingSupportSystem_BE
 * Sửa baseUrl nếu backend chạy ở URL khác.
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
    reviewFeedbacks: '/api/review-feedbacks'
};
