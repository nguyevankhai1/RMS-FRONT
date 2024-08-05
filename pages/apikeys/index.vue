<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="APIKeysTableConfig">
        <template #appName="{ entity }">
          {{ entity.application?.name || "" }}
        </template>
        <template #id="{ message }">
          <NTogglePassword :modelValue="message" disabled></NTogglePassword>
        </template>
        <template #createdAt="props">
          {{ formatDateTime(props.message) }}
        </template>
        <template #expiration="props">
          {{ formatDateTime(props.message) }}
        </template>
      </NTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import APIKeysTableConfig from "~~/configs/tables/APIKeysTableConfigs";
import NTable from "~~/components/base/NTable.vue";
import NTogglePassword from "~/components/base/NTogglePassword.vue";
import { format } from "date-fns";

const formatDateTime = (dateValue: Date) => {
  if (!dateValue) return "";
  return format(new Date(dateValue), "dd/MM/yyyy HH:mm:ss");
};
</script>
