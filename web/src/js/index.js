if (!requireAuth()) throw 0;

const today = todayStr();
let activeFilter = 'all';

document.getElementById('today-label').textContent = formatDate(today);
document.getElementById('user-name').textContent = getUser().name + '님!';

function getTodayTodos() {
  return getTodos().filter(t => t.date === today);
}

function renderFilters() {
  const cats = getCategories();
  const row = document.getElementById('filter-row');
  row.querySelectorAll('[data-cat]:not([data-cat="all"])').forEach(el => el.remove());
  cats.forEach(c => {
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
  const all = getTodayTodos();
  const filtered = activeFilter === 'all' ? all : all.filter(t => t.categoryId === activeFilter);
  const list = document.getElementById('todo-list');
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
    const cat = getCatById(todo.categoryId);
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.innerHTML = `
      <div class="todo-check ${todo.done ? 'checked' : ''}" data-id="${todo.id}" onclick="toggleTodo('${todo.id}')"></div>
      <div class="todo-content">
        <div class="todo-title ${todo.done ? 'done' : ''}">${escHtml(todo.title)}</div>
        <div class="todo-meta">
          <span class="category-tag" style="background:${cat.color}">${escHtml(cat.name)}</span>
          ${todo.due ? `<span class="todo-due">⏰ ${todo.due}</span>` : ''}
        </div>
      </div>
      <div class="todo-actions">
        <button class="todo-action-btn btn-edit" onclick="editTodo('${todo.id}')">✏️</button>
        <button class="todo-action-btn btn-del" onclick="deleteTodo('${todo.id}')">🗑</button>
      </div>
    `;
    list.appendChild(item);
  });

  updateProgress(all);
}

function updateProgress(todos) {
  const total = todos.length;
  const done  = todos.filter(t => t.done).length;
  const pct   = total === 0 ? 0 : Math.round(done / total * 100);
  document.getElementById('pct-text').textContent = pct + '%';
  document.getElementById('progress-bar').style.width = pct + '%';
}

function toggleTodo(id) {
  const todos = getTodos();
  const t = todos.find(t => t.id === id);
  if (t) { t.done = !t.done; saveTodos(todos); renderTodos(); }
}

function editTodo(id) {
  window.location.href = `todo-detail.html?id=${id}`;
}

function deleteTodo(id) {
  saveTodos(getTodos().filter(t => t.id !== id));
  renderTodos();
  showToast('삭제되었습니다.');
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

renderFilters();
renderTodos();
