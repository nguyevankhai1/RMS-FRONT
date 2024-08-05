<script lang="ts" setup>
import NForm from "~~/components/base/NForm.vue";
import APIKeysFormConfig from "~~/configs/forms/APIKeysFormConfig";
import API_PATH from "~~/enums/API_PATH";
import NTable from "~~/components/base/NTable.vue";
import NButton from "~~/components/base/NButton.vue";
import NIcon from "~~/components/base/NIcon.vue";
import NModal from "~~/components/base/NModal.vue";
import type { FormConfig } from "~~/types/index";

interface Item {
  name: string;
  value: string;
  modalType: "Add" | "Update" | "";
  index?: number;
}

const defaultItem: Item = {
  name: "",
  value: "",
  modalType: "",
};

const tableConfig = {
  columns: [
    {
      data: "name",
      heading: "table.header.name",
    },
    {
      data: "value",
      heading: "forms.extend.value",
    },
  ],
};

const commonColumnsConfig = [
  {
    layout: "6",
    fields: [
      {
        key: "name",
        label: "table.header.name",
        rules: { required },
      },
    ],
  },
];

const websiteFormConfig: FormConfig = {
  columns: [
    ...commonColumnsConfig,
    {
      layout: "6",
      fields: [
        {
          key: "value",
          label: "forms.extend.value",
          rules: { required, url },
        },
      ],
    },
  ],
  noHead: true,
};

const ipFormConfig: FormConfig = {
  columns: [
    ...commonColumnsConfig,
    {
      layout: "6",
      fields: [
        {
          key: "value",
          label: "forms.extend.value",
          rules: { required, ipAddress },
        },
      ],
    },
  ],
  noHead: true,
};

const { t } = useI18n();
const { goBack } = useHistory();
const service = useService(API_PATH.APIKEYS_CONFIG);
const { user } = useMe();

const formEditUser = ref<any>(null);
const nestedForm = ref<any>(null);
const updatedValue = ref<any>({});
const previousData = ref<any>(null);
const openModal = ref<boolean>(false);
const current = ref<Item>({ ...defaultItem });
const keysRestrictions = ref<any>([]);

updatedValue.value = {
  userId: user.value.id,
  activation: true,
  apiKeysRestrictions: [],
  restriction: "NONE",
};

const updateRestrictions = (arr: any) => {
  updatedValue.value = { apiKeysRestrictions: arr };
};

const dataInForm = (data: any) => {
  keysRestrictions.value = [...data.apiKeysRestrictions];

  if (!Boolean(previousData.value)) {
    if (data.apiKeysRestrictions.length > 0) {
      data.apiKeysRestrictionsOld = {
        [data.restriction]: data.apiKeysRestrictions,
      };
    }
    previousData.value = { ...data };
    return;
  }

  if (previousData.value.restriction === data.restriction) return;

  if (data.apiKeysRestrictions.length > 0) {
    data.apiKeysRestrictionsOld = {
      ...data.apiKeysRestrictionsOld,
      [previousData.value.restriction]: data.apiKeysRestrictions,
    };
    updateRestrictions([]);
  }

  if (
    data.restriction !== "NONE" &&
    previousData.value.apiKeysRestrictionsOld &&
    previousData.value.apiKeysRestrictionsOld.hasOwnProperty(data.restriction)
  ) {
    updateRestrictions(previousData.value.apiKeysRestrictionsOld[data.restriction]);
  }

  previousData.value = { ...data };
};

const onSave = (data: any) => {
  console.log("data: ", data);

  const { name, expiration, restriction, activation, userId, application, apiKeysRestrictions } =
    data;

  const params = {
    // @ts-ignore
    application: { id: application.id },
    user: { id: userId },
    name,
    expiration,
    restriction,
    activation,
    apiKeysRestrictions,
  };

  service.create(params).then((response) => {
    if ((response.value as any).statusCode == 200) {
      useNotify("success", t("addSuccessfully")).show();
      goBack();
    }
  });
};

const onCloseModal = () => {
  openModal.value = false;
};

const handleAdd = () => {
  current.value = { ...defaultItem, modalType: "Add" };
  openModal.value = true;
};

const handleDelete = (index: number) => {
  const deleteItem = () => {
    keysRestrictions.value.splice(index, 1);
    updateRestrictions(keysRestrictions);
    onCloseModal();
  };

  useConfirm({
    confirmFn: deleteItem,
    confirmBtnColor: "danger",
    message: t("confirmBeforeDeleting"),
    t,
  }).show();
};

const handleEdit = (index: number) => {
  current.value = { ...keysRestrictions.value[index], modalType: "Update", index };
  openModal.value = true;
};

const confirmAction = (newItem: any) => {
  newItem.value = new URL(newItem.value).origin;

  if (current.value.modalType === "Add") {
    updateRestrictions([...keysRestrictions.value, newItem]);
    onCloseModal();
  } else {
    keysRestrictions.value[newItem.index!] = newItem;
    updateRestrictions(keysRestrictions.value);
    onCloseModal();
  }
};
</script>

<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        ref="formEditUser"
        :configs="APIKeysFormConfig"
        :customSave="onSave"
        :updateValue="updatedValue"
        @data="dataInForm"
      >
        <template #apiKeysRestrictions="props">
          <NTable
            v-show="props.data.restriction !== 'NONE'"
            :options="tableConfig"
            :is-load="false"
            :data="props.data.apiKeysRestrictions"
          >
            <template #action-head>
              <NuxtLink class="pe-5">
                <NButton
                  size="sm"
                  append-icon="material-symbols:add-sharp"
                  color-icon="white"
                  @click="handleAdd"
                >
                  {{ $t("add") }}
                </NButton>
              </NuxtLink>
            </template>
            <template #action-edit="{ index }">
              <div class="button" @click="handleEdit(index)">
                <NIcon name="pajamas:pencil" size="16" color="#008BD9"></NIcon>
              </div>
            </template>
            <template #action-delete="{ index }">
              <div class="button" @click="handleDelete(index)">
                <NIcon name="feather:trash-2" size="16" color="#d21953"> </NIcon>
              </div>
            </template>
          </NTable>
          <NModal
            v-model="openModal"
            :title="`${t(current.modalType.toLocaleLowerCase())} ${
              props.data.restriction === 'WEBSITES'
                ? 'Website'
                : t('ipAddresses').toLocaleLowerCase()
            }`"
            @update:modelValue="onCloseModal"
            @confirm="nestedForm.onSave()"
          >
            <template #body>
              <NForm
                v-if="openModal"
                ref="nestedForm"
                :configs="props.data.restriction === 'WEBSITES' ? websiteFormConfig : ipFormConfig"
                :customSave="confirmAction"
                :updateValue="current"
              >
              </NForm>
            </template>
          </NModal>
        </template>
      </NForm>
    </div>
  </div>
</template>
