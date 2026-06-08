if (getToken() && getUser()) window.location.href = '/pages/index.html';

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) =>
    b.classList.toggle('active', (i === 0) === (tab === 'login'))
  );
  document.getElementById('login-form').classList.toggle('active', tab === 'login');
  document.getElementById('signup-form').classList.toggle('active', tab === 'signup');
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-pw').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    const data = await res.json();
    saveToken(data.accessToken);
    saveUser({ email: data.email, name: data.name });
    window.location.href = '/pages/index.html';
  } catch {
    showToast('서버 연결에 실패했습니다.');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pw    = document.getElementById('signup-pw').value;
  const pw2   = document.getElementById('signup-pw2').value;

  if (pw !== pw2) { showToast('비밀번호가 일치하지 않습니다.'); return; }

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw, name }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.message || '회원가입에 실패했습니다.');
      return;
    }

    // 회원가입 후 바로 로그인
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw }),
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      saveToken(data.accessToken);
      saveUser({ email: data.email, name: data.name });
    }

    showToast('회원가입 완료! 환영합니다 😊');
    setTimeout(() => window.location.href = '/pages/index.html', 800);
  } catch {
    showToast('서버 연결에 실패했습니다.');
  }
}
