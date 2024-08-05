<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="OrganizationTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrganizationTableConfig from "~~/configs/tables/OrganizationTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>

<style lang="sass" scoped></style>
