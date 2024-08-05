<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        :configs="CategoryFormConfig"
        :params="{ applicationId: route.params.id }"
      ></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryFormConfig from "~~/configs/forms/CategoryFormConfig";
import NForm from "~~/components/base/NForm.vue";

const route = useRoute();
</script>
