<template>
  <span :class="`badge rounded-pill text-bg-${bgColor} mx-1`">
    {{ props.label }}
  </span>
</template>

<script lang="ts" setup>
type T =
  | "primary"
  | "warning"
  | "danger"
  | "success"
  | "secondary"
  | "light"
  | "info"
  | "dark";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String as PropType<T>,
    default: "primary",
  },
});
</script>
