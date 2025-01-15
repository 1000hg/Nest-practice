export class MyPageLeftClient {
  constructor() {
    this.menuItems = document.querySelectorAll('.menu-item');
  }

  Init() {
    this.OnClick();
  }

  OnLoad() {}

  OnClick() {
    this.menuItems.forEach((element) => {
      const currentPath = window.location.pathname;
      if (element.getAttribute('href') === currentPath) {
        element.classList.add('active');
      }
    });
  }
}
