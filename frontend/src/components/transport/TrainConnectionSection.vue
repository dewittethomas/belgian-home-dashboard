<script setup>
import { ref, onMounted } from "vue";
import TrainConnectionCard from "@/components/transport/TrainConnectionCard.vue";
import apiService from "@/services/apiService";
import config from "@/services/configManager.js";

const data = ref({});
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    data.value = await apiService.getTrainConnections(config.train.routes);
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch train connections";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <TrainConnectionCard
    v-for="route in config.train.routes"
    :key="`${route.from}-${route.to}`"
    :from="route.from"
    :to="route.to"
    :data="data[`${route.from}->${route.to}`]"
    :loading="loading"
    :error="error"
  />
</template>
