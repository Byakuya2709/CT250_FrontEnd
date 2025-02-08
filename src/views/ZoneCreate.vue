<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Quản Lý Khu Vực Sự Kiện</h2>

    <!-- Sơ đồ chọn khu vực -->
    <div class="d-flex justify-content-center">
      <svg width="350" height="250" class="border rounded shadow">
        <rect
          v-for="(zone, index) in zones"
          :key="index"
          :x="zone.x"
          :y="zone.y"
          :width="zone.width"
          :height="zone.height"
          :fill="selectedZone === zone.name ? 'red' : zone.color"
          stroke="black"
          stroke-width="2"
          @click="selectZone(zone.name)"
          class="cursor-pointer"
        />
        <text
          v-for="(zone, index) in zones"
          :key="'text-' + index"
          :x="zone.textX"
          :y="zone.textY"
          text-anchor="middle"
          fill="white"
          font-weight="bold"
        >
          {{ zone.name }}
        </text>
      </svg>
    </div>

    <!-- Form nhập dữ liệu từng zone -->
    <div class="row mt-4">
      <div
        class="col-md-4"
        v-for="(zone, index) in zones"
        :key="'form-' + index"
      >
        <div
          :class="[
            'card p-3 shadow',
            { 'border-danger': selectedZone === zone.name },
          ]"
        >
          <h4 class="text-center">{{ zone.name }} Zone</h4>
          <div class="mb-2">
            <label class="form-label">Giá vé:</label>
            <input
              type="number"
              class="form-control"
              v-model="zone.rate"
              required
            />
          </div>
          <div class="mb-2">
            <label class="form-label">Số vé tối đa:</label>
            <input
              type="number"
              class="form-control"
              v-model="zone.capacity"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-success w-100 mt-4" @click="submitZones">
      Gửi Dữ Liệu
    </button>
  </div>
</template>

<script>
import { api } from "@/api/Api";
export default {
  data() {
    return {
      loading: false,
      event:{},
      selectedZone: null, // Zone đang được chọn
      zones: [
        {
          name: "VIP",
          x: 50,
          y: 20,
          width: 250,
          height: 50,
          color: "gold",
          textX: 175,
          textY: 50,
          rate: "",
          capacity: "",
        },
        {
          name: "STANDARD",
          x: 30,
          y: 90,
          width: 290,
          height: 50,
          color: "blue",
          textX: 175,
          textY: 120,
          rate: "",
          capacity: "",
        },
        {
          name: "ECONOMY",
          x: 10,
          y: 160,
          width: 330,
          height: 50,
          color: "green",
          textX: 175,
          textY: 190,
          rate: "",
          capacity: "",
        },
      ],
    };
  },
  async mounted() {
    await this.fetchEvent();
  },
  methods: {
    async fetchEvent() {
      this.loading = true;
      try {
        const response = await api.get(`/events/${this.eventId}`);
        this.event = response.data.data;
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        this.loading = false;
      }
    },
    selectZone(zoneName) {
      this.selectedZone = zoneName;
    },
    submitZones() {
      const payload = this.zones.map((zone) => ({
        zoneName: zone.name,
        zoneRate: zone.rate,
        zoneCapacity: zone.capacity,
      }));

      console.log("Gửi dữ liệu lên API:", payload);
      alert("Dữ liệu Zone đã gửi thành công!");
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.card {
  transition: all 0.3s ease-in-out;
}
.card:hover {
  transform: scale(1.05);
}
</style>
