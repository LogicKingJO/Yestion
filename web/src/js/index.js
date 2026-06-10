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

  const runner = document.getElementById('progress-runner');
  const clampedPct = Math.max(2, Math.min(pct, 98));
  runner.style.left = clampedPct + '%';

  runner.classList.remove('running');
  if (pct > 0 && pct < 100) {
    void runner.offsetWidth;
    runner.classList.add('running');
  }
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

// 만우절 모드: + 버튼 도망가기
if (localStorage.getItem('april_fools') === 'true') {
  document.body.classList.add('april-mode');
  const fab = document.querySelector('.fab');
  const margin = 80;

  const navH = 64;
  const corners = [
    { x: margin,                          y: margin },
    { x: window.innerWidth  - margin,     y: margin },
    { x: margin,                          y: window.innerHeight - margin - navH },
    { x: window.innerWidth  - margin,     y: window.innerHeight - margin - navH },
  ];
  let currentCorner = -1;

  function teleportOpposite() {
    const oppositeIndex = [3, 2, 1, 0][currentCorner];
    const target = corners[oppositeIndex];
    fab.style.transition = 'none';
    fab.style.left = target.x + 'px';
    fab.style.top  = target.y + 'px';
    currentCorner = oppositeIndex;
    setTimeout(() => {
      fab.style.transition = 'left 0.6s ease, top 0.6s ease';
      fab.style.left = (window.innerWidth  / 2) + 'px';
      fab.style.top  = (window.innerHeight / 2) + 'px';
      currentCorner = -1;
    }, 100);
    setTimeout(() => { fab.style.transition = 'left 0.2s ease, top 0.2s ease'; }, 600);
  }

  function escapeFab(clientX, clientY) {
    const rect = fab.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const angle = Math.atan2(dy, dx);
      const nx = cx - Math.cos(angle) * 130;
      const ny = cy - Math.sin(angle) * 130;
      const clampedX = Math.max(margin, Math.min(window.innerWidth - margin, nx));
      const clampedY = Math.max(margin, Math.min(window.innerHeight - margin - navH, ny));

      // 모서리에 막혔는지 감지 (클램핑 전후 차이가 크면 모서리)
      const stuckX = Math.abs(nx - clampedX) > 20;
      const stuckY = Math.abs(ny - clampedY) > 20;
      if (stuckX && stuckY) {
        // 현재 어느 모서리인지 파악
        const isRight  = clampedX >= window.innerWidth  - margin - 5;
        const isBottom = clampedY >= window.innerHeight  - margin - navH - 5;
        currentCorner = isRight ? (isBottom ? 3 : 1) : (isBottom ? 2 : 0);
        teleportOpposite();
        return;
      }

      fab.style.position = 'fixed';
      fab.style.transition = 'left 0.2s ease, top 0.2s ease';
      fab.style.left = clampedX + 'px';
      fab.style.top  = clampedY + 'px';
      fab.style.right  = 'unset';
      fab.style.bottom = 'unset';
    }
  }

  document.addEventListener('mousemove', (e) => escapeFab(e.clientX, e.clientY));
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    escapeFab(t.clientX, t.clientY);
  }, { passive: true });
}
