<!-- for more details, please visit https://vue3datepicker.com/installation/ -->
<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import { vi, enUS } from "date-fns/locale";
import { format } from "date-fns";

import "@vuepic/vue-datepicker/dist/main.css";

interface Props {
  type: "datetime" | "date" | "time"; // format options
  options?: any;
  label?: string;
  hasLabel?: boolean;
  required?: boolean; // used to display asterisk symbol
}

const { enabled } = useTheme();
const { locale } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  type: "datetime",
  options: {},
  label: "",
  hasLabel: true,
  required: false,
});

const showTimePicker = ["datetime", "time"].includes(props.type);

const customFormat = (date: Date) => {
  let outputView = props.options?.view;

  if (!outputView) {
    if (props.type === "datetime") outputView = "dd/MM/yyyy HH:mm:ss";
    else if (props.type === "date") outputView = "dd/MM/yyyy";
    else if (props.type === "time") outputView = "HH:mm";
  }

  return format(date, outputView);
};
</script>

<template>
  <label v-if="hasLabel" class="form-label">
    {{ $t(label) }}
    <span v-if="required" class="text-danger"> (*) </span>
  </label>
  <VueDatePicker
    six-weeks
    hide-offset-dates
    no-today
    auto-apply
    :enable-time-picker="showTimePicker"
    :time-picker="type === 'time'"
    :format="customFormat"
    :dark="Boolean(enabled)"
    :required="required"
    :format-locale="locale === 'vi' ? vi : enUS"
    :action-row="{ showPreview: false }"
    :max-date="props?.options?.max"
    :min-date="props?.options?.min"
    v-bind="$attrs"
    input-class-name="dp-custom-input"
    menu-class-name="dp-custom-menu"
  />
</template>

<style lang="sass">
.dp-custom-input
  border: 1px solid #e1e3ea
  height: 43.56px
  font-size: 1.1rem

  &:hover
    border-color: #00A3FF
    transition: .25s

  &::focus
    border-color: #00A3FF
    transition: .25s
</style>
