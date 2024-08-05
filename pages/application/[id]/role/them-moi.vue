<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        :configs="RoleFormConfig"
        :params="{ applicationId: route.params.id }"
      ></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoleFormConfig from "~~/configs/forms/RoleFormConfig";
import NForm from "~~/components/base/NForm.vue";

const route = useRoute();
</script>
