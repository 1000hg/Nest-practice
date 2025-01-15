export async function LoadTop(element) {
  fetch('/page/common/top.html')
    .then((response) => response.text())
    .then((data) => {
      element.innerHTML = data;
    });
}
