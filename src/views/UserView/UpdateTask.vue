<template>
  <div class="card update-task-card">
    <div class="card-body d-flex">
      <!-- Task Information Section -->
      <div class="task-info mr-4">
        <h5 class="card-title">Thông tin tác vụ</h5>
        <p><strong>Tiêu đề:</strong> {{ task.title }}</p>
        <p><strong>Mô tả:</strong> {{ task.description }}</p>
        <p><strong>Trạng thái hiện tại:</strong> {{ task.status }}</p>
        <p><strong>Ngày tạo:</strong> {{ formatDate(task.createdDate) }}</p>
        <p><strong>Ngày tới hạn</strong> {{ formatDate(task.date) }}</p>
      </div>

      <!-- Update Form Section -->
      <div class="update-form">
        <h5 class="card-title">Cập nhật trạng thái tác vụ</h5>
        <form @submit.prevent="submitUpdate">
          <div class="form-group">
            <label for="status">Trạng thái mới</label>
            <select v-model="status" class="form-control" id="status" required>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELED">Hủy bỏ</option>
            </select>
          </div>
          <div class="form-group">
            <label for="updateDescription">Mô tả lần cập nhật</label>
            <textarea
              v-model="updateDescription"
              class="form-control"
              id="updateDescription"
              placeholder="Nhập mô tả về lần cập nhật..."
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary mt-2">Cập nhật</button>
          <button @click="cancelUpdate" class="btn btn-secondary mt-2 ml-2">
            Hủy
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/Api";

export default {
  name: "UpdateTask",
  data() {
    return {
      status: "",
      updateDescription: "",
      task: {},
    };
  },
  created() {
    this.fetchCurrentTask();
  },
  methods: {
    async fetchCurrentTask() {
      try {
        const res = await api.get(`/user/task/${this.$route.params.id}`);
        this.task = res.data.data;
        this.status = this.task.status;
      } catch (error) {
        console.error(error);
        this.$toast.error(
          error.response?.data?.message || "An unexpected error occurred."
        );
      }
    },
    async submitUpdate() {
      try {
        const res = await api.post(`/user/task/update`, {
          taskId: this.$route.params.id,
          userId: this.userId,
          updateStatus: this.status,
          updateDescription: this.updateDescription,
        });

        this.$toast.success(res.data.message);
        this.$router.push({
          name: "ListRequestUpdateTask",
        });
      } catch (error) {
        const message = error.response?.data?.message || error;
        this.$toast.error(message);
      }
    },
    cancelUpdate() {
      this.$router.push({
        name: "TaskInfo",
        params: { taskId: this.$route.params.id },
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  computed: {
    userId() {
      return this.$authStore.userId;
    },
  },
};
</script>

<style scoped>
.update-task-card {
  margin: 20px auto;
  max-width: 800px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
}

.task-info {
  flex: 1;
}

.update-form {
  flex: 1;
}

.task-info p {
  margin: 0 0 10px;
}
</style>
