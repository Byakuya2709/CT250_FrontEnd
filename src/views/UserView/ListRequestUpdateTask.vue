<template>
    <div>
      <h2>Danh Sách Yêu Cầu Cập Nhật Tác Vụ</h2>
      <div v-if="loading">Đang tải dữ liệu...</div>
      <table v-else class="table">
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
          <tr v-for="item in updates" :key="item.id">
            <td @click="toTaskInfo(item.task.id)">
              <a class="task-title">{{ item.task.title }}</a>
            </td>
            <td>{{ translateStatus(item.task.status) }}</td>
            <td>{{ formatDate(item.requestedDate) }}</td>
            <td :class="getRequestedStatusClass(item.requestedStatus, item.task.status)">
              {{ translateStatus(item.requestedStatus) }}
            </td>
            <td>{{ item.description || "Không có mô tả" }}</td>
            <td :class="getStatusClass(item.status)">
              {{ translateStatus(item.status) }}
            </td>
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
          const response = await api.get(
            `/user/task/update-request/${this.userId}/all`
          );
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
        switch (status) {
          case "PENDING":
            return "Đang chờ";
          case "IN_PROGRESS":
            return "Đang tiến hành";
          case "COMPLETED":
            return "Đã hoàn thành";
          case "CANCELED":
            return "Hủy";
          case "APPROVED":
            return "Đã chấp thuận";
          case "REJECTED":
            return "Đã từ chối";
          default:
            return status;
        }
      },
      getStatusClass(status) {
        switch (status) {
          case "PENDING":
            return "status-pending";
          case "IN_PROGRESS":
            return "status-in-progress";
          case "COMPLETED":
            return "status-completed";
          case "CANCELED":
            return "status-canceled";
          default:
            return "";
        }
      },
      getRequestedStatusClass(requestedStatus, taskStatus) {
        let statusClass = '';
        switch (requestedStatus) {
          case "PENDING":
            statusClass = "requested-status-pending";
            break;
          case "APPROVED":
            statusClass = "requested-status-approved";
            break;
          case "REJECTED":
            statusClass = "requested-status-rejected";
            break;
          default:
            statusClass = '';
        }
        return taskStatus !== requestedStatus ? statusClass + ' status-different' : statusClass;
      },
    },
  };
  </script>
  
  <style scoped>
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-family: Arial, sans-serif; /* Added font for better readability */
  }
  
  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 12px; /* Increased padding for better spacing */
    text-align: left;
  }
  
  .table th {
    background-color: #f2f2f2; /* Light gray for headers */
    color: #333; /* Darker text for better contrast */
    font-weight: bold; /* Bold text for headers */
  }
  
  .table tr:nth-child(even) {
    background-color: #f9f9f9; /* Light gray background for even rows */
  }
  
  .table tr:hover {
    background-color: #e0f7fa; /* Light cyan on row hover */
    cursor: pointer; /* Indicate that the row is clickable */
  }
  
  .table td {
    transition: background-color 0.3s; /* Smooth transition for hover effect */
  }
  
  /* Styles for task title link */
  .task-title {
    color: #007bff; /* Bootstrap primary color for links */
    text-decoration: none; /* Remove underline from link */
    transition: color 0.3s, transform 0.3s; /* Smooth transition for color and scale */
  }
  
  .task-title:hover {
    color: #0056b3; /* Darker blue on hover */
    transform: scale(1.05); /* Slightly enlarge the text on hover */
  }
  
  .task-title:active {
    color: #003f7f; /* Even darker blue on click */
    transform: scale(0.98); /* Slightly shrink the text on click */
  }
  
  /* Status color coding */
  .status-completed {
    background-color: #d4edda; /* Light green for completed tasks */
    color: #155724; /* Dark green text */
  }
  
  .status-pending {
    background-color: #fff3cd; /* Light yellow for pending tasks */
    color: #856404; /* Dark yellow text */
  }
  
  .status-in-progress {
    background-color: #cce5ff; /* Light blue for in-progress tasks */
    color: #004085; /* Dark blue text */
  }
  
  .requested-status-approved {
    background-color: #d4edda; /* Light green for approved requests */
    color: #155724; /* Dark green text */
  }
  
  .requested-status-rejected {
    background-color: #f8d7da; /* Light red for rejected requests */
    color: #721c24; /* Dark red text */
  }
  
  .requested-status-pending {
    background-color: #e2e3e5; /* Light gray for pending requests */
    color: #6c757d; /* Gray text */
  }
  
  /* Different status highlight */
  .status-different {
    font-weight: bold; /* Bold text for different status */
    text-decoration: underline; /* Underline for emphasis */
  }
  </style>
  