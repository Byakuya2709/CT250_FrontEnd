<template>
  <div>
    <h2>Danh Sách Yêu Cầu Cập Nhật Tác Vụ</h2>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <table v-else class="table table-bordered">
      <thead>
        <tr>
          <th>Tác vụ</th>
          <th>Trạng thái tác vụ</th>
          <th>Ngày Yêu Cầu Cập Nhật</th>
          <th>Trạng Thái Yêu Cầu Cập Nhật</th>
          <th>Mô Tả Cập Nhật</th>
          <th>Trạng Thái Xét Duyệt</th>
          <th>Nhận Xét Quản trị viên</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in updates" :key="item.id" :class="getRowClass(item)">
          <td @click="toTaskInfo(item.task.id)">
            <a class="task-title" title="Xem tác vụ">{{ item.task.title }}</a>
          </td>
          <td>{{ translateStatus(item.task.status) }}</td>
          <td>{{ formatDate(item.requestedDate) }}</td>
          <td :class="{ underline: item.requestedStatus !== item.task.status }">
            {{ translateStatus(item.requestedStatus) }}
          </td>
          <td>{{ item.description || "Không có mô tả" }}</td>
          <td>{{ translateStatus(item.status) }}</td>
          <td>{{ item.adminComment || "Chưa có nhận xét" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { api } from "@/api/Api";

export default {
  data() {
    return {
      updates: [],
      loading: true,
    };
  },
  created() {
    this.fetchTaskUpdates();
  },
  computed: {
    userId() {
      return this.$authStore.userId;
    },
  },
  methods: {
    async fetchTaskUpdates() {
      this.loading = true;
      try {
        const response = await api.get(`/admin/task/update-request/all`);
        this.updates = response.data.data;
      } catch (error) {
        this.$toast.error(error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Bangkok",
        hour12: false,
      };
      return new Date(dateString).toLocaleString("vi-VN", options);
    },
    toTaskInfo(id) {
      this.$router.replace({
        name: "TaskInfo",
        params: { taskId: id },
      });
    },
    translateStatus(status) {
      const statusTranslations = {
        PENDING: "Đang chờ",
        IN_PROGRESS: "Đang tiến hành",
        COMPLETED: "Đã hoàn thành",
        CANCELED: "Hủy",
        APPROVED: "Đã chấp thuận",
        REJECTED: "Đã từ chối",
      };
      return statusTranslations[status] || status;
    },
    getRowClass(item) {
      if (item.status === "APPROVED") return "table-success"; // Tô màu cho dòng đã chấp thuận
      if (item.status === "REJECTED") return "table-danger"; // Tô màu cho dòng đã từ chối
      return ""; // Không tô màu cho các trạng thái khác
    },
  },
};
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}

.table th,
.table td {
  border: 1px solid #615c5c;
  padding: 12px;
  text-align: left;
}

.table th {
  color: #333;
  font-weight: bold;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tr:hover {
  background-color: #e0f7fa;
  cursor: pointer;
}

.task-title {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s, transform 0.3s;
}

.task-title:hover {
  color: #0056b3;
  transform: scale(1.05);
}

.task-title:active {
  color: #003f7f;
  transform: scale(0.98);
}

/* Underline style for requested status */
.underline {
  text-decoration: underline;
}
</style>
