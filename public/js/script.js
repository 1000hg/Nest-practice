const category = document.getElementById('category');
const categoryBtn = document.getElementById('categoryBtn');

categoryBtn.addEventListener('click', () => {
  category.classList.toggle('show');
});

const sort = document.getElementById('sort');
const sortBtn = document.getElementById('sortBtn');

sortBtn.addEventListener('click', () => {
  sort.classList.toggle('show');
});

const loginModal = document.getElementById('loginModal');
const loginOpenBtn = document.getElementById('login-btn');
const loginCloseBtn = document.getElementById('login-close');

loginOpenBtn.addEventListener('click', function () {
  loginModal.style.display = 'block';
});

loginCloseBtn.addEventListener('click', function () {
  loginModal.style.display = 'none';
});

const signUpModal = document.getElementById('signUpModal');
const signUpOpenBtn = document.getElementById('signup-btn');
const signUpCloseBtn = document.getElementById('signup-close');

signUpOpenBtn.addEventListener('click', function () {
  signUpModal.style.display = 'block';
});

signUpCloseBtn.addEventListener('click', function () {
  signUpModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (!category.contains(event.target)) {
    category.classList.remove('show');
  }

  if (!sort.contains(event.target)) {
    sort.classList.remove('show');
  }

  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  }

  if (event.target === signUpModal) {
    signUpModal.style.display = 'none';
  }
});
