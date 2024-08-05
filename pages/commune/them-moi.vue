<script lang="ts" setup>
import CommuneFormConfig from "~~/configs/forms/CommuneFormConfig";
import NForm from "~~/components/base/NForm.vue";
</script>

<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="CommuneFormConfig"></NForm>
    </div>
  </div>
</template>
