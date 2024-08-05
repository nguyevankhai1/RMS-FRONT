<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: "",
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String as PropType<string>,
    required: true,
  },
  placeholder: {
    type: String as PropType<string>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String as PropType<string>,
    default: "",
  },
  resizeable: {
    type: String as PropType<"none" | "both">,
    default: "both",
  },
});

const emit = defineEmits(["update:modelValue"]);

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
</script>

<template>
  <div :class="layout">
    <label v-if="props.hasLabel" class="form-label">
      {{ $t(props.label) }}
      <span v-if="props.required" class="text-danger">(*)</span>
    </label>
    <textarea
      :value="props.modelValue"
      :disabled="props.disabled"
      class="form-control input-color"
      :placeholder="props.placeholder ? '' : `${$t(props.label)}`"
      @input="onInput($event)"
      rows="3"
      :style="{ resize: resizeable }"
    ></textarea>
  </div>
</template>

<style lang="sass" scoped>
textarea:focus, textarea:active
  border-color: #00A3FF
  transition: .25s
</style>
