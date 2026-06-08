if (getUser()) window.location.href = 'index.html';

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) =>
    b.classList.toggle('active', (i === 0) === (tab === 'login'))
  );
  document.getElementById('login-form').classList.toggle('active', tab === 'login');
  document.getElementById('signup-form').classList.toggle('active', tab === 'signup');
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-pw').value;
  const stored = JSON.parse(localStorage.getItem('yestion_accounts') || '[]');
  const found  = stored.find(u => u.email === email && u.password === pw);
  if (!found) { showToast('이메일 또는 비밀번호가 올바르지 않습니다.'); return; }
  saveUser({ email: found.email, name: found.name });
  window.location.href = 'index.html';
}

function handleSignup(e) {
  e.preventDefault();
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pw    = document.getElementById('signup-pw').value;
  const pw2   = document.getElementById('signup-pw2').value;
  if (pw !== pw2) { showToast('비밀번호가 일치하지 않습니다.'); return; }
  const accounts = JSON.parse(localStorage.getItem('yestion_accounts') || '[]');
  if (accounts.find(u => u.email === email)) { showToast('이미 사용 중인 이메일입니다.'); return; }
  accounts.push({ email, name, password: pw });
  localStorage.setItem('yestion_accounts', JSON.stringify(accounts));
  saveUser({ email, name });
  showToast('회원가입 완료! 환영합니다 😊');
  setTimeout(() => window.location.href = 'index.html', 800);
}
