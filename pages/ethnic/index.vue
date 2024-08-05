<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="EthnicityTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import EthnicityTableConfig from "~~/configs/tables/EthnicityTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>

<style lang="sass" scoped></style>
