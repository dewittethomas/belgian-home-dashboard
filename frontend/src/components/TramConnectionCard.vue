<template>
  <div class="card">
    <div class="card-title de-lijn">
      <p>
        <span>Tram naar</span>
        <span class="subject">{{ to }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading tram connections...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Data -->
    <ul class="list" v-else>
        <li v-for="(trip, i) in data" :key="i">
            <p>
              {{ trip.departure }} - {{ trip.arrival }}
              <span 
                class="transport"
                :style="{ backgroundColor: trip.transport.color }">
                {{ trip.transport.shortName }}
              </span>
            </p>
        </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiService from "@/services/apiService";

const props = defineProps({
  from: { type: String, required: true },
  to: { type: String, required: true }
});

const data = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchTramConnections = async () => {
  try {
    const response = await apiService.getTramConnections(props.from, props.to);
    data.value = response;
  } catch (err) {
    error.value = "Failed to fetch tram connections";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTramConnections);
</script>