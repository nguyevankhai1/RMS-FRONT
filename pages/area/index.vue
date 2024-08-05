<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="AreaTableConfig"></NTable>
    </div>
  </div>

  <!-- <NMapTiler></NMapTiler> -->
</template>

<script setup lang="ts">
import AreaTableConfig from "~~/configs/tables/AreaTableConfig";
import NTable from "~~/components/base/NTable.vue";

//test map component
import NMapTiler from "~/components/base/NMapTiler.vue";
</script>
