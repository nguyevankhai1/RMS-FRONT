<template>
  <div
    class="v-base-checkbox form-check"
    :class="{
      'form-check-inline': props.isInLine,
      'form-switch': props.type == 'switch',
    }"
  >
    <input
      :id="`check-${id}`"
      type="checkbox"
      class="form-check-input"
      :class="{ [`${props.size}`]: props.size }"
      :checked="checked"
      :disabled="props.disabled"
      @change="onChange"
    />
    <label
      :class="props.disabled ? 'form-check-label' : ''"
      :for="`check-${id}`"
      v-if="props.label"
    >
      {{ $t(props.label) }}
    </label>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: "", // type: switch | rỗng = check box
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isInLine: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
  },
});

const emits = defineEmits(["update:modelValue"]);

const id = ref<string>(Math.random().toString());

const checked: any = computed(() => {
  return props.modelValue == props.trueValue;
});

const onChange = (e: any) => {
  let value = e?.target?.checked;
  if (value) value = props.trueValue;
  else value = props.falseValue;
  emits("update:modelValue", value);
};
</script>

<style lang="sass">
.v-base-checkbox
  .small
    height: 1.25rem
    width: 1.25rem
    border-radius: 0.2rem
    margin-top: 2px

  .large
    height: 2rem
    width: 2rem
</style>
