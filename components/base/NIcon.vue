<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "24px",
  },
  class: {
    type: String,
    default: "icon",
  },
  svg: {
    type: String,
  },
});
</script>

<template>
  <template v-if="name !== '' && name !== null">
    <Icon v-bind="props" :style="`color: ${props.color}`" />
  </template>
  <template v-else>
    <span ref="spanSvg" v-html="svg"></span>
  </template>
</template>
