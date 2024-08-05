<template>
  <div role="tree">
    <ul role="group" class="position-relative p-0 m-0">
      <tree-item
        v-for="(child, index) in treeData"
        :key="index"
        @checkbox-emit="onCheckItem"
        :data="child"
        :selectedIds="selectedIds"
        :disabledIds="disabledIds"
        :checkBoxEmit="checkBoxEmit"
      ></tree-item>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { MyTreeData, MyInnerTreeData } from "~~/utils/typetree";
import Emit from "~~/utils/event";
import { getSortData } from "~~/utils/tool";

const props = defineProps<{
  data: MyTreeData[];
  defaultExpandAll?: boolean;
  disabledIds?: string[]
}>();

const emits = defineEmits(["treeData"]);

// formatted tree data
const treeData = ref<MyInnerTreeData[]>([]);
const selectedIds = ref<string[]>([]);

const generateTreeItemData = (item: MyTreeData, anchorID?: string) => {
  const itemData = {
    id: item.id,
    name: item.name || item.path || "no name, no path",
    opended: props.defaultExpandAll || item.opended || false,
    selected: item.selected || false,
    children: item.children ? formatItem(item.children, item.id) : undefined,
    applicationId: item.applicationId,
    code: item.code,
    description: item.description,
    parentId: item.parentId,
    priority: item.priority,
    status: item.status,
  };

  return anchorID ? { ...itemData, anchorID } : itemData;
};

// format tree child data
function formatItem(data: MyTreeData[], anchorID: string): MyInnerTreeData[] {
  const treeItems = data.map((item) => generateTreeItemData(item, anchorID));
  return getSortData(treeItems);
}

watch(
  () => useTree(props.data, { childs: "children" }),
  (data, oldData) => {
    if (data != undefined) {
      const treeItems = data.map((item) => generateTreeItemData(item));
      treeData.value = getSortData(treeItems);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const setSelectedIds = (arr: string[]) => {
  selectedIds.value = getUniqueItems(arr);
};

const recursiveParentIds = (item: MyTreeData, ids: string[] = []): string[] => {
  if (item.parentId === null) return ids;

  const parent = props.data.find((data) => data.id === item.parentId)!;
  return recursiveParentIds(parent, getUniqueItems([...ids, parent.id]));
};

const recursiveChildrenIds = (
  items: MyTreeData[],
  data: string[] = []
): string[] => {
  const truthy = items.every((item) => item.children!.length < 1);
  if (truthy) return data;

  const nestedChildren = items.reduce((prev: MyTreeData[], next) => {
    if (next.children!.length < 1) return prev;
    return [...prev, ...next.children!];
  }, []);

  const ids = [...items, ...nestedChildren].map((item) => item.id);
  return recursiveChildrenIds(
    nestedChildren,
    getUniqueItems([...ids, ...data])
  );
};

const ifInSelectedIds = (id: string) => selectedIds.value.includes(id);

const setSelectedItems = (
  idToCheck: string,
  ifIncluded: string[],
  ifNotIncluded: string[]
) => {
  if (ifInSelectedIds(idToCheck)) setSelectedIds(ifIncluded);
  else setSelectedIds(ifNotIncluded);
};

const setItems = (itemId: string) => {
  setSelectedItems(
    itemId,
    selectedIds.value.filter((id) => id !== itemId),
    [...selectedIds.value, itemId]
  );
};

const setChildren = (item: MyTreeData) => {
  const childrenIds = recursiveChildrenIds([item]);

  setSelectedItems(
    item.id,
    [...selectedIds.value, ...childrenIds],
    selectedIds.value.filter((id) => !childrenIds.includes(id))
  );
};

const onCheckItem = (checkedItem: MyTreeData) => {
  setItems(checkedItem.id);
  setChildren(checkedItem);

  recursiveParentIds(checkedItem).forEach((pId) => {
    const childrenIds: string[] = [];

    props.data.forEach(
      ({ parentId, id }) => parentId === pId && childrenIds.push(id)
    );

    const truthy = childrenIds.every((id) => ifInSelectedIds(id));
    if (truthy) setSelectedIds([...selectedIds.value, pId]);
    else setSelectedIds(selectedIds.value.filter((id) => id !== pId));
  });

  const newTreeItems = props.data.filter((data) => ifInSelectedIds(data.id));

  const parentsIds = getUniqueItems(
    newTreeItems.reduce((prev, next) => {
      return [...prev, ...recursiveParentIds(next)];
    }, [] as string[])
  );

  const parentsElement = props.data.filter((data) =>
    parentsIds.includes(data.id)
  );

  const remainingItems = props.data.filter((data) => !ifInSelectedIds(data.id));

  emits("treeData", {
    newTreeItems: [...newTreeItems, ...parentsElement],
    remainingItems,
  });
};

const checkBoxEmit = `checkbox-emit${Math.random()}`;
Emit.on(checkBoxEmit, onCheckItem);
</script>

<style lang="scss">
ul {
  padding: 0;
  margin: 0;

  li {
    list-style-type: none;
    text-align: left;
  }
}
</style>
