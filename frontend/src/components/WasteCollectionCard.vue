<template>
  <div class="card">
    <div class="card-title waste-collection">
      <p>
        <span>Afvalophaling in</span>
        <span class="subject">{{ street }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <p v-if="loading">Loading waste collections...</p>

    <!-- Error state -->
    <p v-if="error">{{ error }}</p>

    <!-- Data -->
    <ul class="list" v-if="data">
      <li v-for="(collection, i) in data" :key="i">
        <p>
          <span>{{ collection.date }}: {{ collection.type }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiService from "@/services/apiService";

const props = defineProps({
  street: { type: String, required: true },
  houseNumber: { type: String, required: true },
  zipCode: { type: String, required: true }
});

const data = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchWasteCollections = async () => {
  try {
    const response = await apiService.getWasteCollections(props.zipCode, props.street, props.houseNumber);
    data.value = response;
  } catch (err) {
    error.value = "Failed to fetch waste collections";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchWasteCollections);
</script>