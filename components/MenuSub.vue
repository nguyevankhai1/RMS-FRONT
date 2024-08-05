<script setup lang="ts">
import { toggleMenuItem } from "~~/composables/useMenu";
import MenuItemProps from "~~/props/MenuItemProps";
const props = defineProps(MenuItemProps);
</script>
<template>
  <div class="menu-sub menu-sub-accordion" kt-hidden-height="334">
    <MenuItem v-bind="props" :is-sub="true"> </MenuItem>
  </div>
</template>
<style lang="sass">
@import '~~/assets/sass/_menu.sass'
</style>
