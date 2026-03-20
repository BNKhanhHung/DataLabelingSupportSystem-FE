/**
 * api-helper.js — Bọc fetch + JWT cho toàn frontend.
 * Thứ tự script: api-config.js → api-helper.js → trang.
 *
 * - fetchWithAuth(path, options): nối URL, gắn Bearer, Content-Type/Accept JSON; 401 → xóa session + login.html.
 * - requireAuth(): có token không; không thì redirect (dùng đầu script trang).
 * - getBaseUrl / getToken / getJson / escapeHtml: tiện ích. Login không dùng fetchWithAuth (chưa có token).
 */
(function() {
    function getBaseUrl() {
        // Bỏ slash cuối baseUrl để nối path an toàn
        return (window.API_CONFIG && window.API_CONFIG.baseUrl) ? window.API_CONFIG.baseUrl.replace(/\/$/, '') : 'http://localhost:8080';
    }

    function getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Gọi fetch với header Authorization Bearer (nếu có token).
     * @param {string} path - path API (vd: '/api/users')
     * @param {object} options - fetch options (method, body, headers...)
     * @returns {Promise<Response>}
     */
    function fetchWithAuth(path, options) {
        options = options || {};
        // path tuyệt đối http* giữ nguyên; không thì baseUrl + path
        var url = path.indexOf('http') === 0 ? path : getBaseUrl() + (path.indexOf('/') === 0 ? path : '/' + path);
        var headers = options.headers || {};
        // Không ghi đè nếu đã là Headers (FormData upload thường bỏ Content-Type để browser set boundary)
        if (typeof headers.append !== 'function' && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        if (typeof headers.append !== 'function') {
            headers['Accept'] = 'application/json';
            var token = getToken();
            if (token) headers['Authorization'] = 'Bearer ' + token;
        }
        options.headers = headers;
        return fetch(url, options).then(function(res) {
            // Token hết hạn / sai → dọn localStorage và đưa về login
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('systemRole');
                window.location.href = 'login.html';
                throw new Error('Unauthorized');
            }
            return res;
        });
    }

    /**
     * Kiểm tra đã đăng nhập chưa; chưa thì redirect về login.
     */
    function requireAuth() {
        if (!getToken()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Lấy JSON từ response (và throw nếu không ok).
     */
    function getJson(res) {
        return res.json().then(function(data) {
            if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
            return data;
        });
    }

    /**
     * Escape HTML special characters to prevent XSS attacks
     */
    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, function(c) { return map[c]; });
    }

    window.API = {
        getBaseUrl: getBaseUrl,
        getToken: getToken,
        fetchWithAuth: fetchWithAuth,
        requireAuth: requireAuth,
        getJson: getJson,
        escapeHtml: escapeHtml
    };
})();
