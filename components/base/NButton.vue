<script lang="ts" setup>
import type { PropType } from "vue";

type TYPE = "button" | "submit" | "reset" | undefined;

type COLOR =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "link";

type SIZE = "sm" | "lg";

const props = defineProps({
  type: {
    type: String as PropType<TYPE>,
    default: "button",
  },
  color: {
    type: String as PropType<COLOR>,
    default: "primary",
  },
  outline: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<SIZE>,
    default: "", // default | sm | lg
  },
  prependIcon: {
    type: String,
  },
  appendIcon: {
    type: String,
  },
  sizeIcon: {
    type: String,
    default: "18",
  },
  colorIcon: {
    type: String,
    default: "black",
  },
  width: {
    type: String,
    default: "unset",
  },
  height: {
    type: String,
    default: "unset",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    :type="type"
    :class="`btn btn-${
      outline ? `outline-${color} btn-active-${color}` : color
    } btn-${size}`"
    :disabled="disabled"
    :style="`width: ${props.width}; height: ${props.height}`"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
    <Icon
      v-if="prependIcon"
      :name="prependIcon"
      :size="sizeIcon"
      :style="`color: ${props.colorIcon}`"
      class="mb-1"
    />
    <span class="mx-1">
      <slot></slot>
    </span>
    <Icon v-if="appendIcon" :name="appendIcon" :size="sizeIcon" class="mb-1" />
  </button>
</template>

<style lang="scss" scoped>
.btn {
  --bs-btn-border-radius: 4px !important;
}
</style>
