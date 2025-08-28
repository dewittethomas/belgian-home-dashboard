<template>
  <div class="card">
    <div class="card-title">
      <p>
        <span>Weer in</span>
        <span class="destination">{{ city }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading weather...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Weather data -->
    <div v-if="data">
      <p>Temperature: {{ data.temperature }}°C</p>
      <p>Condition: {{ data.condition }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiService from "@/services/apiService"; // adjust path

// Props
const props = defineProps({
  city: { type: String, required: true }
});

// Reactive state
const data = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch weather data for this city
const fetchWeather = async () => {
  try {
    console.log("yes")
    const response = await apiService.getWeatherData(props.city); // adapt depending on your API
    data.value = response;
  } catch (err) {
    error.value = "Failed to fetch weather";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchWeather);
</script>
