<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="DistrictFormConfig"></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import DistrictFormConfig from "~~/configs/forms/DistrictFormConfig";
import NForm from "~~/components/base/NForm.vue";
</script>
