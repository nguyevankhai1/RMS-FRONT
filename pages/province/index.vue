<script lang="ts" setup>
import ProvinceTableConfig from "~~/configs/tables/ProvinceTableConfig";
import NTable from "~~/components/base/NTable.vue";

definePageMeta({ title: "Tỉnh/Thành phố" });
</script>

<template>
  <div class="container-xxl">
    <div class="card">
      <NTable
        :options="ProvinceTableConfig"
        :params="{ isPermission: false }"
      ></NTable>
    </div>
  </div>
</template>
