/* ===== Yestion - Shared Utilities & API ===== */

// ---- Auth storage ----
function getToken() { return localStorage.getItem('yestion_token'); }
function saveToken(t) { localStorage.setItem('yestion_token', t); }
function getUser() { return JSON.parse(localStorage.getItem('yestion_user') || 'null'); }
function saveUser(u) { localStorage.setItem('yestion_user', JSON.stringify(u)); }
function clearAuth() {
  localStorage.removeItem('yestion_token');
  localStorage.removeItem('yestion_user');
}

// ---- Auth guard ----
function requireAuth() {
  if (!getToken() || !getUser()) {
    window.location.href = '/pages/auth.html';
    return false;
  }
  return true;
}

// ---- Authenticated fetch ----
async function authFetch(url, options = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/pages/auth.html';
    throw new Error('Unauthorized');
  }
  return res;
}

// ---- Date helpers ----
function todayStr() { return new Date().toISOString().slice(0, 10); }
function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

// ---- Toast ----
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---- HTML escape ----
function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
