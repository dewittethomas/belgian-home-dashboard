<script setup>
defineProps({
  street: { type: String, required: true },
  data: { type: Array, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null }
});
</script>

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