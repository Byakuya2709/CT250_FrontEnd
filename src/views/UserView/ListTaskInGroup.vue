<template>
  <div class="task-list container">
    <h2 class="text-center">Danh sách tác vụ của các thành viên trong nhóm</h2>

    <!-- Filter by Status -->
    <div class="text-left mb-3">
      <label for="status-filter">Lọc theo trạng thái:</label>
      <select id="status-filter" v-model="selectedStatus" @change="updateQuery">
        <option value="">Tất cả</option>
        <option value="COMPLETED">Hoàn thành</option>
        <option value="IN_PROGRESS">Đang thực hiện</option>
        <option value="PENDING">Đang chờ</option>
        <option value="CANCELED">Bị hủy</option>
      </select>
    </div>

    <!-- Task List -->
    <div class="row">
      <div v-for="task in filteredTasks" :key="task.id" class="col-md-4 mb-3">
        <TaskComponent :task="task" />
      </div>
    </div>
  </div>
</template>

<script>
import TaskComponent from "@/views/UserView/Task.vue";
import { api } from "@/api/Api";

export default {
  components: {
    TaskComponent,
  },
  data() {
    return {
      tasks: [],
      selectedStatus: this.$route.query.status || "", // Lấy trạng thái từ query
    };
  },
  computed: {
    user() {
      return this.$authStore.user; // Sửa lỗi cú pháp tại đây
    },
    filteredTasks() {
      if (!this.selectedStatus) {
        return this.tasks; // Nếu không có trạng thái nào được chọn, trả về tất cả công việc
      }
      return this.tasks.filter((task) => task.status === this.selectedStatus);
    },
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const res = await api.get(`/user/group/${this.user.id}/tasks`);
        this.tasks = res.data.data; // Kiểm tra cấu trúc của response
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response?.data?.message || 'Có lỗi xảy ra'); // Kiểm tra nếu message tồn tại
      }
    },
    updateQuery() {
      if (this.selectedStatus) {
        this.$router.push({ query: { status: this.selectedStatus } });
      } else {
        this.$router.push({ query: null });
      }
    },
  },
};
</script>

<style scoped>
.task-list {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}

#status-filter {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
