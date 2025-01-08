<template>
  <div class="register-container">
    <h2>Đăng Ký</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Nhập email"
          required
          class="input-field"
        />
        <span v-if="errors.email" class="error-message">{{
          errors.email
        }}</span>
      </div>

      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Nhập mật khẩu"
          required
          class="input-field"
        />
        <span v-if="errors.password" class="error-message">{{
          errors.password
        }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Nhập lại mật khẩu</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          required
          class="input-field"
        />
        <span v-if="errors.confirmPassword" class="error-message">{{
          errors.confirmPassword
        }}</span>
      </div>

      <button type="submit" class="submit-btn">Đăng ký</button>
    </form>

    <!-- Modal nhập OTP -->
    <div v-if="isOtpModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h3>Nhập mã OTP</h3>
        <input
          v-model="otp"
          type="text"
          placeholder="Nhập OTP"
          class="otp-input"
          maxlength="6"
        />
        <div class="modal-actions">
          <button @click="verifyOtp" class="submit-btn">Xác nhận OTP</button>
          <button @click="closeOtpModal" class="cancel-btn">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      errors: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      isOtpModalVisible: false,
    };
  },
  methods: {
    handleSubmit() {
      this.errors = {}; // Reset errors

      // Validate fields
      if (!this.email) {
        this.errors.email = "Email không được để trống";
      }
      if (!this.password) {
        this.errors.password = "Mật khẩu không được để trống";
      }
      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = "Mật khẩu không khớp";
      }

      if (Object.keys(this.errors).length === 0) {
        // Mô phỏng việc gửi yêu cầu đăng ký
        alert("Đăng ký thành công! Vui lòng nhập mã OTP.");

        // Hiển thị modal nhập OTP
        this.isOtpModalVisible = true;
      }
    },
    verifyOtp() {
      // Kiểm tra mã OTP
      if (this.otp === "123456") {
        alert("OTP xác nhận thành công!");
        this.$router.push("/home"); // Chuyển sang route khác (ví dụ: /home)
      } else {
        alert("Mã OTP không chính xác. Vui lòng thử lại.");
      }
    },
    closeOtpModal() {
      this.isOtpModalVisible = false;
    },
  },
};
</script>

<style scoped>
.register-container {
  width: 400px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  color: #333;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
  color: #666;
}

.input-field {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
  outline: none;
  background-color: #fff;
  transition: 0.3s ease;
}

.input-field:focus {
  border-color: #666;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s ease;
}

.submit-btn:hover {
  background-color: #444;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  width: 300px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.otp-input {
  width: 80%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-btn {
  padding: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e53935;
}
</style>
