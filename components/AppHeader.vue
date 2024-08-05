<script setup>
import { isClose, toggleMenuBar, init } from "~~/composables/useMenu";
import NInput from "~~/components/base/NInput.vue";
import NAvatar from "~~/components/base/NAvatar.vue";

//icons
import IconChat from "~~/components/icons/svg/IconChat";
import IconCategory from "~~/components/icons/svg/IconCategory";
import IconQuickLink from "~~/components/icons/svg/IconQuickLink";
import IconDrawer from "~~/components/icons/svg/IconDrawer";
import IconArrow from "~~/components/icons/svg/IconArrow";
import IconSearch from "~~/components/icons/svg/IconSearch";
import IconHamburger from "~~/components/icons/svg/IconHamburger";
import IconTwo from "~~/components/icons/svg/IconTwo";
import IconResponsiveSearch from "~~/components/icons/svg/IconResponsiveSearch";

init();

const { locale, locales } = useI18n();
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});
const onSignout = () => useAuth().logout();
const { user } = useMe();

const inputCustomAttribute = {
  "data-kt-search-elemen": "input",
  class: " ps-13",
  name: "search",
};
</script>

<template>
  <div
    id="kt_header"
    class="header"
    data-kt-sticky="true"
    data-kt-sticky-name="header"
    data-kt-sticky-offset="{default: '200px', lg: '300px'}"
    style="animation-duration: 0.3s"
  >
    <div
      class="container-fluid d-flex align-items-stretch justify-content-between"
    >
      <div
        class="d-flex align-items-center flex-grow-1 flex-lg-grow-0"
        @click="toggleMenuBar(!isClose)"
      >
        <div class="d-flex align-items-center d-lg-none">
          <div
            class="btn btn-icon btn-active-color-primary ms-n2 me-1"
            id="kt_aside_toggle"
          >
            <IconHamburger></IconHamburger>
          </div>
        </div>
        <div
          class="btn btn-icon w-auto ps-0 btn-active-color-primary d-lg-inline-flex me-2 me-lg-5 d-lg-inline"
          :class="{ active: isClose }"
          data-kt-toggle="true"
          data-kt-toggle-state="active"
          data-kt-toggle-target="body"
          data-kt-toggle-name="aside-minimize"
          style="display: none"
        >
          <IconArrow></IconArrow>
        </div>
      </div>

      <div
        class="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
      >
        <!--begin::Search-->
        <div class="d-flex align-items-stretch me-1">
          <!-- <div
            id="kt_header_search"
            class="header-search d-flex align-items-center w-100 w-lg-300px"
            data-kt-search-keypress="true"
            data-kt-search-min-length="2"
            data-kt-search-enter="enter"
            data-kt-search-layout="menu"
            data-kt-search-responsive="lg"
            data-kt-menu-trigger="auto"
            data-kt-menu-permanent="true"
            data-kt-menu-placement="bottom-start"
            data-kt-search="true"
          >
            <form
              data-kt-search-element="form"
              class="d-lg-block w-100 position-relative mb-5 mb-lg-0 d-none"
              autocomplete="off"
            >
              <input type="hidden" />
              <IconSearch></IconSearch>
              <NInput
                :class="'d-flex align-items-center'"
                :placeholder="$t('table.filter.search') + '...'"
                :custom-attribute="inputCustomAttribute"
              ></NInput>
              <span
                class="search-spinner position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-5"
                data-kt-search-element="spinner"
              >
                <span
                  class="spinner-border h-15px w-15px align-middle text-gray-400"
                ></span>
              </span>
              <span
                class="search-reset btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-4"
                data-kt-search-element="clear"
              >
                <IconTwo></IconTwo>
              </span>
            </form>
            <div
              data-kt-search-element="toggle"
              class="search-toggle-mobile d-flex d-lg-none align-items-center"
            >
              <div><IconResponsiveSearch></IconResponsiveSearch></div>
            </div>
          </div> -->
        </div>
        <!--end::Search-->

        <!--begin::Toolbar wrapper-->
        <div class="d-flex align-items-stretch flex-shrink-0">
          <!-- <div class="d-flex align-items-center ms-1 ms-lg-2"> -->
          <!-- <div -->
          <!-- class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" -->
          <!-- id="kt_activities_toggle" -->
          <!-- > -->
          <!--begin::Svg Icon | path: icons/duotune/general/gen032.svg-->
          <!-- <IconDrawer></IconDrawer> -->
          <!-- </div> -->
          <!-- </div> -->

          <!-- <div class="d-flex align-items-center ms-1 ms-lg-2"> -->
          <!-- <IconQuickLink></IconQuickLink> -->
          <!-- </div> -->

          <!-- <div class="d-flex align-items-center ms-1 ms-lg-2"> -->
          <!-- <div -->
          <!-- class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px position-relative" -->
          <!-- id="kt_drawer_chat_toggle" -->
          <!-- > -->
          <!--begin::Svg Icon | path: icons/duotune/communication/com012.svg-->
          <!-- <IconChat></IconChat> -->
          <!-- </div> -->
          <!-- </div> -->

          <!-- <div class="d-flex align-items-center ms-1 ms-lg-2"> -->
          <!-- <div -->
          <!-- class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" -->
          <!-- data-kt-menu-trigger="{default: 'click', lg: 'hover'}" -->
          <!-- data-kt-menu-attach="parent" -->
          <!-- data-kt-menu-placement="bottom-end" -->
          <!-- > -->
          <!--begin::Svg Icon | path: icons/duotune/general/gen025.svg-->
          <!-- <IconCategory></IconCategory> -->
          <!-- </div> -->
          <!-- </div> -->

          <!--begin::Theme mode-->
          <div class="d-flex align-items-center ms-1 ms-lg-2">
            <ModeSwitchThem></ModeSwitchThem>
          </div>
          <!--end::Theme mode-->

          <!------------------------------------------------------------------------------------------------------------------ -->
          <!--begin::Lang-->
          <div class="d-flex align-items-center ms-1 ms-lg-2">
            <!--begin::Menu wrapper-->
            <NuxtLink
              v-for="locale in availableLocales"
              :key="locale.code"
              :to="switchLocalePath(locale.code)"
            >
              <div
                class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
                data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
              >
                {{ locale.code }}
              </div>
            </NuxtLink>
          </div>
          <!--end::Lang-->

          <!--begin::User-->
          <div
            class="d-flex align-items-center ms-2 ms-lg-3"
            id="kt_header_user_menu_toggle"
          >
            <!--begin::Menu wrapper-->
            <div class="cursor-pointer symbol symbol-35px symbol-lg-35px">
              <NAvatar
                :src="user?.avatar"
                :rounded="true"
                :view="false"
              ></NAvatar>
            </div>

            <!--begin::User account menu-->
            <div
              id="kt_content_user_menu"
              class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
              data-kt-menu="true"
            >
              <!--begin::Menu item-->
              <div class="menu-item px-3">
                <div class="menu-content d-flex align-items-center px-3">
                  <!--begin::Avatar-->
                  <div class="symbol symbol-50px me-5"></div>
                  <!--end::Avatar-->

                  <!--begin::Username-->
                  <div class="d-flex flex-column">
                    <div class="fw-bold d-flex align-items-center fs-5">
                      {{ user?.name }}
                      <span
                        class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
                      >
                        {{ user?.account }}
                      </span>
                    </div>

                    <a
                      href="#"
                      class="fw-semibold text-muted text-hover-primary fs-7"
                    >
                      {{ user?.email }}
                    </a>
                  </div>
                  <!--end::Username-->
                </div>
              </div>
              <!--end::Menu item-->

              <div class="separator my-2"></div>
              <!--begin::Menu item-->
              <div class="menu-item px-5 my-1">
                <NuxtLink to="/profile" class="menu-link px-5">
                  {{ $t("table.user.accountSettings") }}
                </NuxtLink>
              </div>
              <!--begin::Menu item-->
              <div class="menu-item px-5 my-1">
                <NuxtLink to="/auth/change/password" class="menu-link px-5">{{
                  $t("password.change")
                }}</NuxtLink>
              </div>
              <!--begin::Menu item-->
              <div class="menu-item px-5" @click="onSignout">
                <a href="#" class="menu-link px-5"> {{ $t("sign-out") }} </a>
              </div>
            </div>
            <!--end::User account menu-->
            <!--end::Menu wrapper-->
          </div>
          <!--end::User -->
        </div>
        <!--end::Toolbar wrapper-->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#kt_header_user_menu_toggle:hover {
  #kt_content_user_menu {
    position: fixed;
    z-index: 107;
    margin: 0;
    inset: 0px 0px auto auto;
    transform: translate(-70px, 90px);
    display: flex;
    will-change: transform;
    animation: menu-sub-dropdown-animation-fade-in 0.3s ease 1,
      menu-sub-dropdown-animation-move-up 0.3s ease 1;
  }
}
</style>
