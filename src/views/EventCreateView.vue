<template>
    <div class="container py-5">
      <h1 class="text-center mb-4">Tạo Sự Kiện Mới</h1>
      <form @submit.prevent="handleSubmit">
        <!-- Tiêu đề sự kiện -->
        <div class="mb-3">
          <label for="eventTitle" class="form-label">Tiêu đề sự kiện</label>
          <input
            id="eventTitle"
            v-model="event.eventTitle"
            type="text"
            class="form-control"
            placeholder="Nhập tiêu đề sự kiện"
            required
          />
        </div>
  
        <!-- Ngày bắt đầu -->
        <div class="mb-3">
          <label for="eventStartDate" class="form-label">Ngày bắt đầu</label>
          <input
            id="eventStartDate"
            v-model="event.eventStartDate"
            type="datetime-local"
            class="form-control"
            required
          />
        </div>
  
        <!-- Ngày kết thúc -->
        <div class="mb-3">
          <label for="eventEndDate" class="form-label">Ngày kết thúc</label>
          <input
            id="eventEndDate"
            v-model="event.eventEndDate"
            type="datetime-local"
            class="form-control"
            required
          />
        </div>
  
        <!-- Mô tả sự kiện -->
        <div class="mb-3">
          <label for="eventDescription" class="form-label">Mô tả sự kiện</label>
          <textarea
            id="eventDescription"
            v-model="event.eventDescription"
            class="form-control"
            placeholder="Nhập mô tả sự kiện"
            rows="3"
            required
          ></textarea>
        </div>
  
        <!-- Nhãn độ tuổi -->
        <div class="mb-3">
          <label for="eventAgeTag" class="form-label">Chọn nhãn độ tuổi</label>
          <select v-model="event.eventAgeTag" id="eventAgeTag" class="form-select" required>
            <option v-for="option in eventAgeTags" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
  
        <!-- Nhãn sự kiện -->
        <div class="mb-3">
          <label for="eventTags" class="form-label">Chọn nhãn sự kiện</label>
          <select v-model="event.eventTags" id="eventTags" class="form-select" multiple>
            <option v-for="tag in eventTags" :key="tag.value" :value="tag.value">
              {{ tag.label }}
            </option>
          </select>
        </div>
  
        <!-- Thời gian sự kiện -->
        <div class="mb-3">
          <label for="eventDuration" class="form-label">Thời gian sự kiện</label>
          <input
            id="eventDuration"
            v-model="event.eventDuration"
            type="text"
            class="form-control"
            placeholder="Nhập thời gian sự kiện"
            required
          />
        </div>
  
        <!-- Địa chỉ sự kiện -->
        <div class="mb-3">
          <label for="eventAddress" class="form-label">Địa chỉ sự kiện</label>
          <input
            id="eventAddress"
            v-model="event.eventAddress"
            type="text"
            class="form-control"
            placeholder="Nhập địa chỉ"
            required
          />
        </div>
  
        <!-- Sức chứa -->
        <div class="mb-3">
          <label for="eventCapacity" class="form-label">Sức chứa</label>
          <input
            id="eventCapacity"
            v-model.number="event.eventCapacity"
            type="number"
            class="form-control"
            min="1"
            placeholder="Nhập số lượng người tối đa"
            required
          />
        </div>
  
        <!-- Trạng thái sự kiện -->
        <div class="mb-3">
          <label for="eventStatus" class="form-label">Trạng thái sự kiện</label>
          <select v-model="event.eventStatus" id="eventStatus" class="form-select" required>
            <option v-for="status in eventStatuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
  
        <!-- Chọn nghệ sĩ -->
        <div class="mb-3">
          <label for="eventListArtist" class="form-label">Chọn nghệ sĩ</label>
          <select v-model="event.eventListArtist" id="eventListArtist" class="form-select" multiple>
            <option v-for="(artist, id) in artistList" :key="id" :value="id">
              {{ artist }}
            </option>
          </select>
        </div>
  
        <!-- Công ty tổ chức -->
        <div class="mb-3">
          <label for="eventCompanyId" class="form-label">ID công ty tổ chức</label>
          <input
            id="eventCompanyId"
            v-model="event.eventCompanyId"
            type="text"
            class="form-control"
            placeholder="Nhập ID công ty"
            required
          />
        </div>
  
        <!-- Chọn Poster -->
        <div class="mb-3">
          <label for="eventPoster" class="form-label">Chọn Poster</label>
          <input type="file" id="eventPoster" @change="handlePosterChange" accept="image/*" class="form-control" />
          <div v-if="event.eventPosterUrl" class="mt-2">
            <img :src="event.eventPosterUrl" alt="Poster" class="img-fluid" style="max-width: 200px; border-radius: 8px;" />
          </div>
        </div>
  
        <!-- Chọn các hình ảnh khác -->
        <div class="mb-3">
          <label for="eventImages" class="form-label">Chọn hình ảnh khác</label>
          <input type="file" id="eventImages" @change="handleImageChange" multiple accept="image/*" class="form-control" />
          <div v-if="event.eventImages.length > 0" class="mt-2">
            <h5>Hình ảnh đã chọn:</h5>
            <div class="d-flex flex-wrap">
              <div v-for="(image, index) in event.eventImages" :key="index" class="m-2">
                <img :src="image" alt="Image Preview" class="img-thumbnail" style="max-width: 100px; max-height: 100px; object-fit: cover;" />
              </div>
            </div>
          </div>
        </div>
  
        <!-- Nút gửi -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary">Tạo sự kiện</button>
        </div>
      </form>
  
      <!-- Hiển thị kết quả -->
      <div v-if="submitted" class="mt-5 alert alert-success">
        <h4 class="alert-heading">Sự kiện đã tạo thành công!</h4>
        <pre>{{ JSON.stringify(event, null, 2) }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  // Import dữ liệu từ các file
  import { eventAgeTags } from '../composable/eventAgeTag';
  import { eventTags } from '../composable/eventTags';
  import { eventStatuses } from '../composable/eventStatus';
  
  export default {
    name: "CreateEvent",
    data() {
      return {
        event: {
          eventTitle: "Yearssss",
          eventStartDate: "2025-06-01T20:00:00",
          eventDescription: "An exciting music event featuring top artists from around the world.",
          eventAgeTag: "R21",
          eventEndDate: "2025-06-04T23:00:00",
          eventTags: ["music"],
          eventDuration: "3 hours",
          eventAddress: "123 Main Street, Concert Hall, City XYZ",
          eventCapacity: 50,
          eventStatus: "Upcoming",
          eventCompanyId: "ABC123",
          eventListArtist: {
            "6780aaf9887148569c912ddb": "John Doe",
            "6780aaf9887148569c912dd2": "Jane Smith"
          },
          eventPosterUrl: null, // Đường dẫn URL của poster
          eventImages: [] // Mảng chứa các hình ảnh được chọn
        },
        submitted: false, // Trạng thái đã gửi form
        eventAgeTags, // Danh sách nhãn độ tuổi
        eventTags, // Danh sách nhãn sự kiện
        eventStatuses, // Danh sách trạng thái sự kiện
        artistList: {  // Dữ liệu nghệ sĩ (giả sử đã fetch từ API)
          "6780aaf9887148569c912ddb": "John Doe",
          "6780aaf9887148569c912dd2": "Jane Smith",
          "6780aaf9887148569c912dd3": "Michael Jackson",
          "6780aaf9887148569c912dd4": "Adele",
        },
      };
    },
    methods: {
      handleSubmit() {
        this.submitted = true;
        console.log("Sự kiện đã tạo:", this.event);
      },
      handlePosterChange(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.event.eventPosterUrl = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      handleImageChange(event) {
        const files = event.target.files;
        this.event.eventImages = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = (e) => {
            this.event.eventImages.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Tùy chỉnh CSS cho giao diện */
  .container {
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
  }
  
  h1 {
    font-family: 'Arial', sans-serif;
    color: #333;
  }
  
  .form-label {
    font-weight: bold;
  }
  
  .btn {
    background-color: #007bff;
    color: #fff;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .img-thumbnail {
    border-radius: 8px;
    margin-right: 10px;
  }
  
  .img-fluid {
    max-width: 100%;
    height: auto;
  }
  
  .alert-success {
    background-color: #28a745;
    color: white;
    padding: 20px;
    border-radius: 8px;
  }
  
  textarea.form-control {
    font-family: 'Arial', sans-serif;
  }
  </style>
  