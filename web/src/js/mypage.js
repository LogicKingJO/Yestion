if (!requireAuth()) throw 0;

const user = getUser();
document.getElementById('avatar').textContent        = user.name.charAt(0).toUpperCase();
document.getElementById('profile-name').textContent  = user.name;
document.getElementById('profile-email').textContent = user.email;

const todos = getTodos();
const today = todayStr();

function rateForDate(d) {
  const t = todos.filter(t => t.date === d);
  if (!t.length) return null;
  return t.filter(t => t.done).length / t.length;
}

const totalDone = todos.filter(t => t.done).length;
document.getElementById('stat-total').textContent = totalDone;

let streak = 0;
for (let i = 0; i < 365; i++) {
  const d = new Date(); d.setDate(d.getDate() - i);
  const ds = d.toISOString().slice(0, 10);
  const r = rateForDate(ds);
  if (r !== null && r >= 0.5) streak++;
  else if (i > 0) break;
}
document.getElementById('stat-streak').textContent = streak;

let wTot = 0, wDone = 0;
for (let i = 0; i < 7; i++) {
  const d = new Date(); d.setDate(d.getDate() - i);
  const ds = d.toISOString().slice(0, 10);
  const t = todos.filter(t => t.date === ds);
  wTot += t.length; wDone += t.filter(t => t.done).length;
}
document.getElementById('stat-week').textContent = wTot ? Math.round(wDone / wTot * 100) + '%' : '0%';

const ym = today.slice(0, 7);
const mTodos = todos.filter(t => t.date && t.date.startsWith(ym));
const mDone  = mTodos.filter(t => t.done).length;
document.getElementById('stat-month').textContent = mTodos.length ? Math.round(mDone / mTodos.length * 100) + '%' : '0%';

const chart = document.getElementById('bar-chart');
const days  = ['일', '월', '화', '수', '목', '금', '토'];
for (let i = 6; i >= 0; i--) {
  const d = new Date(); d.setDate(d.getDate() - i);
  const ds  = d.toISOString().slice(0, 10);
  const r   = rateForDate(ds);
  const pct = r === null ? 0 : Math.round(r * 100);
  const col = document.createElement('div');
  col.className = 'bar-col';
  col.innerHTML = `
    <div class="bar-pct">${r !== null ? pct + '%' : ''}</div>
    <div class="bar-fill" style="height:${pct}%"></div>
    <div class="bar-label">${days[d.getDay()]}</div>
  `;
  chart.appendChild(col);
}

const BADGES = [
  { icon: '🌱', name: '첫 걸음',  cond: '첫 완료',       earned: totalDone >= 1 },
  { icon: '🔥', name: '3일 연속', cond: '3일 연속 실천', earned: streak >= 3 },
  { icon: '⚡', name: '7일 연속', cond: '7일 연속 실천', earned: streak >= 7 },
  { icon: '💯', name: 'YES 10',   cond: '10개 완료',      earned: totalDone >= 10 },
  { icon: '🏆', name: 'YES 50',   cond: '50개 완료',      earned: totalDone >= 50 },
  { icon: '🌟', name: 'YES 100',  cond: '100개 완료',     earned: totalDone >= 100 },
];
const grid = document.getElementById('badge-grid');
BADGES.forEach(b => {
  const el = document.createElement('div');
  el.className = 'badge' + (b.earned ? '' : ' locked');
  el.innerHTML = `<span class="badge-icon">${b.icon}</span><div class="badge-name">${b.name}</div><div class="badge-cond">${b.cond}</div>`;
  grid.appendChild(el);
});

function logout() {
  if (!confirm('로그아웃 하시겠어요?')) return;
  localStorage.removeItem(KEY.USER);
  window.location.href = '/pages/auth.html';
}
