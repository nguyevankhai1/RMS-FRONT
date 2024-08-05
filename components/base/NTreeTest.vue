<template>
  <li>
    <div :class="{ bold: isFolder }" @click="toggle" @dblclick="makeFolder">
      {{ item.name }}
      <span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <NTree
        class="item"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)"
      ></NTree>
      <li class="add" @click="$emit('add-item', item)">+</li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: {
    type: [Object],
    default: () => ({}),
  }
});

let isOpen = ref<any>(false);

let isFolder: any = computed({
  get: () => {
    return props.item.children && props.item.children.length;
  },
  set: (value) => {},
});

const toggle = () => {
  if (isFolder.value) {
    isOpen.value = !isOpen.value
  }
}

const makeFolder = () => {
  console.log('db click!!!')
}

const emits = defineEmits(["update:modelValue"]);


</script>
<style lang="scss" scoped>
.item {
  cursor: pointer;
  user-select: none;
}
.bold {
  font-weight: bold;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>
