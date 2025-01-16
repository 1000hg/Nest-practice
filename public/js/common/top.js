import { IsTokenExpired } from '../util/token.js';

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

    this.signForm = document.getElementById('signForm');
  }

  Init() {
    this.OnLoad();

    this.Login();
    this.Logout();
    this.Signup();
  }

  OnLoad() {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      this.StartTokenExpirationCheck();
      this.loggedOut.style.display = 'none';
      this.loggedIn.style.display = 'flex';
    } else {
      this.loggedOut.style.display = 'flex';
      this.loggedIn.style.display = 'none';
    }
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

          this.StartTokenExpirationCheck();

          window.location.href = '/';
        } else {
          const error = await response.json();

          if (error.code === 'EMAIL_NOT_VERIFIED') {
            const mailState = confirm(
              '이메일 인증이 필요합니다. 인증을 진행하시겠습니까?',
            );
            if (mailState) {
              this.SendVerifyMail(data.email);
              alert('이메일을 확인해주세요.');
            }
          } else {
            alert(`Login failed: ${error.message}`);
          }
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

        console.log(response);

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

  Signup() {
    this.signForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const signEmail = document.getElementById('signEmail').value;
      const signPassword = document.getElementById('signPassword').value;
      const name = document.getElementById('name').value;
      const nickname = document.getElementById('nickname').value;

      const data = {
        email: signEmail,
        password: signPassword,
        name: name,
        nickname: nickname,
        provider: 'local',
      };

      try {
        const response = await fetch('/user/createInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const mailState = confirm(
            '이메일 인증이 필요합니다. 인증을 진행하시겠습니까?',
          );
          if (mailState) {
            this.SendVerifyMail(signEmail);
          } else {
            alert('계정을 생성하였습니다. 로그인시 메일 인증을 해주세요.');
            window.location.href = '/';
          }
        } else {
          const error = await response.json();
          alert(`회원가입 실패: ${error.message}`);
        }
      } catch (err) {
        console.error('Error:', err);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    });
  }

  async SendVerifyMail(email) {
    console.log(email);
    try {
      const response = await fetch(`/auth/req-verify-email?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);

      if (response.ok) {
        const result = await response.json();
        alert('이메일을 확인해주세요.');
        console.log(result);

        window.location.href = '/';
      } else {
        const error = response.json();
        alert(`인증 메일 전송 실패: ${error.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('이메일 인증에 오류가 발생했습니다.');
    }
  }

  /** 토큰 만료 주기적으로 확인 */
  StartTokenExpirationCheck() {
    if (this.checkTokenInterval) {
      clearInterval(this.checkTokenInterval);
    }

    this.checkTokenInterval = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && IsTokenExpired(accessToken)) {
        alert('세션이 만료되었습니다.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        clearInterval(this.checkTokenInterval);
      }
    }, 1000);
  }
}
