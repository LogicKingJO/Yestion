if (!requireAuth()) throw 0;

const today = todayStr();
let activeFilter = 'all';
let allTodos = [];
let allCategories = [];

document.getElementById('today-label').textContent = formatDate(today);
document.getElementById('user-name').textContent = getUser().name + '님!';

async function init() {
  await Promise.all([loadCategories(), loadTodos()]);
}

async function loadCategories() {
  try {
    const res = await authFetch('/api/categories');
    allCategories = await res.json();
    renderFilters();
  } catch {
    showToast('카테고리 로드 실패');
  }
}

async function loadTodos() {
  try {
    const res = await authFetch(`/api/todos?date=${today}`);
    allTodos = await res.json();
    renderTodos();
  } catch {
    showToast('할 일 로드 실패');
  }
}

function getCatById(id) {
  return allCategories.find(c => c.id === id) || { name: '기타', color: '#9CA3AF' };
}

function renderFilters() {
  const row = document.getElementById('filter-row');
  row.querySelectorAll('[data-cat]:not([data-cat="all"])').forEach(el => el.remove());
  allCategories.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip' + (activeFilter === c.id ? ' active' : '');
    btn.dataset.cat = c.id;
    btn.textContent = c.name;
    btn.onclick = () => setFilter(c.id, btn);
    row.appendChild(btn);
  });
}

function setFilter(catId, el) {
  activeFilter = catId;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderTodos();
}

function renderTodos() {
  const filtered = activeFilter === 'all'
    ? allTodos
    : allTodos.filter(t => t.category && t.category.id === activeFilter);

  const list  = document.getElementById('todo-list');
  const empty = document.getElementById('empty-state');

  if (filtered.length === 0) {
    list.parentElement.style.display = 'none';
    empty.style.display = 'block';
  } else {
    list.parentElement.style.display = '';
    empty.style.display = 'none';
  }

  list.innerHTML = '';
  filtered.forEach(todo => {
    const cat = todo.category || { name: '기타', color: '#9CA3AF' };
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.innerHTML = `
      <div class="todo-check ${todo.done ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
      <div class="todo-content">
        <div class="todo-title ${todo.done ? 'done' : ''}">${escHtml(todo.title)}</div>
        <div class="todo-meta">
          <span class="category-tag" style="background:${cat.color}">${escHtml(cat.name)}</span>
          ${todo.dueDate ? `<span class="todo-due">⏰ ${todo.dueDate}</span>` : ''}
        </div>
      </div>
      <div class="todo-actions">
        <button class="todo-action-btn btn-edit" onclick="editTodo(${todo.id})">✏️</button>
        <button class="todo-action-btn btn-del" onclick="deleteTodo(${todo.id})">🗑</button>
      </div>
    `;
    list.appendChild(item);
  });

  updateProgress();
}

function updateProgress() {
  const total = allTodos.length;
  const done  = allTodos.filter(t => t.done).length;
  const pct   = total === 0 ? 0 : Math.round(done / total * 100);
  document.getElementById('pct-text').textContent = pct + '%';
  document.getElementById('progress-bar').style.width = pct + '%';
}

async function toggleTodo(id) {
  const todo = allTodos.find(t => t.id === id);
  if (!todo) return;
  try {
    const res = await authFetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ done: !todo.done }),
    });
    const updated = await res.json();
    const idx = allTodos.findIndex(t => t.id === id);
    if (idx !== -1) allTodos[idx] = updated;
    renderTodos();
  } catch {
    showToast('수정 실패');
  }
}

function editTodo(id) {
  window.location.href = `todo-detail.html?id=${id}`;
}

async function deleteTodo(id) {
  try {
    await authFetch(`/api/todos/${id}`, { method: 'DELETE' });
    allTodos = allTodos.filter(t => t.id !== id);
    renderTodos();
    showToast('삭제되었습니다.');
  } catch {
    showToast('삭제 실패');
  }
}

init();
