<script lang="ts" setup>
import NBreadcrumbs from "~~/components/base/NBreadcrumbs.vue";

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});
</script>

<template>
  <div class="d-flex flex-column flex-root">
    <div class="page d-flex flex-row flex-column-fluid">
      <SideBar></SideBar>
      <div class="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
        <AppHeader />
        <div class="content fs-6 d-flex flex-column flex-column-fluid" id="kt_content">
          <div class="toolbar" id="kt_toolbar">
            <div class="container-fluid d-flex flex-stack flex-wrap flex-sm-nowrap">
              <ClientOnly>
                <NBreadcrumbs />
              </ClientOnly>
            </div>
          </div>
          <slot></slot>
        </div>
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@media (min-width: 992px)
  #kt_content
    min-height: calc(100vh - 90px - 60px + 10px)

@media (max-width: 991px)
  #kt_content
    min-height: calc(100vh - 90px - 60px + 30px)
</style>
