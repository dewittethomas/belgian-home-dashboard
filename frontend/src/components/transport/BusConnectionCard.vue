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
  <div class="card de-lijn">
    <div class="card-title">
        <p>
            <span>Bus naar</span>
            <span class="subject">{{ to }}</span>
        </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading bus connections...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Data -->
    <ul class="list" v-if="data">
      <li v-for="(trip, i) in data" :key="i">
        <p>
          {{ trip.departure }} - {{ trip.arrival }}
          <span 
            class="transport-identification"
            :style="{ backgroundColor: trip.transport.color }">
              {{ trip.transport.shortName }}
          </span>
        </p>
      </li>
    </ul>
  </div>
</template>