<template>
    <div class="event-container" v-if="event">
      <div class="event-header">
        <h1>{{ event.eventTitle }}</h1>
        <p class="event-tags">{{ event.eventTags }}</p>
        <p class="event-age-tag">{{ event.eventAgeTag }}</p>
      </div>
  
      <!-- Swiper carousel for event images -->
      <swiper
        v-if="event?.eventListImgURL && event.eventListImgURL.length"
        :space-between="10"
        :slides-per-view="'auto'"
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
        <div class="event-info">
          <p><strong>Description:</strong> {{ event.eventDescription }}</p>
          <p><strong>Start Date:</strong> {{ formattedStartDate }}</p>
          <p><strong>End Date:</strong> {{ formattedEndDate }}</p>
          <p><strong>Price:</strong> {{ event.eventPrice }} VND</p>
          <p><strong>Location:</strong> {{ event.eventAddress }}</p>
          <p><strong>Capacity:</strong> {{ event.eventCapacity }} people</p>
          <p><strong>Status:</strong> {{ event.eventStatus }}</p>
        </div>
      </div>
  
      <div class="event-artists">
        <h3>Artists:</h3>
        <ul>
          <li v-for="(artist, key) in event.eventListArtist" :key="key">
            {{ artist }}
          </li>
        </ul>
      </div>
  
      <div class="event-tickets">
        <h3>Ticket Availability:</h3>
        <div
          v-for="ticket in event.ticketCapacities"
          :key="ticket.capacityId"
          class="ticket"
        >
          <p>
            Day {{ ticket.day }} - Remaining Tickets:
            {{ ticket.remainingCapacity }}
          </p>
        </div>
      </div>
    </div>
  
    <div v-else>
      <p>Loading event data...</p>
    </div>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/swiper-bundle.css';
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
    background: #f4f4f4;
  }
  
  .event-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .event-tags,
  .event-age-tag {
    display: inline-block;
    background: #222;
    color: white;
    padding: 5px 10px;
    margin: 5px;
    font-size: 14px;
    border-radius: 5px;
  }
  
  .event-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .event-info {
    width: 60%;
  }
  
  .event-artists ul {
    list-style: none;
    padding: 0;
  }
  
  .event-tickets {
    margin-top: 20px;
  }
  
  .ticket {
    background: #ddd;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
  }
  
  .event-image-carousel {
    margin-bottom: 20px;
  }
  
  .event-image-slide img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  /* Custom navigation styles for Swiper */
  .swiper-button-prev,
  .swiper-button-next {
    color: #fff;
    font-size: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 50%;
  }
  
  .swiper-button-prev {
    left: 10px;
  }
  
  .swiper-button-next {
    right: 10px;
  }
  
  /* Hover effect */
  .swiper-button-prev:hover,
  .swiper-button-next:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  </style>
  