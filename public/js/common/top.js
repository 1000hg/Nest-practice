export class TopClient {
  constructor() {
    //로그인 모달
    this.loginModal = document.getElementById('loginModal');
    this.loginOpenBtn = document.getElementById('loginOpenBtn');
    this.loginCloseBtn = document.getElementById('loginCloseBtn');

    //회원가입 모달
    this.signUpModal = document.getElementById('signUpModal');
    this.signUpOpenBtn = document.getElementById('signUpOpenBtn');
    this.signUpCloseBtn = document.getElementById('signUpCloseBtn');

    //마이페이지
    this.myPageBtn = document.getElementById('myPageBtn');

    //구글 로그인 버튼
    this.googleLoginBtn = document.getElementById('googleLoginBtn');

    this.loggedOut = document.getElementById('loggedOut');
    this.loggedIn = document.getElementById('loggedIn');

    this.logo = document.getElementById('logo');
  }

  Init() {
    this.OnLoad();
    this.OnClick();
  }

  OnLoad() {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      this.loggedOut.style.display = 'none';
      this.loggedIn.style.display = 'flex';
    } else {
      this.loggedOut.style.display = 'flex';
      this.loggedIn.style.display = 'none';
    }
  }

  OnClick() {
    //로그인 모달
    this.loginOpenBtn.addEventListener('click', function () {
      loginModal.style.display = 'block';
    });

    this.loginCloseBtn.addEventListener('click', function () {
      loginModal.style.display = 'none';
    });

    //회원가입 모달
    this.signUpOpenBtn.addEventListener('click', function () {
      signUpModal.style.display = 'block';
    });

    this.signUpCloseBtn.addEventListener('click', function () {
      signUpModal.style.display = 'none';
    });

    //마이페이지
    this.myPageBtn.addEventListener('click', function () {
      window.location.href = '/page/update-user';
    });

    //구글 로그인
    this.googleLoginBtn.addEventListener('click', () => {
      this.OpenGooglePopup();
    });

    this.logo.addEventListener('click', () => {
      window.location.href = '/';
    });

    //윈도우 클릭 이벤트
    window.addEventListener('click', (event) => {
      if (event.target === this.loginModal) {
        this.loginModal.style.display = 'none';
      }

      if (event.target === this.signUpModal) {
        this.signUpModal.style.display = 'none';
      }
    });
  }

  OpenGooglePopup() {
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
}

export class TopServer {
  constructor() {
    this.loginForm = document.getElementById('loginForm');

    this.logoutBtn = document.getElementById('logoutBtn');

    this.loggedOut = document.getElementById('loggedOut');
    this.loggedIn = document.getElementById('loggedIn');
  }

  Init() {
    this.OnLoad();

    this.Login();
    this.Logout();
  }

  OnLoad() {
    window.onload = () => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        this.loggedOut.style.display = 'none';
        this.loggedIn.style.display = 'flex';
      } else {
        this.loggedOut.style.display = 'flex';
        this.loggedIn.style.display = 'none';
      }
    };
  }

  Login() {
    this.loginForm.addEventListener('submit', async (event) => {
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

  Logout() {
    this.logoutBtn.addEventListener('click', async (event) => {
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
}
