/**
 * Helper gọi API backend với JWT. Cần load sau api-config.js.
 */
(function() {
    function getBaseUrl() {
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
        var url = path.indexOf('http') === 0 ? path : getBaseUrl() + (path.indexOf('/') === 0 ? path : '/' + path);
        var headers = options.headers || {};
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
