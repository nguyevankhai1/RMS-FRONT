<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="ExtendFormConfig" :id="route.params.id" @data="getData">
        <template #fields>
          <div v-for="(item, index) in items" :key="`field-${index}`" class="row">
            <div class="col-1 d-flex align-items-end">
              <span class="cus-box fw-bolder fs-3">
                {{ (typeof index === "string" ? parseInt(index) : index) + 1 }}
                .
              </span>
            </div>
            <div class="col-2">
              <NInput v-model="item.key" type="text" label="Key" required> </NInput>
              <div v-if="!item.key" class="v-messages">
                <div class="help text-danger">
                  {{ t("required-message") }}
                </div>
              </div>
            </div>
            <div class="col-2">
              <NInput v-model="item.label_" type="text" label="forms.extend.label" required>
              </NInput>
              <div v-if="!item.label_" class="v-messages">
                <div class="help text-danger">
                  {{ t("required-message") }}
                </div>
              </div>
            </div>
            <div class="col-3">
              <div class="d-flex align-items-end">
                <NSelect
                  v-model="item.datatype_"
                  label="forms.extend.datatype"
                  :options="datatypeOp"
                  required
                  class="w-100"
                >
                </NSelect>
                <div class="cus-box cursor-pointer">
                  <div
                    v-if="item.datatype_ === 'select'"
                    class="cus-box"
                    @click="openModalDatatype(index, item)"
                  >
                    <BaseNIcon name="clarity:settings-line" size="20"></BaseNIcon>
                  </div>
                </div>
              </div>

              <div v-if="!item.datatype_" class="v-messages">
                <div class="help text-danger">
                  {{ t("required-message") }}
                </div>
              </div>
            </div>

            <div class="col-3"></div>

            <div class="col-1 d-flex justify-content-center align-items-end">
              <div class="cus-box cursor-pointer" @click="onDelete(index)">
                <BaseNIcon
                  v-if="(items || []).length !== 1"
                  name="feather:trash-2"
                  size="16"
                  color="#d21953"
                ></BaseNIcon>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t"></div>
          <NButton
            size="sm"
            prepend-icon="material-symbols:add-sharp"
            color-icon="white"
            @click="addField"
          >
            {{ $t("forms.extend.addField") }}
          </NButton>
        </template>
        <template #button>
          <NButton color="secondary" prepend-icon="mdi:arrow-left-thin" @click="backHistory">
            {{ $t("goBack") }}
          </NButton>
          <NButton width="116px" @click="onSave" :loading="loading">
            {{ $t("save") }}
          </NButton>
        </template>
      </NForm>
    </div>

    <NModal
      v-model="openModal"
      :title="$t('forms.extend.add-data')"
      :disabled-btn-save="!(dataSelect || []).length && tabSelect === 'static'"
      @confirm="confirm"
      @update:modelValue="resetDataModal"
    >
      <template #body>
        <div class="tabs-extend" v-if="tabSelect">
          <NTabs :tabs="tabs" v-model:selected="tabSelect" :arrowIcon="false">
            <template #tab="{ activeValue }">
              <div v-if="activeValue === 'static'" class="tabs-extend-item">
                <div style="height: 357px">
                  <div
                    v-for="(item, index) in dataSelect"
                    :key="`data-select-${index}`"
                    class="row py-2"
                  >
                    <div class="col-6">
                      <div class="d-flex align-items-end">
                        <span class="fw-semibold fs-4 pe-4">{{ index + 1 }}.</span>
                        <div class="w-100">
                          <NInput
                            v-model="item.value"
                            type="text"
                            placeholder="forms.extend.value"
                            required
                          >
                          </NInput>
                          <div v-if="!item.value" class="v-messages">
                            <div class="help text-danger">
                              {{ t("required-message") }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="d-flex align-items-end">
                        <NInput
                          v-model="item.label"
                          type="text"
                          placeholder="forms.extend.label"
                          required
                          class="w-100"
                        >
                        </NInput>
                        <div class="cus-box cursor-pointer">
                          <div class="cus-box cursor-pointer" @click="onDeleteSelect(index)">
                            <BaseNIcon name="feather:trash-2" size="16" color="#d21953"></BaseNIcon>
                          </div>
                        </div>
                      </div>
                      <div v-if="!item.label" class="v-messages">
                        <div class="help text-danger">
                          {{ t("required-message") }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="activeValue === 'dynamic'">
                <NForm
                  ref="formDataExtent"
                  :configs="ExtendFormDataConfig"
                  :customSave="saveItemSelect"
                  :updateValue="dataDynamic"
                ></NForm>
              </div>
            </template>
          </NTabs>
        </div>
      </template>

      <template #action>
        <NButton
          v-if="tabSelect === 'static'"
          size="sm"
          prepend-icon="material-symbols:add-sharp"
          color-icon="white"
          @click="addDataSelect"
        >
          {{ $t("forms.extend.add-data") }}
        </NButton>
        <div class="flex-grow-1"></div>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import NForm from "~~/components/base/NForm.vue";
import NButton from "~~/components/base/NButton.vue";
import NInput from "~~/components/base/NInput.vue";
import NSelect from "~~/components/base/NSelect.vue";
import NModal from "~~/components/base/NModal.vue";
import NTabs from "~~/components/base/NTabs.vue";

import API_PATH from "~~/enums/API_PATH";

import ExtendFormConfig from "~~/configs/forms/ExtendFormConfig";
import ExtendFormDataConfig from "~~/configs/forms/ExtendFormDataConfig";

const service = useService(API_PATH.EXTEND);

const route = useRoute();
const { t } = useI18n();
const items = ref<any>([]);
const isIndex = ref<number>(0);
const entity = ref<any>("");
const openModal = ref<boolean>(false);
const dataSelect = ref<any>([]);
const dataDynamic = ref<any>();
const loading = ref<boolean>(false);
const tabSelect = ref<string>();
const formDataExtent = ref<any>();

const datatypeOp = ref<any>({
  notLoad: true,
  value: "value",
  label: "label",
  noClear: true,
  data: [
    { value: "text", label: "text" },
    { value: "textarea", label: "textarea" },
    { value: "select", label: "select" },
    { value: "datetime", label: "datetime" },
    { value: "date", label: "date" },
    { value: "time", label: "time" },
  ],
});

const getDataJson = (json: string) => {
  try {
    return [...JSON.parse(json)];
  } catch (error) {
    return [];
  }
};

const addDataSelect = () => {
  dataSelect.value.push({ value: "", label: "" });
};

const backHistory = () => {
  window.history.back();
};

const onDeleteSelect = (index: number) => {
  isIndex.value = index;
  useConfirm({
    confirmFn: onConfirmDeleteSelect,
    confirmBtnColor: "danger",
    message: t("confirmBeforeDeleting"),
    t,
  }).show();
};

const onConfirmDeleteSelect = () => {
  dataSelect.value.splice(isIndex.value, 1);
};

const openModalDatatype = (index: number, item: any) => {
  if (item.options) {
    const options: any = JSON.parse(item.options);
    if (Array.isArray(options)) {
      dataSelect.value = options;
      tabSelect.value = "static";
    } else {
      dataDynamic.value = options;
      tabSelect.value = "dynamic";
    }
  } else {
    tabSelect.value = "static";
    dataSelect.value = [];
  }

  entity.value = index;
  openModal.value = true;
};

const hasValidateSelect = () => {
  let output = false;
  if ((dataSelect.value || []).length) {
    for (let i = 0; i < dataSelect.value.length; i++) {
      const element = dataSelect.value[i];
      if (!element.value || !element.label) {
        output = true;
        break;
      }
    }
  }
  return output;
};

const confirm = () => {
  const dynamic = tabSelect.value === "dynamic" && (dataSelect.value || []).length !== 0;
  const dataStatic =
    tabSelect.value === "static" && dataDynamic.value && JSON.stringify(dataDynamic.value) !== "{}";
  if (dynamic || dataStatic) {
    useConfirm({
      confirmFn: saveModal,
      confirmBtnColor: "danger",
      message:
        tabSelect.value === "static"
          ? t("confirmBeforeSaveDataStatic")
          : t("confirmBeforeSaveDataDynamic"),
      t,
    }).show();
  } else {
    saveModal();
  }
};

const saveModal = () => {
  if (tabSelect.value === "static") {
    saveData();
  } else {
    formDataExtent.value?.onSave();
  }
};

const resetDataModal = () => {
  tabSelect.value = "";
  dataDynamic.value = {};
  dataSelect.value = [];
};

const saveData = () => {
  if (hasValidateSelect()) {
    useNotify("warning", t("forms.extend.msg-error")).show();
    return;
  }

  if (hasDuplicate(dataSelect.value, "value")) {
    useNotify("warning", t("forms.extend.msg-duplicate", { key: "Value" })).show();
    return;
  }

  items.value[entity.value].options = JSON.stringify(dataSelect.value);
  openModal.value = false;
  resetDataModal();
};

const saveItemSelect = (data: any) => {
  items.value[entity.value].options = JSON.stringify(data);
  openModal.value = false;
  resetDataModal();
};

const tabs = computed(() => {
  return [
    {
      label: "forms.extend.static-prediction",
      value: "static",
      shouldDisplay: true,
    },
    {
      label: "forms.extend.dynamic-prediction",
      value: "dynamic",
      shouldDisplay: true,
    },
  ];
});

const getData = (data: any) => {
  items.value = data ? [...data] : [];
};

const addField = () => {
  if (items.value.length === 0) return insertItem();

  const lastItem = items.value[items.value.length - 1];
  return !(lastItem.key && lastItem.label_ && lastItem.datatype_)
    ? useNotify("warning", t("forms.extend.msg-error")).show()
    : insertItem();
};

const insertItem = () => {
  items.value.push({
    id: "",
    key: "",
    label_: "",
    datatype_: "",
    priority: 0,
    extendId: route.params.id,
    group_: "",
    dataOption: "",
  });
};

const onDelete = (index: number) => {
  isIndex.value = index;
  useConfirm({
    confirmFn: onConfirmDelete,
    confirmBtnColor: "danger",
    message: t("confirmBeforeDeleting"),
    t,
  }).show();
};
const onConfirmDelete = () => {
  items.value.splice(isIndex.value, 1);
};

const hasValidate = () => {
  let output = false;

  if ((items.value || []).length) {
    for (let i = 0; i < items.value.length; i++) {
      const element = items.value[i];
      if (!element.key || !element.label_ || !element.datatype_) {
        output = true;
        break;
      }
    }
  }

  return output;
};

const hasDuplicate = (arr: any, key: string = "key") => {
  let output = false;

  if (!(arr || []).length) return output;

  arr
    .map((e: any) => e[key])
    .map((y: any, i: number, final: any) => {
      if (final.indexOf(y) !== i) output = true;
    });

  return output;
};

const onSave = () => {
  loading.value = true;
  if (hasValidate()) {
    loading.value = false;
    useNotify("warning", t("forms.extend.msg-error")).show();
    return;
  }

  if (hasDuplicate(items.value)) {
    loading.value = false;
    useNotify("warning", t("forms.extend.msg-duplicate", { key: "Key" })).show();
    return;
  }

  service
    .update(
      deepCopy({
        id: route.params.id,
        attributes: items.value,
      })
    )
    .then((response) => {
      if ((response.value as any).statusCode == 200) {
        useNotify("success", t("updateSucessfully")).show();
        backHistory();
      }
    })
    .finally(() => (loading.value = false));
};
</script>

<style lang="sass" scoped>
.cus-box
  width: 43.55px
  height: 43.55px
  display: flex
  justify-content: center
  align-items: center

.tabs-extend
  margin: -1.75rem
  .tabs-extend-item
    padding: 1.75rem
</style>
