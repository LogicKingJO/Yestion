if (!requireAuth()) throw 0;

const params = new URLSearchParams(location.search);
const editId = params.get('id');
let editTodo = null;

async function init() {
  // 카테고리 로드
  try {
    const res = await authFetch('/api/categories');
    const cats = await res.json();
    const catSel = document.getElementById('f-cat');
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      catSel.appendChild(opt);
    });
  } catch {
    showToast('카테고리 로드 실패');
  }

  // 수정 모드면 기존 데이터 로드
  if (editId) {
    document.getElementById('page-title').textContent = '할 일 수정';
    try {
      // 오늘 날짜로 조회 후 못 찾으면 전체에서 찾기
      const res = await authFetch(`/api/todos`);
      const todos = await res.json();
      editTodo = todos.find(t => t.id === Number(editId));
      if (editTodo) {
        document.getElementById('f-title').value = editTodo.title || '';
        document.getElementById('f-due').value   = editTodo.dueDate || '';
        document.getElementById('f-cat').value   = editTodo.category ? editTodo.category.id : '';
        document.getElementById('f-memo').value  = editTodo.memo || '';
      }
    } catch {
      showToast('데이터 로드 실패');
    }
  } else {
    document.getElementById('f-due').value = todayStr();
  }
}

async function handleSave(e) {
  e.preventDefault();
  const title      = document.getElementById('f-title').value.trim();
  const due        = document.getElementById('f-due').value;
  const categoryId = document.getElementById('f-cat').value;
  const memo       = document.getElementById('f-memo').value.trim();

  const body = {
    title,
    dueDate: due || null,
    date: due || todayStr(),
    categoryId: categoryId ? Number(categoryId) : null,
    memo: memo || null,
  };

  try {
    if (editId) {
      await authFetch(`/api/todos/${editId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      showToast('수정되었습니다.');
    } else {
      await authFetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      showToast('할 일이 추가되었습니다!');
    }
    setTimeout(() => window.location.href = '/pages/index.html', 600);
  } catch {
    showToast('저장 실패');
  }
}

init();
