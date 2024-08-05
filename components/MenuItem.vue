<script setup lang="ts">
import { toggleMenuItem } from "~~/composables/useMenu";
import MenuItemProps from "~~/props/MenuItemProps";
import NIcon from "~~/components/base/NIcon.vue";

const props = defineProps(MenuItemProps);
const route = useRoute();
const { locale } = useI18n();
const isRouteActive = ref<Boolean>(false)
const render = (item: any) => {
  return item.show;
};

const handlerRouteActive = () => {
  if (props.path) {
    const pathSegments = route.path.split('/');
    const pathUrl = `/${locale.value !== 'vi' ? pathSegments[2] : pathSegments[1]}`;
    isRouteActive.value = pathUrl === props.path;
  }
}
watch(
  () => route.path,
  () => {
    handlerRouteActive()
  }
);
onMounted(() => {
  handlerRouteActive()
  if (isRouteActive.value) {
    setTimeout(() => {
      (document.getElementsByClassName('menu-link active') as any)[0].parentNode?.parentNode?.parentNode.classList.toggle("show");
    });
  }
})
</script>

<template>
  <div class="menu-item menu-accordion">
    <span v-if="path == null || path == ''" class="menu-link" @click="toggleMenuItem($event, 'menu-item', [], name)">
      <span class="menu-icon">
        <span v-if="!isSub" class="svg-icon svg-icon-2">
          <NIcon :name="icon" :svg="svg"></NIcon>
        </span>
        <span class="menu-bullet" v-if="isSub">
          <span class="bullet bullet-dot"></span>
        </span>
      </span>
      <span class="menu-title">{{ $t(`side-bar.${name}`) }}</span>
      <span class="menu-arrow" v-if="childs.length > 0"></span>
    </span>
    <NuxtLink :to="childs.length > 0 ? '' : localePath(path)" v-if="path != null && path != ''" class="menu-link"
      :class="{ 'active': isRouteActive }" @click="toggleMenuItem($event, 'menu-sub', childs, name)">
      <span class="menu-icon">
        <span v-if="!isSub" class="svg-icon svg-icon-2">
          <NIcon :name="icon" :svg="svg"></NIcon>
        </span>
        <span class="menu-bullet" v-if="isSub">
          <span class="bullet bullet-dot"></span>
        </span>
      </span>
      <span class="menu-title">{{ $t(`side-bar.${name}`) }}</span>
      <span class="menu-arrow" v-if="childs.length > 0"></span>
    </NuxtLink>
    <template v-for="(item, ind) in childs" :key="ind">
      <MenuSub v-bind="item" v-show="render(item)" />
    </template>
  </div>
</template>

<style lang="sass">
@import '~~/assets/sass/_menu.sass'
</style>
