<template>
  <div class="card-container">
    <TrainCard 
      destination="Brussel"
      :departures="[
        { time: '15u54', platform: 'Spoor 4' },
        { time: '16u54', platform: 'Spoor 5' }
      ]"
      line-class="nmbs"
    />
    <TrainCard 
      destination="Brugge"
      :departures="[
        { time: '15u54' },
        { time: '16u54' }
      ]"
    />
  </div>
</template>

<script setup>
import TrainCard from './components/TrainConnectionCard.vue';
</script>
