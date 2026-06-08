/* ===== Yestion - Shared State & Utilities ===== */

// LocalStorage keys
const KEY = {
  USER: 'yestion_user',
  TODOS: 'yestion_todos',
  CATEGORIES: 'yestion_categories',
};

// ---- State helpers ----
function getUser()       { return JSON.parse(localStorage.getItem(KEY.USER) || 'null'); }
function saveUser(u)     { localStorage.setItem(KEY.USER, JSON.stringify(u)); }
function getTodos()      { return JSON.parse(localStorage.getItem(KEY.TODOS) || '[]'); }
function saveTodos(arr)  { localStorage.setItem(KEY.TODOS, JSON.stringify(arr)); }
function getCategories() {
  const defaults = [
    { id: 'cat-1', name: '운동', color: '#FF6B6B' },
    { id: 'cat-2', name: '공부', color: '#4ECDC4' },
    { id: 'cat-3', name: '일상', color: '#FFD93D' },
  ];
  return JSON.parse(localStorage.getItem(KEY.CATEGORIES) || JSON.stringify(defaults));
}
function saveCategories(arr) { localStorage.setItem(KEY.CATEGORIES, JSON.stringify(arr)); }

// ---- ID generator ----
function genId() { return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

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

// ---- Auth guard ----
function requireAuth() {
  if (!getUser()) { window.location.href = '/pages/auth.html'; return false; }
  return true;
}

// ---- Category lookup ----
function getCatById(id) {
  return getCategories().find(c => c.id === id) || { name: '기타', color: '#9CA3AF' };
}
