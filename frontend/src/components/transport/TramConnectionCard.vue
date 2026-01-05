<script setup>
const props = defineProps({
  from: String,
  to: String,
  data: Array,
  loading: Boolean,
  error: String
});
</script>

<template>
  <div class="card">
    <div class="card-title de-lijn">
      <p>
        <span>Tram naar</span>
        <span class="subject">{{ to }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading tram connections...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Data -->
    <ul class="list" v-else>
        <li v-for="(trip, i) in data" :key="i">
            <p>
              {{ trip.departure }} - {{ trip.arrival }}
              <span 
                class="transport"
                :style="{ backgroundColor: trip.transport.color }">
                {{ trip.transport.shortName }}
              </span>
            </p>
        </li>
    </ul>
  </div>
</template>