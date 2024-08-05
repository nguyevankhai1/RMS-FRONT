<script lang="ts" setup>
import ApplicationFormConfig from "~~/configs/forms/ApplicationFormConfig";
import NForm from "~~/components/base/NForm.vue";
</script>

<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="ApplicationFormConfig"></NForm>
    </div>
  </div>
</template>
