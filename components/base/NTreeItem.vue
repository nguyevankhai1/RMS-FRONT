<template>
  <li class="item" :class="{ 'tree-node': isLine }">
    <div class="title" :class="isOpen ? 'bold' : ''">
      <NIcon
        v-if="isFolder"
        :name="
          isOpen
            ? 'material-symbols:arrow-drop-down-rounded'
            : 'material-symbols:arrow-right-rounded'
        "
        size="22"
        @click="toggle"
      ></NIcon>
      <NCheck
        class="m-0"
        :isInLine="false"
        size="small"
        @change="checkItem"
      ></NCheck>
      <!-- Start icon template -->
      <NIcon
        v-if="!item.icon"
        :name="isOpen ? 'mdi:folder-eye-outline' : 'mdi:folder-table-outline'"
        size="22"
      ></NIcon>
      <NIcon v-if="item.icon" :name="item.icon" size="22"></NIcon>
      <!-- End icon template -->
      <span @dblclick="doubleClick" class="title-name">{{ item.name }}</span>
    </div>
    <Transition name="append">
      <ul
        class="child-item"
        :class="{ 'tree-node-child': isLine }"
        v-show="isOpen"
        v-if="isFolder"
      >
        <NTreeItem
          v-for="(child, index) in item.children"
          :key="index"
          :item="child"
          :is-line="isLine"
          @db-click="$emit('db-click', $event)"
          @add-item="$emit('add-item', $event)"
          @check-item="$emit('check-item', child)"
        ></NTreeItem>
      </ul>
    </Transition>
  </li>
</template>

<script lang="ts" setup>
import NIcon from "~~/components/base/NIcon.vue";
import NCheck from "~~/components/base/NCheck.vue";

const props = defineProps({
  item: {
    type: [Object],
    default: () => ({}),
  },
  isLine: {
    type: Boolean,
    default: false,
  },
});

let isOpen = ref<any>(false);

let isFolder: any = computed(() => {
  return props.item.children && props.item.children.length;
});

const toggle = () => {
  if (isFolder.value) {
    isOpen.value = !isOpen.value;
  }
};

const doubleClick = () => {
  emits("db-click", props.item);
};

const checkItem = () => {
  emits("check-item", props.item);
};

const emits = defineEmits(["db-click", "check-item", "add-item"]);
</script>

<style lang="sass" scoped>
@import '~~/assets/sass/_tree.sass'
</style>
