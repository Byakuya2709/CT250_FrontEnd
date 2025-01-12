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
            <option value="hours">Giờ</option>
            <option value="day">Ngày</option>
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
        eventPosterUrl: "",
        eventImages: [],
      },
      eventAgeTags,
      eventTags,
      eventStatuses,
      artists: [], // Dữ liệu nghệ sĩ
      selectedArtist: null,
      companies: [], // Dữ liệu công ty
      eventDurationInput: 0,
      eventDurationType: "hours", // Mặc định là giờ
      submitted: false,
    };
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
      this.submitted = true;
      // Chuyển đổi thời gian sự kiện từ số lượng và đơn vị
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
      const res = await api.post("/events/test", newEvent);
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
          this.event.eventPosterUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    handleImageChange(event) {
      const files = event.target.files;
      if (files) {
        const images = Array.from(files).map((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.event.eventImages.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
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
</style>
