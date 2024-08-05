<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        :configs="ResourceFormConfig"
        :id="route.params.resourceId"
        :params="{ applicationId: route.params.id }"
      ></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResourceFormConfig from "~~/configs/forms/ResourceFormConfig";
import NForm from "~~/components/base/NForm.vue";

const route = useRoute();
</script>
