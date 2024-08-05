<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="CountryTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountryTableConfig from "~~/configs/tables/CountryTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>

<style lang="sass" scoped></style>
