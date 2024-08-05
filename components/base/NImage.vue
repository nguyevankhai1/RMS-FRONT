<script lang="ts" setup>
const props = defineProps({
  src: {
    type: String as PropType<string>,
    default: "",
  },
});
</script>

<template>
  <img :src="src" />
</template>
