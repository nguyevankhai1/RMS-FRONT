<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="config" :params="{
        applicationId: route.params.id,
        parentId: route.params.parentId,
      }">
        <template #parent>
          <NInput v-model.trim="route.query.path" :disabled="true" label="table.header.parent-path"></NInput>
        </template>
      </NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResourceFormConfig from "~~/configs/forms/ResourceEditFormConfig";
import NForm from "~~/components/base/NForm.vue";
import NInput from "~~/components/base/NInput.vue";

const route = useRoute();
const config = ref<any>(deepCopy(ResourceFormConfig))
config.value.columns = [{
  layout: "6",
  fields: [
    { key: "parent", label: "table.header.parent-path", type: "custom" },
  ],
}, ...ResourceFormConfig.columns]
</script>
