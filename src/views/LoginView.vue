<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Đăng Nhập</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Nhập email"
            required
            autofocus
          />
          <p v-if="email && !isEmailValid" class="error-message">
            Email không hợp lệ.
          </p>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Nhập mật khẩu"
            required
          />
          <p v-if="password && password.length < 6" class="error-message">
            Mật khẩu phải ít nhất 6 ký tự.
          </p>
        </div>

        <button type="submit" :disabled="!isFormValid">Đăng Nhập</button>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/pina";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    isEmailValid() {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        this.email
      );
    },
    isFormValid() {
      return this.isEmailValid && this.password.length >= 6;
    },
  },
  methods: {
    async handleLogin() {
      if (this.isFormValid) {
        try {
          const user = {
            email: this.email,
            password: this.password,
          };
          const authStore = useAuthStore();
          const { response, role } = await authStore.login(user);

          // Kiểm tra trạng thái phản hồi
          if (response.status === 200) {
            this.$toast.success(response.data.message);
            console.log(this.$authStore.userId);
          } else {
            this.$toast.warning(response.data.message);
          }
        } catch (error) {
          this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
        }
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Chiều cao của trang đầy đủ */
  background-color: #f4f7fc;
}

.login-box {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px; /* Đặt giới hạn chiều rộng tối đa */
  min-width: 350px; /* Đặt chiều rộng tối thiểu */
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  font-size: 28px; /* Tăng kích thước font của tiêu đề */
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

input {
  width: 100%;
  padding: 14px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 14px;
  width: 100%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 14px;
}
</style>
