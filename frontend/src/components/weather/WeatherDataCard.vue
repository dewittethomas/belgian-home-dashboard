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
<div class="card weather">
    <div class="card-title">
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
    <p class="temperature">{{ Math.round(data.temperature) }}°C</p>
    <p>Voelt als {{ Math.round(data.feelsLike) }}°C</p>
    <p class="weather-specific">
        <span>🌬️ {{ Math.round(data.windSpeed) }} km/h</span>
        <span>☀️ UV {{ Math.round(data.uvIndex) }}</span>
    </p>
    </div>
</div>
</template>