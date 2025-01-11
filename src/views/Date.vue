<template>
    <div>
      <label for="eventStart">Event Start:</label>
      <input 
        type="datetime-local" 
        id="eventStart" 
        v-model="eventStart" 
        @change="handleDateChange"
      />
      
      <label for="eventEnd">Event End:</label>
      <input 
        type="datetime-local" 
        id="eventEnd" 
        v-model="eventEnd" 
        @change="handleDateChange"
      />
  
      <p>Event Start: {{ eventStart }}</p>
      <p>Event End: {{ eventEnd }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        eventStart: '2025-06-01T18:00',  // Đặt giá trị mặc định
        eventEnd: '2025-06-01T23:00',    // Đặt giá trị mặc định
      };
    },
    methods: {
      handleDateChange() {
        console.log('Event Start:', this.eventStart);
        console.log('Event End:', this.eventEnd);
      }
    }
  };
  </script>
  
  <style scoped>
  label {
    margin-right: 10px;
  }
  input {
    margin-bottom: 10px;
  }
  </style>
  