<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="SpecializesFormConfig"></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpecializesFormConfig from "~~/configs/forms/SpecializesFormConfig";
import NForm from "~~/components/base/NForm.vue";
</script>
