<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="OrganizationFormConfig" :id="route.params.id"></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrganizationFormConfig from "~~/configs/forms/OrganizationFormConfig";
import NForm from "~~/components/base/NForm.vue";

const route = useRoute();
</script>
