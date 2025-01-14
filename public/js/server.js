import { getUserInfo } from './util.js';

function Login() {
  let loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const { accessToken, refreshToken } = result;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        window.location.href = '/';
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  });
}

Login();

function openPopup() {
  const width = 500;
  const height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;
  const url = '/auth/google';

  window.open(
    url,
    'google-login',
    `width=${width},height=${height},top=${top},left=${left}`,
  );

  window.addEventListener('message', (event) => {
    if (event.origin !== 'http://localhost:3000') {
      return;
    }

    const token = event.data;
    if (token) {
      localStorage.setItem('accessToken', token.accessToken);
      localStorage.setItem('refreshToken', token.refreshToken);

      window.location.reload();
    }
  });
}

const googleLoginBtn = document.getElementById('googleLoginBtn');
googleLoginBtn.addEventListener('click', () => {
  openPopup();
});

function Logout() {
  const logoutBtn = document.getElementById('logout-btn');

  logoutBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      } else {
        const error = await response.json();
        alert(`Logout failed: ${error.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred during logout.');
    }
  });
}

Logout();

window.onload = () => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    document.getElementById('logged-out').style.display = 'none';
    document.getElementById('logged-in').style.display = 'flex';
  } else {
    document.getElementById('logged-out').style.display = 'flex';
    document.getElementById('logged-in').style.display = 'none';
  }
};
