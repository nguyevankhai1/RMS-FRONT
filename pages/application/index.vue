<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="ApplicationTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApplicationTableConfig from "~~/configs/tables/ApplicationTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>
