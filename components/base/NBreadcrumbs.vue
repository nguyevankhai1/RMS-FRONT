<script setup lang="ts">
import MenuSidebarConfig from "~~/configs/layout/MenuSidebarConfig";

const listMenu = ref<any[]>(MenuSidebarConfig);
const route = useRoute();
const { t, locale } = useI18n();
let scums = ref<any>([]);
const title = ref("RMS");

const getParents = (childItem: any, menu: any = []) => {
  const p = menu.find((item: any) => item.id == childItem.parentId);
  if (p) {
    scums.value.unshift(p);
    getParents(p, menu);
  }
};
function getScums() {
  scums.value = [];
  let item = transformArray(listMenu.value).find((item: any) => {
    if (route.path.replaceAll("/" + locale.value, "")) {
      return item.path == route.path.replaceAll("/" + locale.value, "");
    } else {
      return item.path == route.path.replaceAll(locale.value, "");
    }
  });
  if (item) {
    const titleTop =
      locale.value === "vi"
        ? t(`side-bar.${route.path.replace("/", "")}`)
        : t(`side-bar.${route.path.replace("/" + locale.value + "/", "")}`);
    title.value = titleTop;
  }
  if (!item) return;
  scums.value.unshift(item);
  getParents(item, transformArray(listMenu.value));
}

function transformArray(arr: any) {
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
}

watch(listMenu, () => {
  getScums();
});

watch(
  () => route.path,
  () => {
    getScums();
  }
);

onMounted(() => {
  getScums();
});

useHead({
  title: title,
});
</script>

<template>
  <div class="d-flex flex-column align-items-start justify-content-center flex-wrap me-2">
    <ul class="breadcrumb fw-semibold my-1">
      <li
        v-for="(item, ind) in scums"
        :key="ind"
        class="breadcrumb-item h5"
        :class="{
          'text-muted': ind != scums.length - 1,
          'text-dark': ind == scums.length - 1,
        }"
      >
        <NuxtLink
          :to="localePath(item.path)"
          v-if="ind != scums.length - 1"
          class="text-hover-primary text-muted"
        >
          {{ $t(`side-bar.${item.name}`) }}
        </NuxtLink>
        {{ ind == scums.length - 1 ? $t(`side-bar.${item.name}`) : "" }}
      </li>
    </ul>
  </div>
</template>
