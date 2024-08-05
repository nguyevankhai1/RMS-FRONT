<template>
  <NButton color="secondary" prepend-icon="mdi:arrow-left-thin" @click="goBack">
    {{ $t("goBack") }}
  </NButton>
</template>

<script setup lang="ts">
import NButton from "./NButton.vue";

const { goBack } = useHistory();
</script>
