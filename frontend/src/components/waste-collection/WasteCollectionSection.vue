<script setup>
import { ref, onMounted } from "vue";
import WasteCollectionCard from "@/components/waste-collection/WasteCollectionCard.vue";
import apiService from "@/services/apiService";
import config from "@/services/configManager.js";

const data = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        data.value = await apiService.getWasteCollections(
        config.wasteCollection.zipCode,
        config.wasteCollection.street,
        config.wasteCollection.houseNumber
    );
    } catch (e) {
        console.error(e);
        error.value = "Failed to fetch waste collections";
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <WasteCollectionCard
    :street="config.wasteCollection.street"
    :data="data"
    :loading="loading"
    :error="error"
  />
</template>