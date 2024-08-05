<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="CountryFormConfig" :id="route.params.id"></NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountryFormConfig from "~~/configs/forms/CountryFormConfig";
import NForm from "~~/components/base/NForm.vue";

const route = useRoute();
</script>
