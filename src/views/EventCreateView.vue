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
          @input="validateTitle"
          required
        />
        <p v-if="errors.eventTitle" class="error-message">
          {{ errors.eventTitle }}
        </p>
      </div>

      <!-- Ngày bắt đầu -->
      <div class="mb-3">
        <label for="eventStartDate" class="form-label">Ngày bắt đầu</label>
        <input
          id="eventStartDate"
          v-model="event.eventStartDate"
          type="datetime-local"
          class="form-control"
          @input="validateStartDate"
          required
        />
        <p v-if="errors.eventStartDate" class="error-message">
          {{ errors.eventStartDate }}
        </p>
      </div>

      <!-- Ngày kết thúc -->
      <div class="mb-3">
        <label for="eventEndDate" class="form-label">Ngày kết thúc</label>
        <input
          id="eventEndDate"
          v-model="event.eventEndDate"
          type="datetime-local"
          class="form-control"
          @input="validateEndDate"
          required
        />
        <p v-if="errors.eventEndDate" class="error-message">
          {{ errors.eventEndDate }}
        </p>
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
          @input="validateDescription"
          required
        ></textarea>
        <p v-if="errors.eventDescription" class="error-message">
          {{ errors.eventDescription }}
        </p>
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
            <option value="hours">Giờ</option>
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
          min="0"
          @input="validateCapacity"
          placeholder="Nhập số lượng người tối đa"
          required
        />
        <p v-if="errors.eventCapacity" class="error-message">
          {{ errors.eventCapacity }}
        </p>
      </div>

      <!-- Giá vé -->
      <div class="mb-3">
        <label for="eventPrice" class="form-label">Giá vé</label>
        <input
          id="eventPrice"
          v-model.number="event.eventPrice"
          type="number"
          class="form-control"
          min="0"
          @input="validatePrice"
          placeholder="Nhập giá vé"
          required
        />
        <p v-if="errors.eventPrice" class="error-message">
          {{ errors.eventPrice }}
        </p>
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
            <option
              v-for="(artist, id) in artists"
              :key="artist.id"
              :value="artist.id"
              :disabled="
                event.eventListArtist.some((item) => item.id === artist.id)
              "
            >
              {{ artist.artistName }}
            </option>
          </select>
        </div>

        <div v-if="event.eventListArtist.length > 0" class="mt-3">
          <h5>Nghệ sĩ đã chọn:</h5>
          <div class="d-flex flex-wrap">
            <div
              v-for="(item, index) in event.eventListArtist"
              :key="index"
              class="d-flex align-items-center me-3 mb-2"
              style="
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px;
                background: #f8f9fa;
              "
            >
              <span>{{ item.artistName }}</span>
              <button
                type="button"
                class="btn btn-sm btn-danger ms-2"
                @click="removeArtist(item.id)"
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
        <div v-if="eventPosterResult" class="mt-2">
          <img
            :src="eventPosterResult"
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
        <div v-if="eventImages.length > 0" class="mt-2">
          <h5>Hình ảnh đã chọn:</h5>
          <div class="d-flex flex-wrap">
            <div v-for="(image, index) in eventImages" :key="index" class="m-2">
              <img
                :src="image"
                alt="Image Preview"
                class="img-thumbnail"
                style="max-width: 100px; max-height: 100px; object-fit: cover"
              />
              <!-- Nút bỏ chọn ảnh -->
              <button
                type="button"
                class="btn btn-sm btn-warning mt-1"
                @click="removeImage(index)"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nút gửi -->
      <div class="text-center">
        <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
          Tạo sự kiện
        </button>
      </div>
    </form>
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
        eventEndDate: "",
        eventDescription: "",
        eventAgeTag: null,
        eventTags: [],
        eventDuration: 0,
        eventDurationType: "hours",
        eventAddress: "",
        eventCapacity: 0,
        eventStatus: "",
        eventListArtist: [],
        eventCompanyId: "",
        eventPrice: 0,
        eventListImgURL: [],
      },
      errors: {
        eventTitle: "Tiêu đề sự kiện không được để trống",
        eventStartDate: "",
        eventEndDate: "",
        eventDescription: "",
        eventAgeTag: "",
        eventTags: "",
        eventDuration: "",
        eventAddress: "",
        eventCapacity: "Sức chứa phải lớn hơn 0",
        eventStatus: "",
        eventCompanyId: "",
        eventPrice: "Giá vé phải là số không âm",
        eventListImgURL: "",
      },
      eventImages: [],
      eventAgeTags,
      eventTags,
      eventPosterUrl: null,
      eventPosterResult: null,
      eventStatuses,
      artists: [], // Dữ liệu nghệ sĩ
      selectedArtist: null,
      companies: [], // Dữ liệu công ty
      eventDurationInput: 0,
      eventDurationType: "hours", // Mặc định là giờ
      submitted: false,
      filesData: new FormData(),
    };
  },

  computed: {
    isFormValid() {
      // Kiểm tra tất cả các lỗi trong object errors, nếu có lỗi thì form không hợp lệ
      return Object.values(this.errors).every((error) => error === "");
    },
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
    async handleSubmit() {
      try {
        const posterResponse = await this.uploadPoster();
        if (posterResponse.data.data.imageUrl) {
          this.event.eventListImgURL.push(posterResponse.data.data.imageUrl);
        }
        const imageResponse = await this.uploadImages();
        console.log("------");
        console.log(imageResponse.data.data);

        //
        const response = imageResponse.data.data;

        if (Array.isArray(response)) {
          // Nếu là mảng, thêm toàn bộ URL từ mảng
          const uniqueUrls = response.filter(
            (url) => !this.event.eventListImgURL.includes(url)
          );
          this.event.eventListImgURL.push(...uniqueUrls);
        } else if (typeof response === "string") {
          // Nếu là chuỗi, kiểm tra đã tồn tại trong mảng chưa, nếu chưa thì thêm
          if (!this.event.eventListImgURL.includes(response)) {
            this.event.eventListImgURL.push(response);
          }
        } else {
          console.error("Unexpected data format:", response);
        }
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }

      this.event.eventDuration =
        this.eventDurationInput * (this.eventDurationType === "hours" ? 1 : 24);

      const newEvent = {
        ...this.event, // Sao chép tất cả thuộc tính từ this.event
        eventListArtist: this.event.eventListArtist.reduce((acc, item) => {
          acc[item.id] = item.artistName;
          return acc;
        }, {}),
      };

      // In ra đối tượng event mới
      console.log(newEvent);
      this.event.eventListImgURL = [];
      try{
        const response = await api.post("/events/create", newEvent);
        console.log(response)
        this.$toast.success(response.data.message);
      }
     catch(error){
      this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
     }
      
    },
    async uploadPoster() {
      const formData = new FormData();
      formData.append("file", this.eventPosterUrl);
      return await api.post("/media/upload/events/poster", formData, {
        params: { eventTitle: this.event.eventTitle },
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    async uploadImages() {
      return await api.post("/media/upload/events", this.filesData, {
        params: { eventTitle: this.event.eventTitle },
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

    addArtist() {
      if (this.selectedArtist) {
        // Tìm kiếm thông tin nghệ sĩ dựa trên selectedArtist (id)
        const artist = this.artists.find((a) => a.id === this.selectedArtist);
        if (
          artist &&
          !this.event.eventListArtist.some((item) => item.id === artist.id)
        ) {
          // Thêm cả id và artistName vào eventListArtist
          this.event.eventListArtist.push({
            id: artist.id,
            artistName: artist.artistName,
          });
        }
        this.selectedArtist = null; // Reset lại giá trị để không thể chọn lại nghệ sĩ vừa chọn
      }
    },
    removeArtist(id) {
      const index = this.event.eventListArtist.findIndex(
        (item) => item.id === id
      );
      if (index !== -1) {
        this.event.eventListArtist.splice(index, 1);
      }
    },
    getArtistName(id) {
      const artist = this.artists.find((a) => a.id === id);
      return artist ? artist.artistName : "";
    },

    handlePosterChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.eventPosterUrl = file;
          this.eventPosterResult = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    handleImageChange(event) {
      const files = event.target.files;
      if (files) {
        // Duyệt qua từng file và thêm vào FormData
        Array.from(files).forEach((file) => {
          this.filesData.append("files", file); // Thêm file gốc vào FormData
          const reader = new FileReader();
          reader.onload = (e) => {
            this.eventImages.push(e.target.result); // Thêm base64 vào danh sách hiển thị nếu cần
          };
          reader.readAsDataURL(file);
        });
      }
    },
    removeImage(index) {
      this.eventImages.splice(index, 1);
      const newFormData = new FormData();
      this.eventImages.forEach((_, i) => {
        const file = this.filesData.getAll("files")[i]; // Lấy file từ FormData gốc
        newFormData.append("files", file); // Thêm lại các file còn lại vào FormData mới
      });

      this.filesData = newFormData;
      console.log(this.eventImages);
    },
    validateTitle() {
      if (!this.event.eventTitle) {
        this.errors.eventTitle = "Tiêu đề sự kiện không được để trống";
      } else if (this.event.eventTitle.length < 5) {
        this.errors.eventTitle = "Tiêu đề phải có ít nhất 5 ký tự";
      } else {
        this.errors.eventTitle = "";
      }
    },

    validateStartDate() {
      if (!this.event.eventStartDate) {
        this.errors.eventStartDate = "Ngày bắt đầu không được để trống";
      } else if (new Date(this.event.eventStartDate) < new Date()) {
        this.errors.eventStartDate = "Ngày bắt đầu phải lớn hơn ngày hiện tại";
      } else {
        this.errors.eventStartDate = "";
      }
    },

    validateEndDate() {
      if (!this.event.eventEndDate) {
        this.errors.eventEndDate = "Ngày kết thúc không được để trống";
      } else if (
        new Date(this.event.eventEndDate) <= new Date(this.event.eventStartDate)
      ) {
        this.errors.eventEndDate = "Ngày kết thúc phải sau ngày bắt đầu";
      } else {
        this.errors.eventEndDate = "";
      }
    },

    validateDescription() {
      if (!this.event.eventDescription) {
        this.errors.eventDescription = "Mô tả sự kiện không được để trống";
      } else if (this.event.eventDescription.length < 10) {
        this.errors.eventDescription = "Mô tả sự kiện phải có ít nhất 10 ký tự";
      } else {
        this.errors.eventDescription = "";
      }
    },

    validateCapacity() {
      if (this.event.eventCapacity <= 0) {
        this.errors.eventCapacity = "Sức chứa phải lớn hơn 0";
      } else {
        this.errors.eventCapacity = "";
      }
    },

    validatePrice() {
      if (this.event.eventPrice <= 0) {
        this.errors.eventPrice = "Giá vé phải là số không âm";
      } else {
        this.errors.eventPrice = "";
      }
    },
  },

  mounted() {
    this.fetchArtist();
    this.fetchCompanies();
  },
};
</script>

<style scoped>
/* Định dạng tùy chỉnh cho các phần tử */
.container {
  max-width: 800px;
  margin: 0 auto;
}
.error-message {
  color: red;
  font-size: 14px;
}
</style>
