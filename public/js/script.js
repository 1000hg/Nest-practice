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

window.addEventListener('click', (event) => {
  if (!category.contains(event.target)) {
    category.classList.remove('show');
  }

  if (!sort.contains(event.target)) {
    sort.classList.remove('show');
  }
});
