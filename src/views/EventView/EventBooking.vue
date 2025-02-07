<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Đặt vé sự kiện</h2>
      <p><strong>Sự kiện:</strong> {{ event.eventTitle }}</p>
      <p><strong>Ngày:</strong> {{ ticket ? ticket.day : "Đang tải..." }}</p>
      <p>
        <strong>Số ghế trống:</strong>
        {{ ticket ? ticket.remainingCapacity : "Đang tải..." }}
      </p>

      <div v-if="ticket" class="seat-container">
        <h3>Chọn ghế</h3>
        <div class="seat-grid">
          <button
            v-for="seat in event.eventCapacity"
            :key="seat"
            :class="{
              seat: true,
              selected: selectedSeats.includes(seat),
              paid: bookedSeats[seat] === 'PAID',
              unpaid: bookedSeats[seat] === 'UNPAID',
            }"
            :disabled="bookedSeats[seat] === 'PAID'"
            @click="toggleSeat(seat)"
          >
            {{ seat }}
          </button>
        </div>
      </div>

      <button @click="bookTicket" :disabled="selectedSeats.length === 0">
        Xác nhận đặt {{ selectedSeats.length }} ghế
      </button>
      <button class="close-btn" @click="$emit('close')">Đóng</button>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/Api";
export default {
  props: {
    event: Object,
    ticket: Object,
  },
  data() {
    return {
      selectedSeats: [],
      bookedSeats: {}, // Key-value lưu trạng thái ghế đã đặt
    };
  },
  async mounted() {
    await this.fetchBookedSeats();
  },
  methods: {
    toggleSeat(seat) {
      if (this.selectedSeats.includes(seat)) {
        this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
      } else {
        this.selectedSeats.push(seat);
      }
    },
    async fetchBookedSeats() {
      try {
        const response = await api.get(`/events/tickets/${this.event.eventId}`);
        this.bookedSeats = response.data.data.reduce((acc, ticket) => {
          acc[ticket.ticketPosition] = ticket.ticketStatus;
          return acc;
        }, {});
      } catch (error) {
        console.error("Lỗi lấy dữ liệu vé:", error);
      }
    },
    bookTicket() {
      if (this.selectedSeats.length > 0) {
        alert(
          `Bạn đã đặt vé thành công! Ghế: ${this.selectedSeats.join(", ")}`
        );
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90vw;
  height: 90vh;
  text-align: center;
}

button {
  margin: 10px;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.close-btn {
  background-color: gray;
  color: white;
}

.seat-container {
  margin-top: 15px;
}

.seat-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  justify-content: center;
  padding: 10px;
  gap: 0;
}

.seat {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  background-color: lightgray;
  cursor: pointer;
  border: none;
  padding: 0;
}

.seat.selected {
  background-color: green;
  color: white;
}

.seat.paid {
  background-color: red;
  cursor: not-allowed;
  opacity: 0.7;
}

.seat.unpaid {
  background-color: blue;
  color: white;
}
</style>
