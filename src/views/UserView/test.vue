<template>
  <div>
    <form @submit.prevent="submitForm">
      <!-- Form Người Dùng -->
      <label for="userName">Họ Tên:</label>
      <input type="text" id="userName" v-model="user.userName" required />

      <label for="userMail">Email:</label>
      <input type="email" id="userMail" v-model="user.userMail" required />

      <label for="userPhone">Số Điện Thoại:</label>
      <input type="text" id="userPhone" v-model="user.userPhone" required />

      <label for="userGender">Giới Tính:</label>
      <select v-model="user.userGender">
        <option value="MALE">Nam</option>
        <option value="FEMALE">Nữ</option>
      </select>

      <label for="userAddress">Địa Chỉ:</label>
      <input type="text" id="userAddress" v-model="user.userAddress" required />

      <label for="userBirth">Ngày Sinh:</label>
      <input type="date" id="userBirth" v-model="user.userBirth" required />

      <!-- Upload Avatar -->
      <label for="avatar">Chọn Avatar:</label>
      <input type="file" id="avatar" @change="handleFileChange" />

      <button type="submit">Tạo Người Dùng</button>
    </form>
  </div>
</template>

<script>
import { api } from "../api/Api";
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
        }
      }
    },
    async submitForm() {
      if (this.avatarFile) {
        try {
          // Bước 1: Upload Avatar
          const avatarResponse = await this.uploadAvatar();
          console.log(avatarResponse.data);
          if (avatarResponse.data.data.imageUrl) {
            // Bước 2: Tạo Người Dùng với URL Avatar
            this.user.avatarUrl = avatarResponse.data.data.imageUrl;
            this.$toast.success(response.data.message);
            await this.createUser();
          }
        } catch (error) {
          this.$toast.error(
            "Đã xảy ra lỗi khi tải lên Avatar hoặc tạo người dùng."
          );
        }
      } else {
        this.$toast.error("Vui lòng chọn ảnh đại diện.");
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
/* Global styles for form */
form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Labels */
label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

/* Inputs and Select */
input[type="text"],
input[type="email"],
input[type="date"],
select,
input[type="file"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

/* Input focus effect */
input[type="text"]:focus,
input[type="email"]:focus,
input[type="date"]:focus,
select:focus,
input[type="file"]:focus {
  border-color: #007bff;
  outline: none;
}

/* Button style */
button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

/* Avatar upload section */
#avatar {
  padding: 10px;
}

/* Error messages for file validation */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ff6f61;
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
