if (!requireAuth()) throw 0;

const now = new Date();
let curYear  = now.getFullYear();
let curMonth = now.getMonth();
let selectedDate = null;

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function dateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function renderCalendar() {
  const todos = getTodos();
  const today = todayStr();

  document.getElementById('month-title').textContent = `${curYear}년 ${curMonth + 1}월`;

  const body = document.getElementById('cal-body');
  body.innerHTML = '';

  const first    = new Date(curYear, curMonth, 1);
  const last     = new Date(curYear, curMonth + 1, 0);
  const startDay = first.getDay();

  for (let i = 0; i < startDay; i++) {
    const d = new Date(curYear, curMonth, -startDay + i + 1);
    addCell(body, d.getDate(), dateStr(d.getFullYear(), d.getMonth(), d.getDate()), true, today, todos);
  }
  for (let d = 1; d <= last.getDate(); d++) {
    addCell(body, d, dateStr(curYear, curMonth, d), false, today, todos);
  }
  const remaining = 7 - ((startDay + last.getDate()) % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(curYear, curMonth + 1, i);
      addCell(body, i, dateStr(d.getFullYear(), d.getMonth(), d.getDate()), true, today, todos);
    }
  }

  if (selectedDate) renderDetail(selectedDate);
}

function addCell(body, dayNum, ds, otherMonth, today, todos) {
  const cell = document.createElement('div');
  cell.className = 'cal-cell' +
    (otherMonth ? ' other-month' : '') +
    (ds === today ? ' today' : '') +
    (ds === selectedDate ? ' selected' : '');

  const dayTodos = todos.filter(t => t.date === ds);
  const done = dayTodos.filter(t => t.done).length;
  const rate = dayTodos.length ? done / dayTodos.length : null;

  let dotColor = '';
  if (rate !== null) {
    if (rate >= 1)        dotColor = '#4CAF50';
    else if (rate >= 0.5) dotColor = '#FF9800';
    else                  dotColor = '#F44336';
  }

  cell.innerHTML = `
    <div class="day-num">${dayNum}</div>
    ${dotColor ? `<div class="rate-dot" style="background:${dotColor}"></div>` : ''}
  `;
  cell.onclick = () => selectDate(ds);
  body.appendChild(cell);
}

function selectDate(ds) {
  selectedDate = ds;
  renderCalendar();
  renderDetail(ds);
}

function renderDetail(ds) {
  const panel = document.getElementById('day-detail');
  const todos = getTodos().filter(t => t.date === ds);
  const label = formatDate(ds);

  if (!todos.length) {
    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="day-detail-header"><span>${label}</span><span>0개</span></div>
      <div class="day-detail-empty">이 날의 할 일이 없어요</div>
    `;
    return;
  }

  const done = todos.filter(t => t.done).length;
  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="day-detail-header">
      <span>${label}</span>
      <span>${done} / ${todos.length} 완료</span>
    </div>
    <div class="day-detail-list"></div>
  `;
  const list = panel.querySelector('.day-detail-list');
  todos.forEach(todo => {
    const cat = getCatById(todo.categoryId);
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.innerHTML = `
      <div class="todo-check ${todo.done ? 'checked' : ''}" style="pointer-events:none"></div>
      <div class="todo-content">
        <div class="todo-title ${todo.done ? 'done' : ''}">${escHtml(todo.title)}</div>
        <div class="todo-meta">
          <span class="category-tag" style="background:${cat.color}">${escHtml(cat.name)}</span>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

function changeMonth(delta) {
  curMonth += delta;
  if (curMonth < 0)  { curMonth = 11; curYear--; }
  if (curMonth > 11) { curMonth = 0;  curYear++; }
  selectedDate = null;
  document.getElementById('day-detail').style.display = 'none';
  renderCalendar();
}

renderCalendar();
