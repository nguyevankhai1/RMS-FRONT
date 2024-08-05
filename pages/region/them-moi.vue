<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="RegionFormConfig"></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegionFormConfig from "~~/configs/forms/RegionFormConfig";
import NForm from "~~/components/base/NForm.vue";
</script>
