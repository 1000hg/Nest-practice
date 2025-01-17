import { TopClient, TopServer } from './common/top.js';
import { LoadTop } from './util/pageLoad.js';

class MainController {
  constructor() {
    this.topContainer = document.getElementById('topContainer');

    //카테고리
    this.category = document.getElementById('category');
    this.categoryBtn = document.getElementById('categoryBtn');

    //정렬
    this.sort = document.getElementById('sort');
    this.sortBtn = document.getElementById('sortBtn');
  }

  async Init() {
    this.OnLoad();
    this.OnClick();
  }

  OnLoad() {
    LoadTop(this.topContainer);
  }

  OnClick() {
    //카테고리
    this.categoryBtn.addEventListener('click', () => {
      this.category.classList.toggle('show');
    });

    //정렬
    this.sortBtn.addEventListener('click', () => {
      this.sort.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
      if (!category.contains(event.target)) {
        category.classList.remove('show');
      }

      if (!sort.contains(event.target)) {
        sort.classList.remove('show');
      }
    });
  }
}

let mainController = new MainController();
mainController.Init();

setTimeout(() => {
  document.body.style.visibility = 'visible';
  let topClient = new TopClient();
  topClient.Init();

  let topServer = new TopServer();
  topServer.Init();
}, 300);
