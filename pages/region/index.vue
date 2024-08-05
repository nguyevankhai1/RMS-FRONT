<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="RegionTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegionTableConfig from "~~/configs/tables/RegionTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>

<style lang="sass" scoped></style>
