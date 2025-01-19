import { MyPageLeftClient } from './common/mypage-left.js';
import { TopClient, TopServer } from './common/top.js';
import { LoadMyPageLeft, LoadTop } from './util/pageLoad.js';

class LikeBoardController {
  constructor() {
    this.topContainer = document.getElementById('topContainer');

    this.leftContainer = document.getElementById('leftContainer');
  }

  async Init() {
    this.OnLoad();
  }

  async OnLoad() {
    await LoadTop(this.topContainer);
    await LoadMyPageLeft(this.leftContainer);
  }
}

let likeBoardController = new LikeBoardController();
likeBoardController.Init();

setTimeout(() => {
  document.body.style.visibility = 'visible';

  let myPageLeftClient = new MyPageLeftClient();
  myPageLeftClient.Init();

  let topClient = new TopClient();
  topClient.Init();

  let topServer = new TopServer();
  topServer.Init();
}, 300);
