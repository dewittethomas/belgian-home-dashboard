<script setup>
defineProps({
  destination: { type: String, required: true },
  departures: { 
    type: Array, 
    default: () => [] 
  },
  lineClass: { type: String, default: '' } // e.g., 'nmbs', 'de-lijn'
})
</script>

<template>
  <div class="card">
    <!-- Optional colored line for the card -->
    <div v-if="lineClass" class="card-title" :class="lineClass">
      <p>
        <span>Trein naar</span>
        <img src="./images/arrow-right.svg" alt="Arrow">
        <span class="destination">{{ destination }}</span>
      </p>
    </div>
    
    <ul class="departures">
      <li v-for="(dep, index) in departures" :key="index">
        <span>{{ dep.time }}</span>
        <span v-if="dep.platform">{{ dep.platform }}</span>
      </li>
    </ul>
  </div>
</template>