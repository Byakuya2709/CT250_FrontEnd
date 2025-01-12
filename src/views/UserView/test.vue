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
          <select
            v-model="event.eventAgeTag"
            id="eventAgeTag"
            class="form-select"
            required
          >
            <option
              v-for="option in eventAgeTags"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
  
        <!-- Nhãn sự kiện -->
        <div class="mb-3">
          <label for="eventTags" class="form-label">Chọn nhãn sự kiện</label>
          <select v-model="event.eventTags" id="eventTags" class="form-select">
            <option v-for="tag in eventTags" :key="tag.value" :value="tag.value">
              {{ tag.label }}
            </option>
          </select>
        </div>
  
        <div class="mb-3">
          <label for="eventDuration" class="form-label">Thời gian sự kiện</label>
          <div class="d-flex align-items-center">
            <!-- Nhập số lượng thời gian -->
            <input
              id="eventDurationInput"
              v-model.number="eventDurationInput"
              type="number"
              class="form-control me-2"
              placeholder="Nhập số lượng"
              min="1"
              required
            />
            <!-- Chọn loại thời gian (day hoặc hours) -->
            <select v-model="eventDurationType" class="form-select">
              <option value="hours">Hours</option>
              <option value="day">Day</option>
            </select>
          </div>
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
          <select
            v-model="event.eventStatus"
            id="eventStatus"
            class="form-select"
            required
          >
            <option
              v-for="status in eventStatuses"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>
  
        <!-- Chọn nghệ sĩ -->
        <div class="mb-3">
          <label for="eventListArtist" class="form-label">Chọn nghệ sĩ</label>
          <div class="d-flex align-items-center">
            <!-- Dropdown để chọn nghệ sĩ -->
            <select
              id="eventListArtist"
              class="form-select me-3"
              v-model="selectedArtist"
              @change="addArtist"
            >
              <option value="" disabled>Chọn nghệ sĩ...</option>
              <option v-for="(artist, id) in artists" :key="id" :value="id">
                {{ artist.artistName }}
              </option>
            </select>
          </div>
  
          <div v-if="event.eventListArtist.length > 0" class="mt-3">
            <h5>Nghệ sĩ đã chọn:</h5>
            <div class="d-flex flex-wrap">
              <div
                v-for="id in event.eventListArtist"
                :key="id"
                class="d-flex align-items-center me-3 mb-2"
                style="
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  padding: 5px;
                  background: #f8f9fa;
                "
              >
                <span>{{ artists[id].artistName }}</span>
                <button
                  type="button"
                  class="btn btn-sm btn-danger ms-2"
                  @click="removeArtist(id)"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Công ty tổ chức -->
        <div class="mb-3">
          <label for="eventCompanyId" class="form-label"
            >Công ty đại diện tổ chức</label
          >
          <select
            v-model="event.eventCompanyId"
            id="eventCompanyId"
            class="form-select"
            required
          >
            <option v-for="(company, id) in companies" :key="id" :value="id">
              {{ company.companyName }}
            </option>
          </select>
        </div>
  
        <!-- Chọn Poster -->
        <div class="mb-3">
          <label for="eventPoster" class="form-label">Chọn Poster</label>
          <input
            type="file"
            id="eventPoster"
            @change="handlePosterChange"
            accept="image/*"
            class="form-control"
          />
          <div v-if="event.eventPosterUrl" class="mt-2">
            <img
              :src="event.eventPosterUrl"
              alt="Poster"
              class="img-fluid"
              style="max-width: 200px; border-radius: 8px"
            />
          </div>
        </div>
  
        <!-- Chọn các hình ảnh khác -->
        <div class="mb-3">
          <label for="eventImages" class="form-label">Chọn hình ảnh khác</label>
          <input
            type="file"
            id="eventImages"
            @change="handleImageChange"
            multiple
            accept="image/*"
            class="form-control"
          />
          <div v-if="event.eventImages.length > 0" class="mt-2">
            <h5>Hình ảnh đã chọn:</h5>
            <div class="d-flex flex-wrap">
              <div
                v-for="(image, index) in event.eventImages"
                :key="index"
                class="m-2"
              >
                <img
                  :src="image"
                  alt="Image Preview"
                  class="img-thumbnail"
                  style="max-width: 100px; max-height: 100px; object-fit: cover"
                />
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
  import { eventAgeTags } from "../composable/eventAgeTag";
  import { eventTags } from "../composable/eventTags";
  import { eventStatuses } from "../composable/eventStatus";
  import { api } from "../api/Api";
  
  export default {
    name: "CreateEvent",
    data() {
      return {
        event: {
          eventTitle: "",
          eventStartDate: "",
          eventDescription: "",
          eventAgeTag: "",
          eventEndDate: "",
          eventTags: "",
          eventDuration: "",
          eventAddress: "",
          eventCapacity: "",
          eventStatus: "",
          eventCompanyId: "", // select tu companies value la companyName, key la id
          eventListArtist: [], // select nhieu artist tu artistList value la artistName, key la id
          eventPosterUrl: null, // Đường dẫn URL của poster
          eventImages: [], // Mảng chứa các hình ảnh được chọn
        },
        companies: [],
        artists: [],
        selectedArtist: null, // Nghệ sĩ được chọn
        eventListArtist: [], // Danh sách nghệ sĩ đã được chọn
        eventDurationInput: null, // Giá trị số lượng thời gian (vd: 2)
        eventDurationType: "hours", // Loại thời gian (vd: hours hoặc day)
        submitted: false, // Trạng thái đã gửi form
        eventAgeTags, // Danh sách nhãn độ tuổi
        eventTags, // Danh sách nhãn sự kiện
        eventStatuses, // Danh sách trạng thái sự kiện
        isArtistSelected: false, // or any default value
      };
    },
    watch: {
      // Tự động cập nhật event.eventDuration khi eventDurationInput hoặc eventDurationType thay đổi
      eventDurationInput() {
        this.updateEventDuration();
      },
      eventDurationType() {
        this.updateEventDuration();
      },
    },
    async created() {
      await this.fetchArtist();
      await this.fetchCompanies();
    },
    methods: {
      async fetchArtist() {
        try {
          const response = await api.get("/artists/get-all");
          console.log(response.data.data);
          this.artists = response.data.data;
        } catch (error) {
          this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
        }
      },
      async fetchCompanies() {
        try {
          const response = await api.get("/companies/get-all");
          this.companies = response.data.data;
        } catch (error) {
          this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
        }
      },
  
      //submit form
      handleSubmit() {
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
    addArtist() {
      // Check if an artist is selected and not already added
      if (this.selectedArtist && !this.event.eventListArtist.includes(this.selectedArtist)) {
        this.event.eventListArtist.push(this.selectedArtist);
        this.selectedArtist = null;  // Reset the selected artist after adding
      }
    },
  
    removeArtist(artistId) {
      const index = this.event.eventListArtist.indexOf(artistId);
      if (index !== -1) {
        this.event.eventListArtist.splice(index, 1);  // Remove artist from the list
      }
    },
  
    updateEventDuration() {
      const duration = this.eventDurationInput;
      if (duration && this.eventDurationType) {
        if (this.eventDurationType === "hours") {
          this.event.eventDuration = duration + " hours";
        } else if (this.eventDurationType === "day") {
          this.event.eventDuration = duration + " days";
        }
      }
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
    font-family: "Arial", sans-serif;
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
    font-family: "Arial", sans-serif;
  }
  </style>
  