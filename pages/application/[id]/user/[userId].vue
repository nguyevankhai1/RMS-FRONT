<template>
  <!-- Phân quyền người dùng -->
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <UserAuthorization></UserAuthorization>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAuthorization from "~~/components/pages/UserAuthorization.vue";
</script>
