<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";

import NInput from "~~/components/base/NInput.vue";
import NButton from "~~/components/base/NButton.vue";
import NCheck from "~~/components/base/NCheck.vue";
import NSelect from "~~/components/base/NSelect.vue";
import NSelectObj from "~~/components/base/NSelectObj.vue";
import NArea from "~~/components/base/NArea.vue";
import NRadios from "~~/components/base/NRadios.vue";
import NGoBackButton from "./NGoBackButton.vue";
import NDatePicker from "~~/components/base/NDatePicker.vue";

import type { FormConfig } from "~~/types/index";
import API_PATH from "~/enums/API_PATH";

const LazyNEditor = defineAsyncComponent(() => import("./NEditor.vue"));

const props = defineProps({
  configs: {
    type: Object as PropType<FormConfig>,
    default: () => ({}),
  },
  updateValue: {
    // update data in NForm
    type: Object,
    default: () => ({}),
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Array<string>],
  },
  hasFooter: {
    type: Boolean,
    default: false,
  },
  customSave: {
    type: Function,
  },
});

const service = useService(props.configs.api as API_PATH);

const emits = defineEmits(["vchange", "data"]);

const { t } = useI18n();

// hard-coded configs
const unableEditCode = ["ROLE_DEFAULT"];

const route = useRoute();
const isInThemMoiPage = route.fullPath.includes("them-moi");
const loading = ref<boolean>(false);
const isStuck = ref<boolean>(false);

const rules = ref<any>({});
let data = ref<any>({});

props.configs.columns.forEach(function (item: any, i: number) {
  item.fields.forEach(function (field: any, j: number) {
    if (field.rules) {
      const arr = Object.keys(field.rules);
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        field.rules[element] = helpers.withMessage(t(`${element}-message`), field.rules[element]);
      }
      rules.value[field.key] = field.rules;
      data.value[field.key] = "";
    }

    if (field.defaultValue) {
      data.value[field.key] = field.defaultValue;
    }
  });
});

if (props.id) {
  service.finById(props.id as string).then((response) => {
    const res: any = response.value;
    data.value = res.data;
    if (data.value?.extend) {
      data.value.extend.map((e: any) => {
        e.dataId = props.id;
        e.value = e.value == "null" ? "" : e.value;
      });
    }
    emits("data", data.value);
  });
} else {
  data.value = { ...data.value, ...props.updateValue };
}

const v$: any = useVuelidate(rules, data, {
  $lazy: true,
  $autoDirty: true,
});

const changeValue = (item: any, field: any, value: any) => {
  item[field] = value;
  emits("vchange", { field, value });
};

const onErrorMessage = (field: string) => {
  if (v$ && v$.value[field] && v$.value[field]?.$silentErrors.length) {
    const silentErrors = v$.value[field].$silentErrors[0];
    if (silentErrors.$params.hasOwnProperty("max")) {
      return `${silentErrors.$message} ${silentErrors.$params?.max}`;
    }

    return silentErrors.$message;
  } else return "";
};

const onSave = () => {
  loading.value = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    hideLoading();
    return;
  }
  data.value = { ...data.value, ...props.params };
  Object.keys(data.value).map(
    (k) => (data.value[k] = typeof data.value[k] == "string" ? data.value[k].trim() : data.value[k])
  );
  if (props.customSave) {
    props.customSave(data.value, v$);
    return;
  }

  if (props.id) {
    onUpdate();
    return;
  }

  onAdd();
};

const { goBack } = useHistory();

const onUpdate = () => {
  service
    .update(deepCopy(data.value))
    .then((response) => {
      if ((response.value as any).statusCode == 200) {
        useNotify("success", t("updateSucessfully")).show();
        goBack();
      }
    })
    .finally(() => hideLoading());
};

const onAdd = () => {
  service
    .create(deepCopy(data.value))
    .then((response) => {
      if ((response.value as any).statusCode == 200) {
        useNotify("success", t("addSuccessfully")).show();
        goBack();
      }
    })
    .finally(() => hideLoading());
};

const hideLoading = () => {
  loading.value = false;
};

const handleOptionsField = (data: any) => {
  let options: any = JSON.parse(data.options);
  if (Array.isArray(options)) {
    options = {
      value: "value",
      label: "label",
      notLoad: true,
      data: options,
    };
  }
  return options;
};

defineExpose({
  hideLoading,
  onSave,
  onAdd,
  onUpdate,
});

watch(
  () => props.updateValue,
  (newVal, oldVal) => {
    Object.keys(newVal).forEach(function (key) {
      data.value[key] = newVal[key];
    });
  },
  { deep: true }
);

watch(
  () => data.value,
  (newVal, oldVal) => {
    emits("data", newVal);
  },
  { deep: true }
);

const handleScroll = () => {
  if (window.scrollY > 90) isStuck.value = true;
  else if (window.scrollY < 1) isStuck.value = false;
};

const init = () => {
  window.addEventListener("scroll", handleScroll);
};

onMounted(init);
</script>

<template>
  <div class="card">
    <form class="form-layout" @submit.prevent>
      <div
        class="form-head border-b"
        :class="{ 'stuck-header': isStuck }"
        v-if="!props.configs.noHead"
      >
        <div class="mt-auto">
          <slot name="headtitle">
            <h3>
              {{
                `${props.id ? $t("update") : $t("add")} ${$t(props.configs.title).toLowerCase()}`
              }}
            </h3>
          </slot>
        </div>
        <div class="flex-grow-1"></div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <slot v-if="!props.configs.isButtonBottom" name="button">
            <NGoBackButton></NGoBackButton>
            <NButton width="116px" @click="onSave" :loading="loading">
              {{ $t("save") }}
            </NButton>
          </slot>
        </div>
      </div>
      <div class="form-body">
        <div class="row">
          <div
            v-for="(column, i) in props.configs.columns"
            :key="`column-${i}`"
            :class="`col-${column.layout} py-2`"
          >
            <template
              v-for="(field, ind) in column.fields"
              :key="`field-${ind}`"
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
                  v-model.trim="data[field.key]"
                  :type="field.type"
                  :label="field.label"
                  :max-length="field.maxLength"
                  :placeholder="field.placeholder"
                  :disabled="
                    field.disabled || (unableEditCode.includes(data.code) && !isInThemMoiPage)
                  "
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
                  v-model="data[field.key]"
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
                  v-model="data[field.key]"
                  :label="field.label"
                  :options="field.options"
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

              <div v-else-if="field.type == 'selectobj'">
                <NSelectObj
                  v-model="data[field.key]"
                  :label="field.label"
                  :options="field.options"
                  :data="data"
                  :required="!!field?.rules?.required"
                  @update:modelValue="changeValue(data, field.key, $event)"
                >
                </NSelectObj>
                <div class="v-messages">
                  <div class="help text-danger">
                    {{ onErrorMessage(field.key) }}
                  </div>
                </div>
              </div>

              <div
                v-else-if="field.type == 'checkbox' || field.type == 'switch'"
              >
                <NCheck
                  v-model="data[field.key]"
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
                  v-model="data[field.key]"
                  :options="field.options"
                  class="pt-14"
                  @update:modelValue="changeValue(data, field.key, $event)"
                >
                </NRadios>
              </div>

              <div
                v-else-if="field.type == 'datetime' || field.type == 'date' || field.type == 'time'"
              >
                <NDatePicker
                  v-model="data[field.key]"
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

              <div v-else-if="field.type == 'editor'">
                <LazyNEditor
                  v-model="data[field.key]"
                  :label="field.label"
                  :required="!!field?.rules?.required"
                ></LazyNEditor>

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
            </template>
          </div>
        </div>
      </div>
      <div v-if="hasFooter" class="form-footer border-t">
        <slot name="footer"></slot>
        <div class="flex-grow-1"></div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <slot v-if="props.configs.isButtonBottom" name="button">
            <NGoBackButton></NGoBackButton>
            <NButton width="116px" @click="onSave">
              {{ $t("save") }}
            </NButton>
          </slot>
        </div>
      </div>
      <div
        class="col-12"
        v-if="(data?.extend || []).length !== 0 && data?.extend[0].label && !props.configs.noExtend"
      >
        <div class="accordion" id="accordionExample">
          <div class="accordion-item" style="border-radius: 0px !important">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed extent-header bg-success-subtle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-controls="collapseOne"
              >
                <div>{{ $t("extend") }}</div>
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body form-body">
                <div class="row">
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

                    <div v-else-if="field.type == 'selectobj'">
                      <NSelectObj
                        v-model="data[field.key]"
                        :label="field.label"
                        :options="field.options"
                        :data="data"
                        :required="!!field?.rules?.required"
                        @update:modelValue="changeValue(data, field.key, $event)"
                      >
                      </NSelectObj>
                      <div class="v-messages">
                        <div class="help text-danger">
                          {{ onErrorMessage(field.key) }}
                        </div>
                      </div>
                    </div>

                    <div
                      v-else-if="field.type == 'checkbox' || field.type == 'switch'"
                    >
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
                        field.type == 'datetime' || field.type == 'date' || field.type == 'time'
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
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="sass" scoped>
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
    background-color: white !important
    h3
      margin-left: 28rem

.accordion-button::after
  background-image: var(--bs-accordion-btn-icon) !important
</style>
