<script lang="ts" setup>
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  label: {
    type: String,
    default: " ",
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  right: {
    type: Boolean,
    default: false,
  },
});

const format = computed({
  get: () => {
    let output = props.options?.format;

    if (!output) {
      if (props.type === "datetime") output = "DD/MM/YYYY HH:mm:ss";
      else if (props.type === "date") output = "DD/MM/YYYY HH:mm:ss";
      else if (props.type === "time") output = "HH:mm";
    }

    return output;
  },
  set: (value) => {},
});

const formatted = computed({
  get: () => {
    let output = props.options?.formatted;

    if (!output) {
      if (props.type === "datetime") output = "DD/MM/YYYY HH:mm";
      else if (props.type === "date") output = "DD/MM/YYYY";
      else if (props.type === "time") output = "HH:mm";
    }

    return output;
  },
  set: (value) => {},
});

const outputFormat = computed({
  get: () => {
    let output = props.options?.outputFormat;

    if (!output) {
      if (props.type === "datetime") output = "DD/MM/YYYY HH:mm:ss";
      else if (props.type === "date") output = "DD/MM/YYYY HH:mm:ss";
      else if (props.type === "time") output = "HH:mm";
    }

    return output;
  },
  set: (value) => {},
});
</script>

<template>
  <div class="base-date-time-picker">
    <label v-if="props.hasLabel" class="form-label">
      {{ $t(props.label) }}
      <span v-if="props.required" class="text-danger"> (*) </span>
    </label>
    <VueCtkDateTimePicker
      v-bind="$attrs"
      :label="$t(props.label)"
      :right="right"
      :only-date="props.type === 'date'"
      :only-time="props.type === 'time'"
      :format="format"
      :formatted="formatted"
      :output-format="outputFormat"
    />
  </div>
  <!-- format: định dạng giá trị đầu vào -->
  <!-- formatted: định dạng giá trị hiển thị trên input -->
  <!-- output-format: định dạng giá trị nhận được -->
</template>

<style lang="scss">
.base-date-time-picker {
  .time-picker[data-v-1c0f6a9f]:after,
  .time-picker[data-v-1c0f6a9f]:before {
    border-top: none !important;
    border-bottom: none !important;
  }

  .time-picker {
    .before,
    .after {
      height: 10px !important;
    }
  }

  .date-time-picker input {
    border: 1px solid #e1e3ea;
    height: 43.56px;
  }
}
</style>
