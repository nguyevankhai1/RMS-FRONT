<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="SpecializesTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpecializesTableConfig from "~~/configs/tables/SpecializesTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>

<style lang="sass" scoped></style>
