<template>
  <tr v-for="r in 10">
    <td v-for="t in parseInt(colspan.toString()) - 1">
      <span class="d-inline-block"></span>
    </td>
  </tr>
</template>

<script lang="ts" setup>
const props = defineProps({
  colspan: {
    type: [String, Number],
    default: 0,
  },
});
</script>

<style scoped lang="sass">
span
  background: linear-gradient(to right, #eee 20%, #ddd 50%, #eee 80%)
  width: 50%
  height: 5.5px
  animation: moving-gradient .75s infinite linear forwards
  background-size: 500px 100px
  border-radius: 4px

@keyframes moving-gradient
  0%
    background-position: -250px 0
  100%
    background-position: 250px 0
</style>
