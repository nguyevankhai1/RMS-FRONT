<script setup lang="ts">
import { useListMenu } from "~~/composables/useMenu";
import { isClose, toggleMenuBar, init } from "~~/composables/useMenu";

const config = useRuntimeConfig();
const { permission } = usePermission();

const listMenu = useListMenu();
const isAdmin = ref<boolean>(useUserRole().role.value.includes("ROLE ADMIN"));

const checkPermissions = () => {
  if (permission.value) {
    const arr = transformArray(listMenu.value);
    arr.map((e: any) => {
      permission.value.map((k: any) => {
        if ("/api" + e.path === k) {
          e.show = true;
          if (
            !isAdmin.value &&
            ("/api" + e.path === "/api/user" || "/api" + e.path === "/api/extend")
          ) {
            e.show = false;
          }
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

onMounted(() => {
  checkPermissions();

  const glassBackground = document.getElementById("responsive-background")!;
  glassBackground.addEventListener("click", () => {
    toggleMenuBar(!isClose.value);
  });
});

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
  <div
    id="kt_aside"
    class="aside aside-default aside-hoverable"
    data-kt-drawer="true"
    data-kt-drawer-name="aside"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
    data-kt-drawer-direction="start"
    data-kt-drawer-toggle="#kt_aside_toggle"
  >
    <div class="aside-logo flex-column-auto px-10 pt-9 pb-5" id="kt_aside_logo">
      <NuxtLink :to="localePath('/')">
        <img
          alt="Logo"
          :src="`${config.app.cdnURL}/img/logo.png`"
          width="100"
          height="50"
          loading="lazy"
          class="max-h-50px logo-default theme-light-show"
        />
      </NuxtLink>
    </div>

    <div class="aside-menu flex-column-fluid px-4 px-lg-7">
      <div
        class="menu menu-sub-indention menu-column menu-rounded menu-title-gray-600 menu-icon-gray-400 menu-active-bg menu-state-primary menu-arrow-gray-500 fw-semibold fs-6 my-5 mt-lg-2 mb-lg-0"
        id="kt_aside_menu"
        data-kt-menu="true"
      >
        <div
          class="hover-scroll-y me-lg-n5 pe-lg-5"
          id="kt_aside_menu_wrapper"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-height="auto"
          data-kt-scroll-wrappers="#kt_aside_menu"
          data-kt-scroll-offset="20px"
          data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
          style="height: 798px"
        >
          <template v-for="(item, ind) in listMenu" :key="ind">
            <MenuItem v-bind="item" v-if="item.show" />
          </template>
        </div>
      </div>
    </div>
    <div class="aside-footer flex-column-auto pb-5 d-none" id="kt_aside_footer">
      <a href="/craft/index.html" class="btn btn-light-primary w-100"> Button </a>
    </div>
  </div>
  <div id="responsive-background" :style="{ display: !isClose ? 'none' : 'block' }"></div>
</template>
