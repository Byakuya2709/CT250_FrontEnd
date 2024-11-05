<template>
  <div class="update-profile bg-light" style="padding: 4rem">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="d-flex mt-5 mb-5 w-100">
        <div class="bg-white w-100 p-4 border border-dark">
          <h1 class="text-dark text-center mb-4">Cập Nhật Thông Tin Cá Nhân</h1>
          <form @submit.prevent="generateOtp" ref="updateProfileForm">
            <div class="mb-3">
              <div class="custom-file mt-4">
                <label class="custom-file-label border" for="imageUpload"
                  >Tải hình ảnh mới:</label
                >
                <input
                  class="custom-file-input btn-primary btn"
                  type="file"
                  id="imageUpload"
                  @change="previewImage"
                  accept="image/png, image/jpeg"
                />
                <div class="image-preview-container" v-if="imagePreview">
                  <img
                    :src="imagePreview"
                    alt="Image Preview"
                    class="image-preview"
                  />
                </div>
              </div>
              <label for="fullname" class="form-label">Họ và Tên</label>
              <input
                id="fullname"
                type="text"
                placeholder="Tên đầy đủ..."
                v-model="fullname"
                class="form-control"
                required
              />
              <p v-if="!validated.fullname" class="text-danger mt-1">
                Tên người dùng không được dưới 6 kí tự.
              </p>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                v-model="email"
                class="form-control"
                disabled
              />
            </div>
            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="birth" class="form-label"
                  >Ngày/Tháng/Năm sinh</label
                >
                <input
                  id="birth"
                  type="date"
                  v-model="birth"
                  class="form-control"
                  required
                />
                <p v-if="!validated.birth" class="text-danger mt-1">
                  Bạn phải đủ 18 tuổi.
                </p>
              </div>
              <div class="mb-3 col-md-6">
                <label for="address" class="form-label">Địa chỉ</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Địa chỉ"
                  v-model="address"
                  class="form-control"
                  required
                />
                <p v-if="!validated.address" class="text-danger mt-1">
                  Địa chỉ không được dưới 6 kí tự
                </p>
              </div>
            </div>
            <div class="mb-3">
              <label for="gender" class="form-label">Giới tính</label>
              <select id="gender" v-model="gender" class="form-select" required>
                <option value="" disabled selected>Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="detail" class="form-label">Chi tiết</label>
              <textarea
                id="detail"
                v-model="detail"
                placeholder="Chi tiết thêm..."
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="d-flex justify-content-center mb-3">
              <input
                type="submit"
                value="Gửi OTP"
                class="btn btn-primary w-50"
                :disabled="!isValidated || loading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal for OTP verification -->
    <div v-if="otpModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="otpModalVisible = false">&times;</span>
        <h2>Nhập mã OTP</h2>
        <input type="text" v-model="otp" placeholder="Nhập mã OTP" />
        <button @click="verifyOtp">Xác thực</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../api/Api";

export default {
  name: "UpdateProfile",
  data() {
    return {
      fullname: "",
      email: "",
      birth: "",
      address: "",
      gender: "",
      detail: "",
      imagePreview: "src/assets/data/img/defaultAvatar.png",
      loading: false,
      validated: {
        fullname: false,
        email: false,
        password: false,
        passwordConfirm: false,
        birth: false,
        address: false,
        gender: false,
      },
      otp: "",
      otpModalVisible: false,
    };
  },
  computed: {
    userId() {
      return this.$authStore.userId;
    },
    isValidated() {
      return (
        this.validated.fullname &&
        this.validated.email &&
        this.validated.birth &&
        this.validated.address &&
        this.validated.gender
      );
    },
  },
  watch: {
    fullname(value) {
      this.validateFullname(value);
    },
    email(value) {
      this.validateEmail(value);
    },
    birth(value) {
      this.validateBirth(value);
    },
    address(value) {
      this.validateAddress(value);
    },
    gender(value) {
      this.validateGender(value);
    },
  },
  methods: {
    validateFullname(value) {
      this.validated.fullname = value.length > 6;
    },
    validateEmail(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.validated.email = emailRegex.test(value);
    },
    validateBirth(value) {
      const selectedDate = new Date(value);
      const today = new Date();

      // Calculate age in years
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();

      // Check if the user is at least 18 years old
      const isAtLeast18 =
        age > 18 ||
        (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

      // Check if the selected date is not in the future
      const isNotFutureDate = selectedDate <= today;

      this.validated.birth = isAtLeast18 && isNotFutureDate;
    },
    validateAddress(value) {
      this.validated.address = value.length > 6;
    },
    validateGender(value) {
      this.validated.gender = value !== "";
    },
    async loadUserProfile() {
      try {
        const res = await api.get(`/user/${this.userId}`);
        if (res.data.status === "OK") {
          const {
            fullname,
            birth,
            address,
            gender,
            base64Image,
            email,
            detail,
          } = res.data.data;
          this.fullname = fullname;
          this.email = email;
          this.birth = birth ? new Date(birth).toISOString().split("T")[0] : "";
          this.address = address;
          this.gender = gender;
          this.detail = detail;
          this.imagePreview = base64Image
            ? `data:image/png;base64,${base64Image}`
            : this.imagePreview;
        } else {
          this.$toast.error("Lỗi khi tải thông tin người dùng.");
        }
      } catch (error) {
        this.$toast.error("Không thể tải thông tin người dùng.");
      }
    },
    async generateOtp() {
      this.loading = true;
      try {
        const res = await axios.post(
          "http://localhost:8081/api/otp2/generate",
          { email: this.email, type: "update-profile" }
        );
        this.$toast.success(res.data.message);
        this.otpModalVisible = true; // Show OTP modal
      } catch (error) {
        this.$toast.error("Có lỗi xảy ra khi gửi mã OTP.");
      } finally {
        this.loading = false;
      }
    },
    async verifyOtp() {
      this.loading = true;
      try {
        const res = await axios.post("http://localhost:8081/api/otp2/verify", {
          email: this.email,
          code: this.otp,
          type: "update-profile",
        });

        this.$toast.success("Xác thực mã OTP thành công.");

        this.otpModalVisible = false; // Hide OTP modal

        setTimeout(async () => {
          await this.updateUserProfile(); // Tiến hành cập nhật hồ sơ người dùng
        }, 1000);
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi xác thực mã OTP."
        );
      } finally {
        this.loading = false;
      }
    },
    async updateUserProfile() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append(
          "user",
          new Blob(
            [
              JSON.stringify({
                fullname: this.fullname,
                birth: this.birth,
                address: this.address,
                gender: this.gender,
                detail: this.detail,
              }),
            ],
            { type: "application/json" }
          )
        );

        const imageInput = document.getElementById("imageUpload");
        if (imageInput.files[0]) {
          formData.append("image", imageInput.files[0]);
        }

        const res = await api.put(
          `/user/update-profile/${this.userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        this.$toast.success(res.data.message);
        setTimeout(() => {
          this.$router.replace("/user/profile");
        }, 3000);
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra trong quá trình cập nhật."
        );
      } finally {
        this.loading = false;
      }
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = "src/assets/data/img/defaultAvatar.png"; // Reset to default if no file is selected
      }
    },
  },
  mounted() {
    this.loadUserProfile();
  },
};
</script>

<style scoped>
.image-preview-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.image-preview {
  max-width: 100%;
  height: auto;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 1.5rem;
  cursor: pointer;
}
.custom-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px dashed #ced4da;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: border 0.3s ease;
}
.custom-file-label {
  background-color: #5ca5ef90 !important;
  border-radius: 10px;
  padding: 2px;
  margin-bottom: 5px;
}
.custom-file:hover {
  border-color: #007bff;
}
.custom-file input[type="file"] {
  display: none;
}
.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-preview {
  max-height: 150px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
