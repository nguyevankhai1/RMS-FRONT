<script lang="ts" setup>
import { useListMenu } from "~~/composables/useMenu";

const router = useRouter();
const { permission } = usePermission();
const listMenu = useListMenu();

const checkPermissions = () => {
  if (permission.value) {
    const arr = transformArray(listMenu.value);
    arr.map((e: any) => {
      permission.value.map((k: any) => {
        if ("/api" + e.path === k) {
          e.show = true;
        }
      });
    });
    listMenu.value = mergeArrays(listMenu.value, arr);
  }
};

const mergeArrays = (array1: any[], array2: any[]) => {
  const mergedArray = [...array1];

  for (let i = 0; i < mergedArray.length; i++) {
    const obj1 = mergedArray[i];
    const obj2 = array2.find((obj) => obj.id === obj1.id);

    if (obj2 && obj2.hasOwnProperty("show")) {
      obj1.show = obj2.show;
    }
    if (obj1.hasOwnProperty("childs")) {
      obj1.childs = mergeArrays(obj1.childs, array2);
      obj1.show = obj1.childs.filter((e: any) => e.show).length !== 0;
    }
  }

  return mergedArray;
};

const transformArray = (arr: any) => {
  let transformedArray: any = [];
  arr.forEach((item: any) => {
    const { id, label, name, path, icon, parentId } = item;
    transformedArray.push({ id, label, name, path, icon, parentId });
    if (item.childs && item.childs.length > 0) {
      const childArray = transformArray(item.childs);
      transformedArray.push(...childArray);
    }
  });
  return transformedArray;
};

checkPermissions();
if ((listMenu.value || []).length !== 0) {
  const menu = listMenu.value.find((item: any) => item.show);
  if (menu) {
    router.push(menu.path || "");
  }
}

watch(
  () => permission.value,
  () => {
    setTimeout(() => {
      checkPermissions();
    }, 100);
  }
);
</script>
<template>
  <div class="text-center text-uppercase fw-bold fs-1">{{ $t("welcome") }}</div>
</template>
