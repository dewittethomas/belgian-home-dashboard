<script setup>
import WeatherDataSection from "@/components/weather/WeatherDataSection.vue";
import WasteCollectionSection from "@/components/waste-collection/WasteCollectionSection.vue";
import BusConnectionSection from "@/components/transport/BusConnectionSection.vue";
import TrainConnectionSection from "@/components/transport/TrainConnectionSection.vue";
import TramConnectionSection from "@/components/transport/TramConnectionSection.vue";
</script>

<template>
  <div class="container">
    <div class="card-container">
        <WeatherDataSection />
        <WasteCollectionSection />
        <BusConnectionSection />
        <TrainConnectionSection />
        <TramConnectionSection />
    </div>
  </div>
  
</template>
