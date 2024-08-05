<template>
  <ul
    v-for="li in list"
    :key="li.name"
    class="mb-0"
  >
    <li v-if="li.children.length > 0">
      <label class="cursor-pointer px-3">
        <input
          class="cursor-pointer"
          type="checkbox"
          :value="li"
          @change="checkItem"
          :checked="checkedIds.includes(li.id)"
        >
        {{li.name}}
      </label>
      <NMyTreeItem
        :list="li.children"
        :checkedIds="checkedIds"
        @check-item="checkItem"
      ></NMyTreeItem>
    </li>
    <li v-else>
      <label class="cursor-pointer px-3">
        <input
          class="cursor-pointer"
          type="checkbox"
          :value="li"
          @change="checkItem"
          :checked="checkedIds.includes(li.id)"
        >
        {{li.name}}
      </label>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps({
  list: {
    type: Array<any>,
    default: [],
  },
  checkedIds: {
    type: Array<number>,
    default: [],
  },
});

const emits = defineEmits(["check-item"]);

const checkItem = (item: any) => {
  emits("check-item", item);
};
</script>

<style>
li {
  list-style-type: none;
}

label:hover {
  background-color: rgb(0, 163, 255);
  color: white;
}
</style>