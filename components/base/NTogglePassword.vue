<script lang="ts" setup>
import NIcon from "~/components/base/NIcon.vue";

type InputType = "text" | "password" | "number" | "number-int" | "toggle-password";

const props = defineProps({
  type: {
    type: String as PropType<InputType>,
    default: "toggle-password",
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
// const typeInput = computed({
//   get: () => {
//     let output = props.type;
//     const num_type = "number";
//     if (output && output === num_type) {
//       output = num_type;
//     }
//     return output;
//   },
//   set: (value) => {},
// });

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

const { t } = useI18n();

const isPassword = ref<boolean>(true);

const copyApiKey = async (apiKey: string) => {
  try {
    await navigator.clipboard.writeText(apiKey);
    useNotify("success", t("successfullyCopiedApiKey")).show();
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const toggleShowKey = () => {
  isPassword.value = !isPassword.value;
};
</script>

<template>
  <div :class="layout">
    <label v-if="label" class="form-label" :class="{ bold: highlineLabel }">
      {{ $t(label) }}
      <span v-if="props.required" class="text-danger">(*)</span>
    </label>
    <div style="position: relative">
      <input
        :type="isPassword ? 'password' : 'text'"
        :value="props.modelValue"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :class="`form-control input-color form-control-${props.size}`"
        :placeholder="
          props.placeholder ? `${$t(props.placeholder || '')}` : `${$t(props.label || '')}`
        "
        v-bind="customAttribute"
        @keydown="onKeyDown"
        @blur="onBlur"
        @input="onInput($event)"
      />
      <span class="position-absolute top-0 action-icon toggleKey" @click="toggleShowKey">
        <NIcon
          :name="isPassword ? 'feather:eye' : 'mdi:eye-off-outline'"
          size="16"
          color="#008BD9"
        ></NIcon>
      </span>
      <span
        class="position-absolute top-0 action-icon copyKey"
        @click="() => copyApiKey(modelValue.toString())"
      >
        <NIcon name="ri:file-copy-line" size="16" color="#008BD9"></NIcon>
      </span>
    </div>
  </div>
</template>

<style lang="sass" scoped>
$margin: 0.225rem
$paddingOne: 0.55rem
$paddingTwo: 1rem
$paddingThree: 0.5rem

.bold
  font-weight: bold

input:focus, input:hover
  border-color: #00A3FF
  transition: .25s

.action-icon
  cursor: pointer
  border-radius: 0.475rem
  border: 1px solid transparent
  background-color: #f4f4f4
  margin-top: $margin
  margin-bottom: $margin

  &.toggleKey
    padding: $paddingOne $paddingTwo $paddingOne $paddingThree
    right: 0
    margin-right: $margin

  &.copyKey
    padding: $paddingOne $paddingThree $paddingOne $paddingTwo
    right: 2.975rem
</style>
