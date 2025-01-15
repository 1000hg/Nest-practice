import { TopClient, TopServer } from './common/top.js';
import { LoadTop } from './util/pageLoad.js';

class MyPageClient {
  constructor() {
    this.topContainer = document.getElementById('topContainer');
  }

  async Init() {
    this.OnLoad();
  }

  async OnLoad() {
    await LoadTop(this.topContainer);
  }
}

let myPageClient = new MyPageClient();
myPageClient.Init();

setTimeout(() => {
  document.body.style.visibility = 'visible';
  let topClient = new TopClient();
  topClient.Init();

  let topServer = new TopServer();
  topServer.Init();
}, 300);
