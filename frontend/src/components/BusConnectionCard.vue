<template>
  <div class="card">
    <div class="card-title de-lijn">
      <p>
        <span>Bus naar</span>
        <span class="subject">{{ to }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading bus connections...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Data -->
    <ul class="list" v-if="data">
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

const fetchBusConnections = async () => {
  try {
    const response = await apiService.getBusConnections(props.from, props.to);
    data.value = response;
  } catch (err) {
    error.value = "Failed to fetch bus connections";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBusConnections);
</script>