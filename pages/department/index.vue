<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="DepartmentTableConfig"></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DepartmentTableConfig from "~~/configs/tables/DepartmentTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>

<style lang="sass" scoped></style>
