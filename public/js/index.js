import { TopClient, TopServer } from './common/top.js';
import { LoadTop } from './util/pageLoad.js';

class MainController {
  constructor() {
    this.topContainer = document.getElementById('topContainer');

    //카테고리
    this.category = document.getElementById('category');
    this.categoryBtn = document.getElementById('categoryBtn');

    this.categoryText = document.getElementById('categoryText');
    this.categoryCount = document.getElementById('categoryCount');

    this.categoryMenu = document.getElementById('categoryMenu');

    //정렬
    this.sort = document.getElementById('sort');
    this.sortBtn = document.getElementById('sortBtn');

    this.sortText = document.getElementById('sortText');
    this.sortMenu = document.getElementById('sortMenu');

    this.content = document.getElementById('content');

    this.categoryId = 0;
    this.orderField = 'like_cnt';
  }

  async Init() {
    this.OnLoad();
    this.OnClick();
  }

  OnLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('category-id') || !urlParams.has('order-field')) {
      window.location.href = `?category-id=${this.categoryId}&order-field=${this.orderField}`;
    }

    LoadTop(this.topContainer);
    this.GetCategory();
    this.GetSort();
    this.GetBoard();
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

  GetCategory() {
    fetch('/category/readParentInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCategoryId = urlParams.get('category-id');

        const menuItem = this.CreateCategoryItem('전체보기', 0);
        this.SelectCategoryItem(menuItem, '전체보기');

        data.forEach((item) => {
          const menuItem = this.CreateCategoryItem(item.title, item.id);
          if (item.id === selectedCategoryId) {
            this.SelectCategoryItem(menuItem, item.title);
            this.categoryText.textContent = item.title;
          }
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  CreateCategoryItem = (text, categoryId) => {
    const a = document.createElement('a');
    a.textContent = `${text}`;
    a.style.cursor = 'pointer';

    a.addEventListener('click', (event) => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderField = urlParams.get('order-field');

      let query = `?category-id=${categoryId}&order-field=${orderField}`;

      event.preventDefault();
      this.SelectCategoryItem(a, text);
      history.pushState(null, '', query);
      this.GetBoard();
    });

    this.categoryMenu.appendChild(a);
    return a;
  };

  SelectCategoryItem = (menuItem, text) => {
    [...this.categoryMenu.children].forEach((child) => {
      child.classList.remove('selected');
    });

    menuItem.classList.add('selected');
    this.categoryText.textContent = text;
    this.category.classList.remove('show');
  };

  GetBoard() {
    this.ShowLoading(true);

    this.content.innerHTML = '';

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category-id');
    const isActive = urlParams.get('is-active');
    const createdField = urlParams.get('order-field');

    let url = '/board/readByBoardAll?';
    if (categoryId) url += `category_id=${categoryId}&`;
    if (isActive) url += `is_active=${isActive}&`;
    if (createdField) url += `order_field=${createdField}&`;
    if (createdField) url += `order_direction=DESC`;

    //url = url.slice(0, -1);

    console.log(url);

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((element) => {
          const imageContainer = document.createElement('div');
          imageContainer.className = 'img-container';

          const image = document.createElement('img');
          image.src = element.image_url;

          imageContainer.appendChild(image);
          this.content.appendChild(imageContainer);
        });

        this.categoryCount.innerText = `(${data.length})`;
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setTimeout(() => {
          this.ShowLoading(false);
        }, 1000);
      });
  }

  GetSort() {
    let dropMenu = [
      {
        title: '인기순',
        id: 'like_cnt',
      },
      {
        title: '최신순',
        id: 'created_at',
      },
    ];

    const urlParams = new URLSearchParams(window.location.search);
    const selectedOrderField = urlParams.get('order-field');

    dropMenu.forEach((item) => {
      const menuItem = this.CreateSortItem(item.title, item.id);
      if (item.id === selectedOrderField) {
        this.SelectSortItem(menuItem, item.title);
        this.sortText.textContent = item.title;
      }
    });
  }

  CreateSortItem = (text, orderField) => {
    const a = document.createElement('a');
    a.textContent = `${text}`;
    a.style.cursor = 'pointer';

    a.addEventListener('click', (event) => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryId = urlParams.get('category-id');

      let query = `?category-id=${categoryId}&order-field=${orderField}`;

      event.preventDefault();
      this.SelectSortItem(a, text);
      history.pushState(null, '', query);
      this.orderField = orderField;
      this.GetBoard();
    });

    this.sortMenu.appendChild(a);
    return a;
  };

  SelectSortItem = (menuItem, text) => {
    [...this.sortMenu.children].forEach((child) => {
      child.classList.remove('selected');
    });

    menuItem.classList.add('selected');
    this.sortText.textContent = text;
    this.sort.classList.remove('show');
  };

  ShowLoading = (isLoading) => {
    const loadingElement = document.getElementById('loading');
    if (isLoading) {
      loadingElement.style.display = 'flex';
      this.content.style.display = 'none';
    } else {
      loadingElement.style.display = 'none';
      this.content.style.display = 'block';
    }
  };
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
