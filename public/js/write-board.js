import { MyPageLeftClient } from './common/mypage-left.js';
import { TopClient, TopServer } from './common/top.js';
import { LoadMyPageLeft, LoadTop } from './util/pageLoad.js';

class WriteBoardClient {
  constructor() {
    this.topContainer = document.getElementById('topContainer');

    this.leftContainer = document.getElementById('leftContainer');

    this.dropZone = document.getElementById('dropZone');
    this.imageInput = document.getElementById('imageInput');
    this.preview = document.getElementById('preview');
    this.createBoardForm = document.getElementById('createBoardForm');

    this.uploadedImageFile = null;
  }

  async Init() {
    this.OnLoad();
    this.OnClick();
    this.SetImageForm();
  }

  async OnLoad() {
    await LoadTop(this.topContainer);
    await LoadMyPageLeft(this.leftContainer);
  }

  async OnClick() {
    this.dropZone.addEventListener('click', () => {
      this.imageInput.click();
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.style.backgroundColor = '#e6f7ff';
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.style.backgroundColor = '#f9f9f9';
    });

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.style.backgroundColor = '#f9f9f9';

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.HandleFileUpload(files[0]);
      }
    });

    this.imageInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.HandleFileUpload(e.target.files[0]);
      }
    });
  }

  HandleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    this.uploadedImageFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }

  SetImageForm() {
    this.createBoardForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;

      if (!this.uploadedImageFile) {
        alert('Please upload an image.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', this.uploadedImageFile);

      fetch('/files/board/upload-image', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert('Board created successfully!');
          console.log(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  }
}

let writeBoardClient = new WriteBoardClient();
writeBoardClient.Init();

setTimeout(() => {
  document.body.style.visibility = 'visible';

  let myPageLeftClient = new MyPageLeftClient();
  myPageLeftClient.Init();

  let topClient = new TopClient();
  topClient.Init();

  let topServer = new TopServer();
  topServer.Init();
}, 300);
