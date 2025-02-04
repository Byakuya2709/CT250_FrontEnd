<template>
  <div class="event-container" v-if="event">
    <div class="event-header">
      <h1 class="event-title">{{ event.eventTitle }}</h1>
      <p class="event-tags">{{ event.eventTags }}</p>
      <p class="event-age-tag">{{ event.eventAgeTag }}</p>
    </div>

    <div class="event-content">
      <swiper
        v-if="event?.eventListImgURL && event.eventListImgURL.length"
        :space-between="10"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000 }"
        class="event-image-carousel"
        navigation
      >
        <swiper-slide
          v-for="(image, index) in event.eventListImgURL"
          :key="index"
          class="event-image-slide"
        >
          <img :src="image" alt="Event Image" />
        </swiper-slide>
      </swiper>

      <div class="event-details">
        <h3>Event Details</h3>
        <!-- <p><strong>Description:</strong> {{ event.eventDescription }}</p> -->
        <p><strong>Start Date:</strong> {{ formattedStartDate }}</p>
        <p><strong>End Date:</strong> {{ formattedEndDate }}</p>
        <p><strong>Price:</strong> {{ event.eventPrice }} VND</p>
        <p><strong>Location:</strong> {{ event.eventAddress }}</p>
        <p><strong>Capacity:</strong> {{ event.eventCapacity }} people</p>
        <p><strong>Status:</strong> {{ event.eventStatus }}</p>
        <!-- <div class="event-artists">
          <h3>Performing Artists</h3>
          <ul>
            <li
              v-for="(artist, key) in event.eventListArtist"
              :key="key"
              class="artist-item"
            >
              {{ artist }}
            </li>
          </ul>
        </div> -->
      </div>
    </div>
    <div class="event-descriptions">
      <h3>Mô tả sự kiện</h3>
      <p><strong>Description:</strong> {{ event.eventDescription }}</p>
    </div>

    <div class="event-tickets">
      <h3>Book Your Tickets</h3>
      <div class="ticket-list">
        <div
          v-for="ticket in event.ticketCapacities"
          :key="ticket.capacityId"
          class="ticket-card"
        >
          <p>
            <strong>Day {{ ticket.day }}</strong>
          </p>
          <p>Remaining Tickets: {{ ticket.remainingCapacity }}</p>
          <button class="book-btn">Book Now</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Loading event data...</p>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { api } from "@/api/Api";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      eventId: this.$route.params.eventId,
      event: null,
    };
  },
  mounted() {
    this.fetchEventData();
  },
  methods: {
    async fetchEventData() {
      try {
        const response = await api.get(`/events/${this.eventId}`);
        this.event = response.data.data;
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    },
  },
  computed: {
    formattedStartDate() {
      return this.event?.eventStartDate
        ? new Date(this.event.eventStartDate).toLocaleString()
        : "";
    },
    formattedEndDate() {
      return this.event?.eventEndDate
        ? new Date(this.event.eventEndDate).toLocaleString()
        : "";
    },
  },
};
</script>
<style scoped>
.event-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.event-header {
  text-align: center;
  background: #d32f2f;
  color: white;
  padding: 15px;
  border-radius: 8px 8px 0 0;
}

.event-title {
  font-size: 24px;
  font-weight: bold;
}

.event-tags,
.event-age-tag {
  display: inline-block;
  background: #222;
  color: white;
  padding: 5px 15px;
  margin: 5px;
  font-size: 14px;
  border-radius: 5px;
}

.event-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.event-details {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.event-details h3 {
  margin-bottom: 10px;
  color: #d32f2f;
}

.event-info p {
  font-size: 16px;
  margin: 10px 0;
}

.event-artists {
  margin-top: 20px;
  text-align: center;
}

.event-artists h3 {
  color: #d32f2f;
}

.artist-item {
  display: inline-block;
  background: #eeeeee;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
}

.event-tickets {
  margin-top: 20px;
  text-align: center;
}

.ticket-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.ticket-card {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
}

.book-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background: #d32f2f;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.book-btn:hover {
  background: #b71c1c;
}

.event-image-carousel {
  flex: 1;
  border-radius: 8px;
}

.event-image-slide img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.swiper-button-prev,
.swiper-button-next {
  color: white;
  font-size: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 50%;
}

.swiper-button-prev {
  left: 10px;
}

.swiper-button-next {
  right: 10px;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background: rgba(0, 0, 0, 0.9);
}
</style>
