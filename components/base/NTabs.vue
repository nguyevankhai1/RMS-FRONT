<template>
  <div class="base-tabs" :class="{ ['d-flex align-items-start']: vertical }">
    <div v-if="!vertical" id="tab-scroll">
      <div class="tablist d-flex">
        <div
          v-if="hasAction"
          class="v-slide-group__prev"
          :class="{ group__prev_disable: !scrollX }"
          @click="onPrev"
        >
          <NIcon name="material-symbols:chevron-left-rounded"></NIcon>
        </div>

        <div class="v-slide-group__container">
          <div
            class="v-slide-group__content"
            :style="`transform: translateX(${scrollX}px);`"
          >
            <template v-for="(tab, index) in tabs" :key="`tabs-${index}`">
              <div
                v-if="tab.shouldDisplay"
                class="tab p-2"
                :class="{
                  active: isActive(tab),
                  ['border-default']: isActive(tab),
                }"
                @click="changeTab(tab)"
              >
                <NIcon v-if="tab.icon" :name="tab.icon" size="18"></NIcon>
                <span class="fw-semibold ff-system-ui p-4" style="">
                  {{ $t(tab.label || "") }}
                </span>
              </div>
            </template>
          </div>
        </div>
        <div
          v-if="hasAction"
          class="v-slide-group__next"
          :class="{
            group__next_disable: scrollX <= withTotal - widthX,
          }"
          @click="onNext"
        >
          <NIcon name="material-symbols:chevron-right-rounded"></NIcon>
        </div>
      </div>
    </div>

    <div v-else class="tablist me-4">
      <template v-for="(tab, index) in tabs" :key="`tabs-${index}`">
        <div
          v-tooltip.right="tab.label"
          class="tab-vertical"
          :class="{ active: isActive(tab), ['border-vertical']: isActive(tab) }"
          @click="changeTab(tab)"
        >
          <div class="d-flex p-2">
            <NIcon
              v-if="tab.icon"
              :name="tab.icon"
              size="18"
              class="mb-1"
            ></NIcon>
            <div class="tab-label text-o-e ms-2">
              {{ tab.label }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane fade show active">
        <slot name="tab" :activeValue="activeValue"> </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NIcon from "~~/components/base/NIcon.vue";

type TabItem = {
  label?: string;
  value?: string;
  icon?: string;
  shouldDisplay?: boolean;
};

const props = defineProps({
  tabs: {
    type: Array as PropType<TabItem[]>,
    default: () => [],
  },
  selected: {
    type: String,
    default: undefined,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  arrowIcon: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update:selected"]);

const activeValue = ref(props.selected);

let scrollX = ref<number>(0);
const defaultX = ref<number>(200);
const widthX = ref<number>(0);
const withTotal = ref<number>(0);

const isActive = (tab: any) => {
  return activeValue.value === tab.value;
};

const changeTab = (tab: any) => {
  activeValue.value = tab.value;
  emits("update:selected", tab.value);
};

const onNext = () => {
  if (-(scrollX.value - defaultX.value) > widthX.value - withTotal.value) {
    scrollX.value = withTotal.value - widthX.value;
  } else {
    scrollX.value -= defaultX.value;
  }
};

const onPrev = () => {
  if (scrollX.value + defaultX.value > 0) scrollX.value = 0;
  else scrollX.value += defaultX.value;
};

const hasAction = computed(() => {
  if (!props.arrowIcon) return false;
  return withTotal.value <= widthX.value;
});

const init = () => {
  if (!props.vertical) {
    const el = document.getElementById("tab-scroll");
    if (el) {
      const array = el.getElementsByClassName("tab");
      for (let i = 0; i < array.length; i++) {
        const element = array[i] as HTMLElement;
        widthX.value += element?.offsetWidth;
      }
      const check = el.getElementsByClassName(
        "v-slide-group__container"
      )[0] as HTMLElement;
      withTotal.value = check?.offsetWidth;
    }
  }
};

onMounted(init);
</script>

<style lang="sass">
.base-tabs
  $primary: #409eff
  $secondary: #ccc
  $grey: #6c757d

  .ff-system-ui
    font-family: system-ui

  #tab-scroll
    overflow: hidden

  .v-slide-group__prev,
  .v-slide-group__next
    color: $grey
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer

  .tablist
    color: $secondary

    .v-slide-group__container
      contain: content
      display: flex
      flex: 1 1 auto
      overflow: hidden

      .v-slide-group__content
        display: flex
        flex: 1 0 auto
        position: relative
        white-space: nowrap
        transition: 0.2s all cubic-bezier(0.4, 0, 0.2, 1)

    .group__prev_disable,
    .group__next_disable
      pointer-events: none
      color: $secondary

    .tab
      border-bottom: 0.18rem solid $secondary

    .tab-vertical
      border-right: 0.18rem solid $secondary

      .tab-label
        color: $secondary

      .text-o-e
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width: 15rem

    .active
      svg,
      span,
      div
        color: $primary !important

    .border-vertical
      border-right: 0.18rem solid $primary

    .border-default
      border-bottom: 0.18rem solid $primary

    .tab:hover,
    .tab-vertical:hover
      svg,
      span,
      div
        color: $primary !important
        cursor: pointer

    .tab:hover
      border-bottom: 0.18rem solid $primary

    .tab-vertical:hover
      border-right: 0.18rem solid $primary
</style>
