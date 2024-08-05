<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";

import NInput from "~~/components/base/NInput.vue";
import NCheck from "~~/components/base/NCheck.vue";
import NSelect from "~~/components/base/NSelect.vue";
import NArea from "~~/components/base/NArea.vue";
import NRadios from "~~/components/base/NRadios.vue";
import NDatePicker from "~~/components/base/NDatePicker.vue";

import type { FormConfig } from "~~/types/index";

const props = defineProps({
  configs: {
    type: Object as PropType<FormConfig>,
    default: () => ({}),
  },
  isButtonBottom: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
  },
  id: {
    type: [String, Array<string>],
  },
  handleSave: {
    type: Boolean,
  },
});

const emits = defineEmits(["vchange", "data"]);

const { t } = useI18n();

const loading = ref<boolean>(false);

const rules = ref<any>({});
let data = ref<any>({});
const userInfo = ref<any>([
  {
    type: "text",
    label: "table.user.name",
    disabled: true,
  },
  {
    type: "text",
    label: "table.user.account",
    disabled: true,
  },
  {
    type: "text",
    label: "table.user.phone",
    disabled: true,
  },
  {
    type: "text",
    label: "table.user.email",
    disabled: true,
  },
]);

const v$: any = useVuelidate(rules, data, {
  $lazy: true,
  $autoDirty: true,
});

const changeValue = (item: any, field: any, value: any) => {
  item[field] = value;
  emits("vchange", { field, value });
};

const getDetail = () => {
  if (props.options) {
    const profile: any = props.options.profile;
    const user: any = props.options.permission.userInfo;
    data.value = profile;
    if ((data.value?.extend || []).length !== 0) {
      data.value.extend.map((e: any) => {
        e.dataId = profile.id;
        e.value = e.value == "null" ? "" : e.value;
      });
      data.value.extend = [...userInfo.value, ...data.value.extend];
    } else {
      data.value.extend = userInfo.value;
    }
    data.value.extend[0].value = user.name;
    data.value.extend[1].value = user.account;
    data.value.extend[2].value = user.phone;
    data.value.extend[3].value = user.email;
    emits("data", data.value);
  }
};

const onErrorMessage = (field: string) => {
  if (v$ && v$.value[field] && v$.value[field]?.$silentErrors.length) {
    return v$.value[field].$silentErrors[0].$message;
  } else return "";
};

const onSave = () => {
  loading.value = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    hideLoading();
    return;
  }

  Object.keys(data.value).map(
    (k) =>
      (data.value[k] =
        typeof data.value[k] == "string" ? data.value[k].trim() : data.value[k])
  );

  emits("data", data.value);
};

const hideLoading = () => {
  loading.value = false;
};

const handleOptionsField = (item: any) => {
  let options: any = JSON.parse(item.options);
  if (!item.options || Array.isArray(options)) {
    options = {
      value: "value",
      label: "label",
      notLoad: true,
      data: options ? options : [],
    };
  }
  return options;
};

defineExpose({
  hideLoading,
});

watch(
  () => props.handleSave,
  () => {
    onSave();
  }
);

watch(
  () => props.options,
  () => {
    getDetail();
  }
);
onMounted(() => {
  getDetail();
});
</script>

<template>
  <div class="card">
    <form class="form-layout" @submit.prevent>
      <div
        class="col-12"
        v-if="(data?.extend || []).length !== 0 && data.extend[0].label"
      >
        <div class="row g-5 py-6 px-2">
          <div
            v-for="(field, ind) in data.extend"
            :key="`field-${ind}`"
            class="col-6"
          >
            <div
              v-if="
                !field.type ||
                field.type == 'text' ||
                field.type == 'password' ||
                field.type == 'number' ||
                field.type == 'number-int'
              "
            >
              <NInput
                v-model="field.value"
                :type="field.type"
                :label="field.label"
                :max-length="field.maxLength"
                :placeholder="field.placeholder"
                :disabled="field.disabled"
                :readonly="field.readonly"
                :required="!!field?.rules?.required"
                @update:modelValue="changeValue(data, field.key, $event)"
              >
              </NInput>
              <div class="v-messages">
                <div class="help text-danger">
                  {{ onErrorMessage(field.key) }}
                </div>
              </div>
            </div>

            <div v-else-if="field.type == 'textarea'">
              <NArea
                v-model="field.value"
                :label="field.label"
                :placeholder="field.placeholder"
                :disabled="field.disabled"
                :required="!!field?.rules?.required"
                @update:modelValue="changeValue(data, field.key, $event)"
              >
              </NArea>
              <div class="v-messages">
                <div class="help text-danger">
                  {{ onErrorMessage(field.key) }}
                </div>
              </div>
            </div>

            <div v-else-if="field.type == 'select'">
              <NSelect
                v-model="field.value"
                :label="field.label"
                :options="handleOptionsField(field)"
                :data="data"
                :required="!!field?.rules?.required"
                @update:modelValue="changeValue(data, field.key, $event)"
              >
              </NSelect>
              <div class="v-messages">
                <div class="help text-danger">
                  {{ onErrorMessage(field.key) }}
                </div>
              </div>
            </div>

            <div v-else-if="field.type == 'checkbox' || field.type == 'switch'">
              <NCheck
                v-model="field.value"
                :label="field.label"
                :type="field.type"
                :true-value="field?.options?.trueValue"
                :false-value="field?.options?.falseValue"
                :disabled="field.disabled"
                :size="field.size"
                class="pt-14"
                @update:modelValue="changeValue(data, field.key, $event)"
              >
              </NCheck>
            </div>

            <div v-else-if="field.type == 'radios'">
              <NRadios
                v-model="field.value"
                :options="field.options"
                class="pt-14"
                @update:modelValue="changeValue(data, field.key, $event)"
              >
              </NRadios>
            </div>

            <div
              v-else-if="
                field.type == 'datetime' ||
                field.type == 'date' ||
                field.type == 'time'
              "
            >
              <NDatePicker
                v-model="field.value"
                :type="field.type"
                :options="field.options"
                :label="field.label"
                :required="!!field?.rules?.required"
              ></NDatePicker>

              <div class="v-messages">
                <div class="help text-danger">
                  {{ onErrorMessage(field.key) }}
                </div>
              </div>
            </div>

            <slot
              :name="field.key"
              :option="field"
              :data="data"
              :validate="v$"
              :errorMessage="onErrorMessage(field.key)"
            ></slot>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="sass">
.form-layout
  .extent-header
    border-radius: 0px !important
    // background: white
    border-bottom: 1px solid #F4F4F4
  .h-100
    height: 100%
  .form-head, .form-footer
    display: flex
    padding: 12px 20px

  .form-body
    padding: 20px 40px 40px

  .border-b
    border-bottom: 1px solid rgb(229, 229, 229)

  .border-t
    border-top: 1px solid rgb(229, 229, 229)

  .v-messages
    margin-top: 0.4rem
    text-align: left
    flex: 1 1 auto
    font-size: 12px
    min-height: 13px
    min-width: 1px
    position: relative
    .help
      font-size: 0.82rem !important
      line-height: 12px
      word-break: break-word
      padding-bottom: 1rem

  .stuck-header
    position: fixed
    top: 0
    right: 0
    left: 0
    z-index: 2
    background-color: white
    h3
      margin-left: 28rem
</style>
