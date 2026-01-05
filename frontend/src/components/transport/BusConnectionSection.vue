<script setup>
import { ref, onMounted } from "vue";
import BusConnectionCard from "@/components/transport/BusConnectionCard.vue";
import apiService from "@/services/apiService";
import config from "@/services/configManager.js";

const data = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        data.value = await apiService.getBusConnections(config.bus.routes);
    } catch (e) {
        console.error(e);
        error.value = "Failed to fetch bus connections";
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <BusConnectionCard
    v-for="route in config.bus.routes"
    :key="`${route.from}-${route.to}`"
    :from="route.from"
    :to="route.to"
    :data="data[`${route.from}->${route.to}`]"
    :loading="loading"
    :error="error"
  />
</template>