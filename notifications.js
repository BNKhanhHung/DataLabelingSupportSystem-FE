/**
 * Notification bell + dropdown. Cần có API_CONFIG, api-helper.js và element #notificationBellContainer.
 * APIs: GET /api/notifications/unread-count; GET /api/notifications?page&size; PATCH /api/notifications/:id/read; PATCH /api/notifications/read-all.
 */
(function() {
  var style = document.createElement('style');
  style.textContent = '.notification-bell-wrap{display:inline-flex;align-items:center}.notif-bell-wrap{position:relative}.notif-bell-btn{background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.5);color:#e5e7eb;width:40px;height:40px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px}.notif-bell-btn:hover{background:rgba(51,65,85,0.9)}.notif-bell-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;background:#ef4444;color:#fff;font-size:11px;font-weight:600;border-radius:999px;display:flex;align-items:center;justify-content:center}.notif-dropdown{display:none;position:absolute;top:100%;right:0;margin-top:8px;width:320px;max-height:400px;background:rgba(15,23,42,0.98);border:1px solid #334155;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.4);z-index:1000;overflow:hidden}.notif-dropdown-open{display:flex;flex-direction:column}.notif-dropdown-header{padding:12px 14px;border-bottom:1px solid #334155;font-weight:600;color:#e5e7eb}.notif-dropdown-list{max-height:280px;overflow-y:auto}.notif-empty,.notif-loading{padding:20px;text-align:center;color:#94a3b8;font-size:13px}.notif-item{padding:12px 14px;border-bottom:1px solid #334155;cursor:pointer;transition:background 0.15s}.notif-item:hover{background:rgba(51,65,85,0.6)}.notif-item.notif-unread{background:rgba(34,197,94,0.08)}.notif-item-title{font-size:13px;font-weight:500;color:#e5e7eb;margin-bottom:4px}.notif-item-msg{font-size:12px;color:#94a3b8;margin-bottom:4px}.notif-item-time{font-size:11px;color:#64748b}.notif-dropdown-footer{padding:10px 14px;border-top:1px solid #334155}.notif-mark-all{background:transparent;border:none;color:#38bdf8;font-size:12px;cursor:pointer;padding:4px 0}.notif-mark-all:hover{text-decoration:underline}';
  document.head.appendChild(style);

  function getConfig() {
    var cfg = window.API_CONFIG;
    var api = window.API;
    if (!cfg || !cfg.notifications || !api || !api.requireAuth || !api.fetchWithAuth) return null;
    return { cfg: cfg, api: api };
  }

  function renderBell(unreadCount, list) {
    var count = Math.min(99, parseInt(unreadCount, 10) || 0);
    var items = list && list.length ? list : [];
    var listHtml = items.length === 0
      ? '<div class="notif-empty">Chưa có thông báo</div>'
      : items.map(function(n) {
          var time = n.createdAt ? n.createdAt.substring(0, 16).replace('T', ' ') : '';
          var readClass = n.read ? '' : ' notif-unread';
          var eid = (n.relatedEntityId || '').toString();
          var etype = (n.relatedEntityType || '').toString();
          return '<div class="notif-item' + readClass + '" data-id="' + n.id + '" data-entity-type="' + etype + '" data-entity-id="' + eid + '">' +
            '<div class="notif-item-title">' + (n.title || '').replace(/</g, '&lt;') + '</div>' +
            '<div class="notif-item-msg">' + (n.message || '').substring(0, 60).replace(/</g, '&lt;') + (n.message && n.message.length > 60 ? '...' : '') + '</div>' +
            '<div class="notif-item-time">' + time + '</div></div>';
        }).join('');
    return '<div class="notif-bell-wrap">' +
      '<button type="button" class="notif-bell-btn" id="notifBellBtn" aria-label="Thông báo">' +
      '<span class="notif-bell-icon">🔔</span>' +
      (count > 0 ? '<span class="notif-bell-badge">' + count + '</span>' : '') +
      '</button>' +
      '<div class="notif-dropdown" id="notifDropdown">' +
      '<div class="notif-dropdown-header">Thông báo</div>' +
      '<div class="notif-dropdown-list">' + listHtml + '</div>' +
      '<div class="notif-dropdown-footer"><button type="button" class="notif-mark-all" id="notifMarkAllBtn">Đánh dấu tất cả đã đọc</button></div>' +
      '</div></div>';
  }

  function fetchUnreadAndList(config, callback) {
    config.api.fetchWithAuth(config.cfg.notifications + '/unread-count').then(function(r) { return r.ok ? r.json() : { count: 0 }; }).catch(function() { return { count: 0 }; }).then(function(data) {
      var count = data.count || 0;
      config.api.fetchWithAuth(config.cfg.notifications + '?page=0&size=15').then(function(r) { return r.ok ? r.json() : { content: [] }; }).catch(function() { return { content: [] }; }).then(function(page) {
        callback(count, page.content || []);
      });
    });
  }

  function markRead(config, id, thenRefresh) {
    config.api.fetchWithAuth(config.cfg.notifications + '/' + id + '/read', { method: 'PATCH' }).then(function() {
      if (thenRefresh) fetchUnreadAndList(config, function(c, list) {
        var wrap = document.querySelector('.notif-bell-wrap');
        if (wrap) wrap.outerHTML = renderBell(c, list);
        bindNotifEvents(config);
      });
    }).catch(function() {});
  }

  function bindNotifEvents(config) {
    var btn = document.getElementById('notifBellBtn');
    var dropdown = document.getElementById('notifDropdown');
    if (btn && dropdown) {
      btn.onclick = function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('notif-dropdown-open');
      };
    }
    document.querySelectorAll('.notif-item').forEach(function(el) {
      var id = el.getAttribute('data-id');
      var etype = el.getAttribute('data-entity-type');
      var eid = el.getAttribute('data-entity-id');
      el.onclick = function(e) {
        e.stopPropagation();
        if (id && el.classList.contains('notif-unread')) markRead(config, id, true);
        if (etype === 'TASK' && eid) {
          sessionStorage.setItem('focusTaskId', eid);
          document.getElementById('notifDropdown').classList.remove('notif-dropdown-open');
          window.location.href = 'annotator-tasks.html';
        }
      };
    });
    var markAllBtn = document.getElementById('notifMarkAllBtn');
    if (markAllBtn) {
      markAllBtn.onclick = function() {
        config.api.fetchWithAuth(config.cfg.notifications + '/read-all', { method: 'PATCH' }).then(function() {
          fetchUnreadAndList(config, function(c, list) {
            var wrap = document.querySelector('.notif-bell-wrap');
            if (wrap) wrap.outerHTML = renderBell(c, list);
            bindNotifEvents(config);
          });
        }).catch(function() {});
      };
    }
    document.addEventListener('click', function(e) {
      if (dropdown && !dropdown.contains(e.target) && !btn.contains(e.target))
        dropdown.classList.remove('notif-dropdown-open');
    });
  }

  function init(container) {
    if (!container) return;
    var config = getConfig();
    if (!config) return;
    if (!config.api.requireAuth()) return;
    container.innerHTML = '<div class="notif-loading">...</div>';
    fetchUnreadAndList(config, function(count, list) {
      container.innerHTML = renderBell(count, list);
      bindNotifEvents(config);
    });
    setInterval(function() {
      if (!document.querySelector('.notif-bell-wrap')) return;
      fetchUnreadAndList(config, function(c, list) {
        var wrap = document.querySelector('.notif-bell-wrap');
        if (wrap) wrap.outerHTML = renderBell(c, list);
        bindNotifEvents(config);
      });
    }, 45000);
  }

  window.NotificationBell = { init: init };
})();
