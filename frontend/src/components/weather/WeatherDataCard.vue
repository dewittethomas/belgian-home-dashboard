<script setup>
defineProps({
  city: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});
</script>


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