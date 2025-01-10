<template>
  <form @submit.prevent="submitForm">
    <!-- Tên nghệ sĩ -->
    <div>
      <label for="artistName">Tên nghệ sĩ</label>
      <input
        v-model="artist.artistName"
        type="text"
        id="artistName"
        :class="{ 'input-invalid': errors.artistName }"
        @blur="validateField('artistName')"
        placeholder="Nhập tên nghệ sĩ"
      />
      <div v-if="errors.artistName" class="error-message">
        {{ errors.artistName }}
      </div>
    </div>

    <!-- Email liên hệ -->
    <div>
      <label for="contactMail">Email liên hệ</label>
      <input
        v-model="artist.contactMail"
        type="email"
        id="contactMail"
        :class="{ 'input-invalid': errors.contactMail }"
        @blur="validateField('contactMail')"
        placeholder="Nhập email liên hệ"
      />
      <div v-if="errors.contactMail" class="error-message">
        {{ errors.contactMail }}
      </div>
    </div>

    <!-- Số điện thoại -->
    <div>
      <label for="contactPhone">Số điện thoại</label>
      <input
        v-model="artist.contactPhone"
        type="text"
        id="contactPhone"
        :class="{ 'input-invalid': errors.contactPhone }"
        @blur="validateField('contactPhone')"
        placeholder="Nhập số điện thoại"
      />
      <div v-if="errors.contactPhone" class="error-message">
        {{ errors.contactPhone }}
      </div>
    </div>

    <!-- Giới tính -->
    <div>
      <label for="artistGender">Giới tính</label>
      <select
        v-model="artist.artistGender"
        :class="{ 'input-invalid': errors.artistGender }"
        @blur="validateField('artistGender')"
      >
        <option value="">Chọn giới tính</option>
        <option value="MALE">Nam</option>
        <option value="FEMALE">Nữ</option>
      </select>
      <div v-if="errors.artistGender" class="error-message">
        {{ errors.artistGender }}
      </div>
    </div>

    <!-- Ngày sinh -->
    <div>
      <label for="artistBirth">Ngày sinh</label>
      <input
        v-model="artist.artistBirth"
        type="date"
        id="artistBirth"
        :class="{ 'input-invalid': errors.artistBirth }"
        @blur="validateField('artistBirth')"
      />
      <div v-if="errors.artistBirth" class="error-message">
        {{ errors.artistBirth }}
      </div>
    </div>

    <!-- Ảnh đại diện -->
    <div class="avatar-container">
      <label for="avatar">Ảnh đại diện</label>
      <input type="file" id="avatar" @change="handleFileChange" />
      <div v-if="imagePreview" class="preview">
        <img :src="imagePreview" alt="Avatar preview" />
      </div>
      <div v-if="errors.avatar" class="error-message">{{ errors.avatar }}</div>
    </div>

    <!-- Thông tin nghệ sĩ -->
    <div>
      <label for="artistBio">Thông tin nghệ sĩ</label>
      <textarea
        v-model="artist.artistBio"
        id="artistBio"
        :class="{ 'input-invalid': errors.artistBio }"
        @blur="validateField('artistBio')"
        placeholder="Nhập thông tin nghệ sĩ"
      ></textarea>
      <div v-if="errors.artistBio" class="error-message">
        {{ errors.artistBio }}
      </div>
    </div>

    <!-- Công ty -->
    <div>
      <label for="company">Công ty</label>
      <select
        v-model="selectedCompanyId"
        :class="{ 'input-invalid': errors.company }"
        @blur="validateField('company')"
      >
        <option value="">Chọn công ty</option>
        <option
          v-for="company in companies"
          :key="company.id"
          :value="company.id"
        >
          {{ company.companyName }}
        </option>
      </select>
      <div v-if="errors.company" class="error-message">
        {{ errors.company }}
      </div>
    </div>

    <!-- Nút gửi -->
    <button type="submit" :disabled="!isFormInvalid">Tạo Nghệ Sĩ</button>
  </form>
</template>

<script>
import { api } from "../api/Api";

export default {
  data() {
    return {
      artist: {
        artistName: "",
        contactMail: localStorage.getItem("email") || "lỗi",
        contactPhone: "",
        artistGender: "",
        artistBirth: "",
        imageURL: "",
        artistBio: "",
      },
      imagePreview: null,
      avatarFile: null,
      errors: {},
      companies: [],
      selectedCompanyId: null,
    };
  },
  computed: {
    isFormInvalid() {
      return (
        Object.keys(this.errors).length > 0 ||
        !this.artist.artistName ||
        !this.artist.contactMail ||
        !this.artist.contactPhone ||
        !this.artist.artistGender ||
        !this.artist.artistBirth ||
        !this.artist.artistBio ||
        !this.selectedCompanyId
      );
    },
  },
  methods: {
    async fetchCompanies() {
      try {
        const res = await api.get("/companies/get-all");
        this.companies = res.data.data;
      } catch (error) {
        console.error(error);
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file) {
        if (!allowedTypes.includes(file.type)) {
          this.errors.avatar = "Chỉ hỗ trợ các tệp hình ảnh (JPEG, PNG, GIF).";
          this.imagePreview = null;
          this.avatarFile = null;
        } else if (file.size > maxSize) {
          this.errors.avatar = "Kích thước tệp không được vượt quá 5MB.";
          this.imagePreview = null;
          this.avatarFile = null;
        } else {
          this.errors.avatar = "";
          this.avatarFile = file;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    },
    async submitForm() {
      const isValid = this.validateForm();
      console.log(isValid);
      if (!isValid) {
        this.$toast.error("Vui lòng điền đầy đủ thông tin hợp lệ.");
        return;
      }

      try {
        const avatarResponse = await this.uploadAvatar();
        if (avatarResponse.data.data.imageUrl) {
          this.artist.imageURL = avatarResponse.data.data.imageUrl;
          await this.createArtist();
        }
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    async uploadAvatar() {
      const formData = new FormData();
      formData.append("file", this.avatarFile);
      return await api.post("/media/upload", formData, {
        params: { accountId: this.$route.query.accountId },
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    async createArtist() {
      try {
        const accountId = this.$route.query.accountId;
        const response = await api.post("/artists/create", this.artist, {
          params: { accountId, companyId: this.selectedCompanyId },
        });
        this.$toast.success(response.data.message);
      } catch (error) {
        console.error(error);
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    validateForm() {
      let valid = true;
      valid = this.validateField("artistName") && valid;
      valid = this.validateField("contactMail") && valid;
      valid = this.validateField("contactPhone") && valid;
      valid = this.validateField("artistGender") && valid;
      valid = this.validateField("artistBirth") && valid;
      valid = this.validateField("artistBio") && valid;
      valid = this.validateField("company") && valid;

      return valid;
    },
    validateField(fieldName) {
      let valid = true;
      switch (fieldName) {
        case "artistName":
          if (!this.artist.artistName) {
            this.errors.artistName = "Tên nghệ sĩ là bắt buộc.";
            valid = false;
          } else {
            this.errors.artistName = "";
          }
          break;
        case "contactMail":
          const mailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
          if (
            !this.artist.contactMail ||
            !mailRegex.test(this.artist.contactMail)
          ) {
            this.errors.contactMail = "Email không hợp lệ.";
            valid = false;
          } else {
            this.errors.contactMail = "";
          }
          break;
        case "contactPhone":
          const phoneRegex = /^[0-9]{10}$/;
          if (
            !this.artist.contactPhone ||
            !phoneRegex.test(this.artist.contactPhone)
          ) {
            this.errors.contactPhone = "Số điện thoại không hợp lệ.";
            valid = false;
          } else {
            this.errors.contactPhone = "";
          }
          break;
        case "artistGender":
          if (!this.artist.artistGender) {
            this.errors.artistGender = "Giới tính là bắt buộc.";
            valid = false;
          } else {
            this.errors.artistGender = "";
          }
          break;
        case "artistBirth":
          if (!this.artist.artistBirth) {
            this.errors.artistBirth = "Ngày sinh là bắt buộc.";
            valid = false;
          } else {
            this.errors.artistBirth = "";
          }
          break;
        case "artistBio":
          if (!this.artist.artistBio) {
            this.errors.artistBio = "Thông tin nghệ sĩ là bắt buộc.";
            valid = false;
          } else {
            this.errors.artistBio = "";
          }
          break;
        case "company":
          if (!this.selectedCompanyId) {
            this.errors.company = "Công ty là bắt buộc.";
            valid = false;
          } else {
            this.errors.company = "";
          }
          break;
      }
      return valid;
    },
  },
  mounted() {
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.875rem;
}

.input-invalid {
  border: 1px solid red;
}

.avatar-container {
  display: flex;
  flex-direction: column;
}

.preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input,
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input.invalid,
select.invalid {
  border-color: red;
}

.error {
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.avatar-container {
  text-align: center;
  margin-bottom: 20px;
}

.preview img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
  margin-top: 10px;
  border: 2px solid #ccc;
}

.preview {
  display: inline-block;
  position: relative;
}

select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
