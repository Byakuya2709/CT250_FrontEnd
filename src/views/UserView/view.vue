<template>
  <div class="form-container">
    <h2 class="form-title">Tạo Người Dùng Mới</h2>

    <form @submit.prevent="submitForm" class="user-form">
      <!-- Avatar Upload -->
      <div class="form-group">
        <label for="avatar" class="form-label">Ảnh Đại Diện</label>
        <input
          id="avatar"
          type="file"
          @change="handleFileChange"
          class="form-input file-input"
        />
        <div v-if="user.avatarUrl" class="avatar-preview">
          <img :src="user.avatarUrl" alt="Avatar Preview" />
        </div>
      </div>

      <!-- Tên Người Dùng -->
      <div class="form-group">
        <label for="name" class="form-label">Tên Người Dùng</label>
        <input
          id="name"
          type="text"
          v-model="user.name"
          placeholder="Nhập tên người dùng"
          class="form-input"
          required
        />
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          v-model="userMail"
          placeholder="Nhập email"
          class="form-input"
          disabled
        />
      </div>

      <!-- Nút Gửi -->
      <div class="form-actions">
        <button type="submit" :disabled="isLoading" class="btn btn-primary">
          <span v-if="!isLoading">Tạo Người Dùng</span>
          <span v-else>Đang xử lý...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        userName: "",
        userMail: localStorage.getItem("email") || "lỗi",
        userPhone: "",
        userGender: "MALE",
        userAddress: "",
        userBirth: "",
        avatarUrl: null,
      },
      isLoading: false,
      avatarFile: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file) {
        if (!allowedTypes.includes(file.type)) {
          this.$toast.error("Chỉ hỗ trợ các tệp hình ảnh (JPEG, PNG, GIF).");
          this.avatarFile = null;
        } else if (file.size > maxSize) {
          this.$toast.error("Kích thước tệp không được vượt quá 5MB.");
          this.avatarFile = null;
        } else {
          this.avatarFile = file;

          // Hiển thị preview
          const reader = new FileReader();
          reader.onload = (e) => {
            this.user.avatarUrl = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    },
    async submitForm() {
      this.isLoading = true;
      try {
        const avatarResponse = await this.uploadAvatar();
        console.log(avatarResponse.data);
        if (avatarResponse.data.data.imageUrl) {
          // Bước 2: Tạo Người Dùng với URL Avatar
          this.user.avatarUrl = avatarResponse.data.data.imageUrl;
          this.$toast.success(response.data.message);
          await this.createUser();
        }
      } catch (error) {
        this.$toast.error("Đã xảy ra lỗi khi tạo người dùng.");
      } finally {
        this.isLoading = false;
      }
    },
    async uploadAvatar() {
      const formData = new FormData();
      formData.append("file", this.avatarFile);

      try {
        // Gửi request upload ảnh và kèm theo accountId
        return await api.post("/media/upload", formData, {
          params: {
            accountId: this.$route.query.accountId, // Truyền accountId từ query parameter
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    async createUser() {
      try {
        // Lấy accountId từ URL params
        const accountId = this.$route.query.accountId;

        const response = await api.post("/users/create", this.user, {
          params: {
            accountId: accountId, // Gửi accountId làm tham số URL
          },
        });
        this.$toast.success(response.data.message);

        // Xóa email sau khi tạo người dùng thành công
        localStorage.removeItem("email");
      } catch (error) {
        this.$toast.error("Đã xảy ra lỗi khi tạo người dùng");
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.user-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #007bff;
}

.file-input {
  padding: 5px;
}

.avatar-preview {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.avatar-preview img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff;
}

.form-actions {
  text-align: center;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
