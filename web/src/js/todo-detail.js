if (!requireAuth()) throw 0;

const params = new URLSearchParams(location.search);
const editId = params.get('id');
let editTodo = null;

const catSel = document.getElementById('f-cat');
getCategories().forEach(c => {
  const opt = document.createElement('option');
  opt.value = c.id;
  opt.textContent = c.name;
  catSel.appendChild(opt);
});

if (editId) {
  document.getElementById('page-title').textContent = '할 일 수정';
  editTodo = getTodos().find(t => t.id === editId);
  if (editTodo) {
    document.getElementById('f-title').value = editTodo.title;
    document.getElementById('f-due').value   = editTodo.due || '';
    document.getElementById('f-cat').value   = editTodo.categoryId || '';
    document.getElementById('f-memo').value  = editTodo.memo || '';
  }
} else {
  document.getElementById('f-due').value = todayStr();
}

function handleSave(e) {
  e.preventDefault();
  const title      = document.getElementById('f-title').value.trim();
  const due        = document.getElementById('f-due').value;
  const categoryId = document.getElementById('f-cat').value;
  const memo       = document.getElementById('f-memo').value.trim();

  const todos = getTodos();
  if (editId && editTodo) {
    const t = todos.find(t => t.id === editId);
    if (t) { t.title = title; t.due = due; t.categoryId = categoryId; t.memo = memo; }
  } else {
    todos.push({ id: genId(), title, due, date: due || todayStr(), categoryId, memo, done: false, createdAt: Date.now() });
  }
  saveTodos(todos);
  showToast(editId ? '수정되었습니다.' : '할 일이 추가되었습니다!');
  setTimeout(() => window.location.href = 'index.html', 600);
}
