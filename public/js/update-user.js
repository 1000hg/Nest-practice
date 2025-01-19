import { MyPageLeftClient } from './common/mypage-left.js';
import { TopClient, TopServer } from './common/top.js';
import { LoadMyPageLeft, LoadTop } from './util/pageLoad.js';

class UpdateUserController {
  constructor() {
    this.topContainer = document.getElementById('topContainer');

    this.leftContainer = document.getElementById('leftContainer');

    this.userInfo_email = document.getElementById('userInfo_email');
    this.userInfo_name = document.getElementById('userInfo_name');
    this.userInfo_nickname = document.getElementById('userInfo_nickname');

    this.updateUserForm = document.getElementById('updateUserForm');
  }

  async Init() {
    this.OnLoad();
    this.GetUserInfo();
    this.SetUpdateUser();
  }

  async OnLoad() {
    await LoadTop(this.topContainer);
    await LoadMyPageLeft(this.leftContainer);
  }

  GetUserInfo() {
    fetch('/user/readById', {
      method: 'Get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.userInfo_email.textContent = data.email;
        this.userInfo_name.textContent = data.name;
        this.userInfo_nickname.textContent = data.nickname;
      })
      .catch((error) => {
        console.error('Error:', error);
        this.RemoveImage();
      });
  }

  SetUpdateUser() {
    this.updateUserForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const edit_nickname = document.getElementById('edit_nickname').value;

      const data = {
        nickname: edit_nickname,
      };

      fetch('/user/updateInfo', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      })
        .then((data) => {
          alert('정보를 수정하였습니다.');
          window.location.reload();
          console.log(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  }
}

let updateUserController = new UpdateUserController();
updateUserController.Init();

setTimeout(() => {
  document.body.style.visibility = 'visible';

  let myPageLeftClient = new MyPageLeftClient();
  myPageLeftClient.Init();

  let topClient = new TopClient();
  topClient.Init();

  let topServer = new TopServer();
  topServer.Init();
}, 300);
