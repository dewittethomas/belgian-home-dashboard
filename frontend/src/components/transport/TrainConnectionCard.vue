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
    <div class="card-title nmbs">
      <p>
        <span>Trein naar</span>
        <span class="subject">{{ to }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading train connections...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Data -->
    <ul class="list" v-else>
      <li v-for="(trip, i) in data" :key="i">
        <p>
          {{ trip.departure }} - {{ trip.arrival }}
          <span 
            class="transport"
            :style="{ backgroundColor: '#666666' }">
            {{ trip.platform }}
          </span>
        </p>
      </li>
    </ul>
  </div>
</template>