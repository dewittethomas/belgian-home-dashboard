<template>
  <div class="card">
    <div class="card-title weather">
      <p>
        <span>Weer in</span>
        <span class="subject">{{ city }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading weather...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Data -->
    <div v-if="data" class="weather-data">
      <p class="temperature">{{ data.temperature }}°C</p>
      <p>Voelt als {{ data.feelsLike }}°C</p>
      <p class="weather-specific">
        <span>🌬️ {{ data.windSpeed }} km/h</span>
        <span>☀️ UV {{ data.uvIndex }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiService from "@/services/apiService";

const props = defineProps({
  city: { type: String, required: true }
});

const data = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchWeather = async () => {
  try {
    const response = await apiService.getWeatherData(props.city);
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