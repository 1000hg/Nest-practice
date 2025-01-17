import { MyPageLeftClient } from './common/mypage-left.js';
import { TopClient, TopServer } from './common/top.js';
import { LoadMyPageLeft, LoadTop } from './util/pageLoad.js';

class WriteBoardController {
  constructor() {
    this.topContainer = document.getElementById('topContainer');

    this.leftContainer = document.getElementById('leftContainer');

    this.dropZone = document.getElementById('dropZone');
    this.imageInput = document.getElementById('imageInput');
    this.preview = document.getElementById('preview');
    this.createBoardForm = document.getElementById('createBoardForm');

    this.uploadedImageFile = null;
    this.uploadedImageURL = null;

    this.category = document.getElementById('category');
  }

  async Init() {
    this.OnLoad();
    this.OnClick();
    this.SetImageForm();
  }

  async OnLoad() {
    await LoadTop(this.topContainer);
    await LoadMyPageLeft(this.leftContainer);
    await this.GetCategory();
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

      if (!this.uploadedImageFile) {
        alert('이미지를 업로드 해주세요.');
        return;
      }

      const saveImageForm = new FormData();
      saveImageForm.append('imageFile', this.uploadedImageFile);

      fetch('/files/board/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: saveImageForm,
      })
        .then((response) => response.json())
        .then((data) => {
          this.uploadedImageURL = data.imageUrl;
          this.SetBoard();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  }

  SetBoard() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const categoryId = this.category.value;

    const data = {
      user_id: -1,
      category_id: Number(categoryId),
      title: title,
      description: description,
      image_url: this.uploadedImageURL,
    };

    fetch('/board/createInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('게시글을 등록하였습니다.');
        window.location.reload();
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        this.RemoveImage();
      });
  }

  RemoveImage() {
    fetch(`/board/delete-image/${this.uploadedImageURL}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error('Error:', err));
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
        data.forEach((item) => {
          const option = document.createElement('option');

          option.value = item.id;
          option.textContent = item.title;

          this.category.appendChild(option);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

let writeBoardController = new WriteBoardController();
writeBoardController.Init();

setTimeout(() => {
  document.body.style.visibility = 'visible';

  let myPageLeftClient = new MyPageLeftClient();
  myPageLeftClient.Init();

  let topClient = new TopClient();
  topClient.Init();

  let topServer = new TopServer();
  topServer.Init();
}, 300);
