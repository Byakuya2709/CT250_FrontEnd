<template>
  <div class="upload-container">
    <h1>Upload Image to Cloudinary</h1>

    <!-- Form Upload -->
    <form @submit.prevent="uploadImage">
      <div>
        <label for="file">Select Image:</label>
        <input
          type="file"
          id="file"
          @change="onFileChange"
          accept="image/*"
          required
        />
      </div>
      <div>
        <label for="folder">Folder (optional):</label>
        <input
          type="text"
          id="folder"
          v-model="folder"
          placeholder="Enter folder name"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Uploading..." : "Upload Image" }}
      </button>
    </form>

    <!-- Display Result -->
    <div v-if="imageUrl" class="result">
      <h2>Image Uploaded Successfully!</h2>
      <img :src="imageUrl" alt="Uploaded Image" />
      <p>
        <strong>Image URL:</strong>
        <a :href="imageUrl" target="_blank">{{ imageUrl }}</a>
      </p>
    </div>

    <!-- Display Error -->
    <div v-if="error" class="error">
      <h2>Error:</h2>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { api } from "../api/Api";

export default {
  name: "ImageUpload",
  data() {
    return {
      file: null, // Store the selected file
      imageUrl: "", // Store the uploaded image URL
      error: null, // Store the error message (if any)
      loading: false, // Loading state for uploading
      folder: "", // Folder name for the image (optional)
    };
  },
  methods: {
    // Handle when a user selects a file
    onFileChange(event) {
      this.file = event.target.files[0];

      // Check file size (optional, e.g., max size 5MB)
      if (this.file && this.file.size > 5 * 1024 * 1024) {
        this.error = "File size exceeds 5MB.";
        this.file = null; // Clear the selected file
      } else {
        this.error = null;
      }
    },

    // Handle the upload process
    async uploadImage() {
      if (!this.file) {
        this.error = "Please select an image file to upload.";
        return;
      }

      this.error = null;
      this.loading = true;

      try {
        // Create FormData to send the file and folder data
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("folder", this.folder);

        // Send POST request to the API
        const response = await api.post("/media/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Get the uploaded image URL from the response
        this.imageUrl = response.data.imageUrl;
      } catch (error) {
        // Handle error
        this.error =
          error.response?.data?.message || "An error occurred while uploading.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.upload-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.upload-container h1 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input[type="file"] {
  border: none;
}

button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  text-align: center;
}

.result img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
  margin: 10px 0;
}

.error {
  margin-top: 20px;
  color: red;
  text-align: center;
}
</style>
