<template>
  <div class="container-xxl">
    <div class="card">
      <NTable
        :options="DistrictTableConfig"
        :params="{ isPermission: false }"
      ></NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DistrictTableConfig from "~~/configs/tables/DistrictTableConfig";
import NTable from "~~/components/base/NTable.vue";
</script>
