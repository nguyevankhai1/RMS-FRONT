<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        :configs="UserFormConfig"
        :params="{ applicationId: route.params.id }"
      ></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserFormConfig from "~~/configs/forms/UserFormConfig";
import NForm from "~~/components/base/NForm.vue";

const route = useRoute();
</script>
