if (!requireAuth()) throw 0;

let editingId = null;
let allCategories = [];
let allTodos = [];

async function init() {
  try {
    const [catRes, todoRes] = await Promise.all([
      authFetch('/api/categories'),
      authFetch('/api/todos'),
    ]);
    allCategories = await catRes.json();
    allTodos      = await todoRes.json();
    render();
  } catch {
    showToast('데이터 로드 실패');
  }
}

function todoCountByCat(catId) {
  return allTodos.filter(t => t.category && t.category.id === catId).length;
}

function render() {
  const list = document.getElementById('cat-list');
  list.innerHTML = '';
  allCategories.forEach(c => {
    const count = todoCountByCat(c.id);
    const item = document.createElement('div');
    item.className = 'cat-item';
    item.innerHTML = `
      <div class="cat-dot" style="background:${c.color}"></div>
      <div class="cat-name">${escHtml(c.name)}</div>
      <span class="cat-count">${count}개</span>
      <div class="cat-actions">
        <button class="cat-action-btn btn-edit" onclick="openEdit(${c.id})">✏️</button>
        <button class="cat-action-btn btn-del" onclick="deleteCategory(${c.id})">🗑</button>
      </div>
    `;
    list.appendChild(item);
  });
}

async function addCategory() {
  const name  = document.getElementById('new-name').value.trim();
  const color = document.getElementById('new-color').value;
  if (!name) { showToast('카테고리 이름을 입력하세요.'); return; }

  try {
    const res = await authFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
    const created = await res.json();
    allCategories.push(created);
    document.getElementById('new-name').value = '';
    render();
    showToast('카테고리가 추가되었습니다!');
  } catch {
    showToast('추가 실패');
  }
}

async function deleteCategory(id) {
  const count = todoCountByCat(id);
  if (count > 0 && !confirm(`이 카테고리에 할 일이 ${count}개 있습니다. 삭제할까요?`)) return;

  try {
    await authFetch(`/api/categories/${id}`, { method: 'DELETE' });
    allCategories = allCategories.filter(c => c.id !== id);
    render();
    showToast('삭제되었습니다.');
  } catch {
    showToast('삭제 실패');
  }
}

function openEdit(id) {
  editingId = id;
  const c = allCategories.find(c => c.id === id);
  document.getElementById('edit-name').value  = c.name;
  document.getElementById('edit-color').value = c.color;
  document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').style.display = 'none';
  editingId = null;
}

async function saveEdit() {
  const name  = document.getElementById('edit-name').value.trim();
  const color = document.getElementById('edit-color').value;

  try {
    const res = await authFetch(`/api/categories/${editingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, color }),
    });
    const updated = await res.json();
    const idx = allCategories.findIndex(c => c.id === editingId);
    if (idx !== -1) allCategories[idx] = updated;
    document.getElementById('modal-overlay').style.display = 'none';
    editingId = null;
    render();
    showToast('수정되었습니다.');
  } catch {
    showToast('수정 실패');
  }
}

init();
