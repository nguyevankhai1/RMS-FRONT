<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="CommuneTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommuneTableConfig from "~~/configs/tables/CommuneTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>
