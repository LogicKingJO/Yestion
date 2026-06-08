if (!requireAuth()) throw 0;

let editingId = null;

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function todoCountByCat(catId) {
  return getTodos().filter(t => t.categoryId === catId).length;
}

function render() {
  const cats = getCategories();
  const list = document.getElementById('cat-list');
  list.innerHTML = '';
  cats.forEach(c => {
    const count = todoCountByCat(c.id);
    const item = document.createElement('div');
    item.className = 'cat-item';
    item.innerHTML = `
      <div class="cat-dot" style="background:${c.color}"></div>
      <div class="cat-name">${escHtml(c.name)}</div>
      <span class="cat-count">${count}개</span>
      <div class="cat-actions">
        <button class="cat-action-btn btn-edit" onclick="openEdit('${c.id}')">✏️</button>
        <button class="cat-action-btn btn-del" onclick="deleteCategory('${c.id}')">🗑</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function addCategory() {
  const name  = document.getElementById('new-name').value.trim();
  const color = document.getElementById('new-color').value;
  if (!name) { showToast('카테고리 이름을 입력하세요.'); return; }
  const cats = getCategories();
  cats.push({ id: genId(), name, color });
  saveCategories(cats);
  document.getElementById('new-name').value = '';
  render();
  showToast('카테고리가 추가되었습니다!');
}

function deleteCategory(id) {
  const count = todoCountByCat(id);
  if (count > 0 && !confirm(`이 카테고리에 할 일이 ${count}개 있습니다. 삭제할까요?`)) return;
  saveCategories(getCategories().filter(c => c.id !== id));
  render();
  showToast('삭제되었습니다.');
}

function openEdit(id) {
  editingId = id;
  const c = getCatById(id);
  document.getElementById('edit-name').value  = c.name;
  document.getElementById('edit-color').value = c.color;
  document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').style.display = 'none';
  editingId = null;
}

function saveEdit() {
  const cats = getCategories();
  const c = cats.find(c => c.id === editingId);
  if (c) {
    c.name  = document.getElementById('edit-name').value.trim() || c.name;
    c.color = document.getElementById('edit-color').value;
    saveCategories(cats);
  }
  document.getElementById('modal-overlay').style.display = 'none';
  editingId = null;
  render();
  showToast('수정되었습니다.');
}

render();
