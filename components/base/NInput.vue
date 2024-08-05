<script lang="ts" setup>
type InputType = "text" | "password" | "number" | "number-int";

const props = defineProps({
  type: {
    type: String as PropType<InputType>,
    default: "text",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String as PropType<string>,
    default: "",
  },
  placeholder: {
    type: String as PropType<string>,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: Boolean,
    default: "",
  },
  maxLength: {
    type: Number,
  },
  highlineLabel: {
    type: Boolean,
    default: false,
    required: false,
  },
  customAttribute: {
    type: Object as PropType<{ [key: string]: string }>,
    default: {},
    required: false,
  },
  size: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const typeInput = computed({
  get: () => {
    let output = props.type;
    const num_type = "number";
    if (output && output === num_type) {
      output = num_type;
    }
    return output;
  },
  set: (value) => {},
});

const maxLength = computed({
  get: () => {
    let output = 0;

    if (!props.maxLength) {
      output = props.type.includes("number") ? 5 : 5000;
    } else {
      output = props.maxLength;
    }

    return output - 1;
  },
  set: (value) => {},
});

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (props.type.includes("number") && (e.key === "e" || e.key === "-")) {
    e.preventDefault();
    return false;
  }

  if (
    props.type === "number-int" &&
    e.key !== "Backspace" &&
    e.key !== "Tab" &&
    (e.key === "." || !Number.isInteger(parseInt(e.key)))
  ) {
    e.preventDefault();
    return false;
  }

  if (
    e.key !== "Backspace" &&
    !e.ctrlKey &&
    (e.target as HTMLInputElement).value.length > maxLength.value
  ) {
    e.preventDefault();
    return false;
  }
};

const onBlur = (e: Event) => {
  const output = (e.target as HTMLInputElement).value;
  if (output) {
    emit("update:modelValue", output.slice(0, maxLength.value));
  }
};
</script>

<template>
  <div :class="layout">
    <label v-if="label" class="form-label" :class="{ bold: highlineLabel }">
      {{ $t(label) }}
      <span v-if="props.required" class="text-danger">(*)</span>
    </label>
    <input
      :type="typeInput"
      :value="props.modelValue"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :class="`form-control input-color form-control-${props.size}`"
      :placeholder="
        props.placeholder
          ? `${$t(props.placeholder || '')}`
          : `${$t(props.label || '')}`
      "
      v-bind="customAttribute"
      @keydown="onKeyDown"
      @blur="onBlur"
      @input="onInput($event)"
    />
  </div>
</template>
<style lang="sass" scoped>
.bold
  font-weight: bold

input:focus, input:hover
  border-color: #00A3FF
  transition: .25s
</style>
