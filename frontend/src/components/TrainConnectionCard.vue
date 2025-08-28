<script setup>
defineProps({
  destination: { type: String, required: true },
  departures: { 
    type: Array, 
    default: () => [] 
  }
})
</script>

<template>
  <div class="card">
    <div class="card-title nmbs">
      <p>
        <span>Trein naar</span>
        <img src="@/assets/arrow-right.svg" alt="Arrow">
        <span class="subject">{{ destination }}</span>
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