<template>
  <li
    class="tree-node d-block"
    v-if="!data.delete"
    :class="{
      'is-opend': data?.opended,
      'is-close': !data?.opended,
    }"
    role="treeitem"
  >
    <NIcon
      :name="Boolean(data?.opended) ? 'ic:baseline-minus' : 'ic:baseline-add'"
      size="14"
      color="#0d6efd"
      :class="isFolder ? 'tree-anchor' : ''"
      :style="{
        height: data.children && data.children.length > 0 ? '24px' : '0',
        marginRight: '6px',
        marginLeft: '6px',
      }"
      role="presentation"
      @click.stop="() => onNodeCLick(data)"
    ></NIcon>
    <div
      class="tree-anchor"
      :class="{
        'tree-selected': data?.selected,
      }"
    >
      <input
        type="checkbox"
        @change="onCheckItem"
        :value="data"
        :checked="selectedIds.includes(data.id)"
      />
      <span v-if="!data.rename" class="tree-node__text"
        >{{ data.name }}
        <NIcon
          v-if="disabledIds?.includes(data.id)"
          name="ion:checkmark-sharp"
          size="15px"
          color="#00a3ff"
          style="margin-bottom: 5px;"
        ></NIcon>
      </span>
    </div>

    <ul
      role="group"
      ref="group"
      class="tree-node__children"
      v-if="data.selected && isFolder"
    >
      <tree-item
        v-for="(child, index) in data?.children"
        :key="index"
        @iconClick="data.opended = !data.opended"
        :data="child"
        :selectedIds="selectedIds"
        :disabledIds="disabledIds"
        :checkBoxEmit="checkBoxEmit"
      >
      </tree-item>
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { MyInnerTreeData } from "~~/utils/typetree";
import Emit from "~~/utils/event";
import NIcon from "~~/components/base/NIcon.vue";

const props = defineProps<{
  data: MyInnerTreeData;
  selectedIds: string[];
  checkBoxEmit: string;
  disabledIds?: string[]
}>();

const isFolder = computed(() => {
  return props.data.children;
});

const onNodeCLick = (treeNode: MyInnerTreeData) => {
  treeNode.opended = !treeNode.opended;
  treeNode.selected = !treeNode.selected;
};

const onCheckItem = (event: any) => {
  Emit.emit(props.checkBoxEmit, event.target!._value);
};
</script>

<style scoped lang="scss">
.tree-node {
  cursor: pointer;

  &.is-close {
    & > .tree-node__children {
      display: none;
    }
  }

  &.is-opend {
    & > .tree-node__icon {
      background-position: 188px -5px;
    }
  }

  &__background {
    width: 100%;
    height: 24px;
    background: #eee;
    position: absolute;
    left: 0;
    z-index: -1;
  }

  &__text {
    display: inline-block;
    height: 100%;
  }

  &__input {
    border: 1px solid #dbcfcf;
    font-size: 16px;

    &:focus {
      outline: none;
    }
  }

  &__children {
    margin-left: 16px;
  }
}

.tree-anchor {
  background-position: 220px -6px;
  display: inline-block;
}

.tree-anchor:hover {
  background-color: #e3f2fd;
}

input[type="checkbox"] {
  cursor: pointer;
  margin-right: 6px;
  position: relative;
  top: 2px;
}

li {
  line-height: 24px;
  display: block;
}

.tree-node__text {
  word-break: break-all;
}
</style>
