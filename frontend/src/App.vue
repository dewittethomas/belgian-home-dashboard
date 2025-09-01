<script setup>
import WeatherDataCard from "@/components/WeatherDataCard.vue";
import BusConnectionCard from "@/components/BusConnectionCard.vue";
import TrainConnectionCard from "@/components/TrainConnectionCard.vue";
import TramConnectionCard from "@/components/TramConnectionCard.vue";
import WasteCollectionCard from "./components/WasteCollectionCard.vue";
import config from "@/services/configManager.js";
</script>

<template>
  <div class="card-container">
    <!-- Weather -->
    <WeatherDataCard
      v-for="(city, index) in config.weather"
      :key="'weather-' + index"
      :city="city"
    />

    <!-- Waste collection -->
    <WasteCollectionCard
      :street="config.wasteCollection.street"
      :houseNumber="config.wasteCollection.houseNumber"
      :zipCode="config.wasteCollection.zipCode"
    />

    <!-- Bus -->
    <BusConnectionCard
      v-for="(route, index) in config.bus.routes"
      :key="'bus-' + index"
      :from="route.from"
      :to="route.to"
    />

    <!-- Train -->
    <TrainConnectionCard
      v-for="(route, index) in config.train.routes"
      :key="'train-' + index"
      :from="route.from"
      :to="route.to"
    />

    <!-- Tram -->
    <TramConnectionCard
      v-for="(route, index) in config.tram.routes"
      :key="'tram-' + index"
      :from="route.from"
      :to="route.to"
    />
  </div>
</template>
