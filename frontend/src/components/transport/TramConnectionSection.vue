<script setup>
import { ref, onMounted } from "vue";
import TramConnectionCard from "@/components/transport/TramConnectionCard.vue";
import apiService from "@/services/apiService";
import config from "@/services/configManager.js";

const data = ref({});
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
    data.value = await apiService.getTramConnections(config.tram.routes);
    } catch (e) {
    console.error(e);
    error.value = "Failed to fetch tram connections";
    } finally {
    loading.value = false;
    }
});
</script>

<template>
  <TramConnectionCard
    v-for="route in config.tram.routes"
    :key="`${route.from}-${route.to}`"
    :from="route.from"
    :to="route.to"
    :data="data[`${route.from}->${route.to}`]"
    :loading="loading"
    :error="error"
  />
</template>