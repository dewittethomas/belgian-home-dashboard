<script setup>
import { ref, onMounted } from "vue";
import WeatherDataCard from "@/components/weather/WeatherDataCard.vue";
import apiService from "@/services/apiService";
import config from "@/services/configManager.js";

const data = ref({});
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        data.value = await apiService.getWeatherData(config.weather);
    } catch (e) {
        console.error(e);
        error.value = "Failed to fetch weather";

    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <WeatherDataCard
        v-for="city in config.weather"
        :key="city"
        :city="city"
        :data="data[city]"
        :loading="loading"
        :error="error"
    />
</template>