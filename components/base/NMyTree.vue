<template>
  <NMyTreeItem
    :list="list"
    :checkedIds="checkedIds"
    @check-item="checkItem"
  ></NMyTreeItem>
</template>

<script lang="ts" setup >
const props = defineProps({
  originalData: {
    type: Array<any>,
    default: [],
  },
});

const checkedIds = ref<number[]>([]);

const list = useTree(props.originalData, {
  childs: "children",
});

const emits = defineEmits(["checkItem"]);

const handleIfParentChecked = (checkedValue: any) => {
  const parentId: number = checkedValue.id;

  const childrendId: number[] = checkedValue.children.map(
    (child: any) => child.id
  );

  const isParentIncluded = checkedIds.value.includes(parentId);

  const addParentAndChildrenIds = () => {
    checkedIds.value = [...checkedIds.value, parentId, ...childrendId];
  };

  const removeParentAndChildrenId = () => {
    checkedIds.value = checkedIds.value.filter(
      (i) => i !== parentId && !childrendId.includes(i)
    );
  };

  if (!isParentIncluded) {
    addParentAndChildrenIds();
  } else {
    removeParentAndChildrenId();
  }
};

const handleIfChildChecked = (checkedValue: any) => {
  const isChildIdIncluded = checkedIds.value.includes(checkedValue.id);

  const addChildId = () => {
    checkedIds.value = [...checkedIds.value, checkedValue.id];
  };

  const removeChildId = () => {
    checkedIds.value = checkedIds.value.filter((i) => i !== checkedValue.id);
  };

  if (!isChildIdIncluded) {
    addChildId();
  } else {
    removeChildId();
  }

  const parentId: number = checkedValue.parentId;
  const parentItem = list.find((i) => i.id === parentId);
  const childrenIds: number[] = parentItem.children.map(
    (child: any) => child.id
  );

  const isEveryChildChecked = childrenIds.every((id) =>
    checkedIds.value.includes(id)
  );

  const isEveryChildUnchecked = childrenIds.every(
    (id) => !checkedIds.value.includes(id)
  );

  const addParentId = () => {
    checkedIds.value = [...checkedIds.value, parentId];
  };

  const removeParentId = () =>
    (checkedIds.value = checkedIds.value.filter((id) => id !== parentId));

  if (isEveryChildChecked) {
    addParentId();
  } else {
    removeParentId();
  }

  isEveryChildUnchecked && removeParentId();
};

const generateNewTreeItems = () => {
  const allParentIds: number[] = props.originalData
    .filter((item) => item.parentId === null)
    .map((item) => item.id);

  const checkedChildrenIds = checkedIds.value.filter(
    (id) => !allParentIds.includes(id)
  );

  const checkedChildren = props.originalData.filter((item) =>
    checkedChildrenIds.includes(item.id)
  );

  const missingParentId = checkedChildren
    .filter((child) => !checkedIds.value.includes(child.parentId))
    .map((item) => item.parentId);

  const newTreeItemIds = [...missingParentId, ...checkedIds.value];

  const newTreeItems = props.originalData.filter((item) =>
    newTreeItemIds.includes(item.id)
  );

  return newTreeItems;
};

const generateRemainingTreeItem = (newTreeItems: any) => {
  const newItemIds: number[] = newTreeItems.map((item: any) => item.id);

  const remainingItems = props.originalData.filter(
    (item) => !newItemIds.includes(item.id)
  );

  const remainingIds: number[] = remainingItems.map((item) => item.id);

  const childrenItemsNeedParent = remainingItems.filter(
    (item) => !remainingIds.includes(item.parentId) && item.parentId !== null
  );

  const childrenIds: number[] = childrenItemsNeedParent.map(
    (child) => child.id
  );

  const untouchedItems = remainingItems.filter(
    (item) => !childrenIds.includes(item.id)
  );

  const parentId = new Set(
    childrenItemsNeedParent.map((child) => child.parentId)
  );

  const parentItems = props.originalData.filter((data) =>
    parentId.has(data.id)
  );

  const newRemainingItems = [
    ...parentItems,
    ...childrenItemsNeedParent,
    ...untouchedItems,
  ];

  return newRemainingItems;
};

const checkItem = (item: any) => {
  const checkedValue = item.target._value;

  if (checkedValue.parentId === null) {
    handleIfParentChecked(checkedValue);
  } else {
    handleIfChildChecked(checkedValue);
  }

  const newTreeItems = generateNewTreeItems();

  const remainingItems = generateRemainingTreeItem(newTreeItems);

  emits("checkItem", {
    treeItems: newTreeItems,
    remainingTreeItems: remainingItems,
  });
};
</script>

