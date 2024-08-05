<template>
  <div class="container-xxl">
    <div class="card">
      <NTable
        ref="extendProfile"
        :options="ExtendTableConfig"
        :reload="shouldReload"
        :isLoad="false"
      >
        <template #extend_="props">
          <NSwitchButton
            :data="props.entity || false"
            :status="props.entity.extend_"
            :confirm="true"
            @switch-toggle="changeExtendStatus"
            @confirm-true="confirmChange"
          ></NSwitchButton>
        </template>
        <template #action-edit="props">
          <div
            class="button"
            @click="goToPage(props.entity.id)"
            :style="{
              display: props.entity.isManager ? 'none' : 'flex',
              marginLeft: props.entity.isDefault || props.entity.isManager ? '30px' : '0px',
            }"
          >
            <NIcon name="pajamas:pencil" size="16" color="#008BD9"></NIcon>
          </div>
        </template>
        <template #action-head>
          <NButton
            v-if="props.appId"
            size="sm"
            append-icon="material-symbols:add-sharp"
            color-icon="white"
            @click="addExtend()"
          >
            {{ $t("add") }}
          </NButton>
          <div v-else></div>
        </template>
        <template #description="{ entity }">
          <div v-if="entity.description">
            {{ $t(entity?.description) }}
          </div>
        </template>
      </NTable>

      <NModal v-model="openListExtend" labelSave="add" @confirm="confirm()">
        <template #body>
          <div style="height: 357px">
            <NSelect
              ref="selectExtend"
              v-model="extendId"
              :label="extendOp.label"
              :options="extendOp.options"
              @update:modelValue="extendError = false"
            >
            </NSelect>
            <div class="v-messages" v-if="extendError">
              <div class="help text-danger">
                {{ $t("required-message") }}
              </div>
            </div>
          </div>
        </template>
      </NModal>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ExtendUpdateParams {
  id: string;
  table_: string;
  name: string;
  extend_: 0 | 1;
  description: string | null;
}

import NIcon from "~~/components/base/NIcon.vue";
import NTable from "~~/components/base/NTable.vue";
import NButton from "~~/components/base/NButton.vue";
import NSelect from "~~/components/base/NSelect.vue";
import NModal from "~~/components/base/NModal.vue";
import NSwitchButton from "~~/components/base/NSwitchButton.vue";

import ExtendTableConfig from "~~/configs/tables/ExtendTableConfig";
import API_PATH from "~/enums/API_PATH";

const props = defineProps({
  appId: {
    type: [String, Array<string>],
  },
});

const extendOp = ref<any>({
  label: "table.header.name",
  options: {
    value: "id",
    label: "name",
    api: "extend",
    searchKey: "name",
    notLoad: true,
    apiSearch: "name",
    description: "description",
    params: { page: 0, size: 20, extend: true },
  },
});
const selectExtend = ref<any>();
const router = useRouter();
const { t } = useI18n();
const extendInfo = ref<any>();
const extendId = ref<any>("");
const extendError = ref(false);
const openListExtend = ref(false);
const shouldReload = ref<0 | 1>(0);
const extendProfile = ref();

const changeExtendStatus = (extendData: any) => {
  extendInfo.value = extendData;
};

const confirmChange = (data: any) => {
  const params: ExtendUpdateParams = {
    id: data.id,
    table_: data.table_,
    name: data.name,
    extend_: data.extend_,
    description: data.description,
  };

  const extendService = useAPI({
    path: `${API_PATH.EXTEND}/update/status` as API_PATH,
  });

  extendService
    ._put(params)
    .then((response) => {
      if ((response as any).data.value.statusCode !== "200") return;
      useNotify("success", t("updateSucessfully")).show();
      shouldReload.value = 1;
    })
    .finally(() => (shouldReload.value = 0));
};

const goToPage = (id: string) => {
  router.push(`/extend/${id}`);
};

const addExtend = () => {
  openListExtend.value = true;
  selectExtend.value?.reLoad();
};

const confirm = () => {
  const params = {
    appId: props.appId,
    extendId: extendId.value,
  };

  useAPI({
    path: `${API_PATH.EXTEND}/create` as API_PATH,
  })
    ._post(params)
    .then((response) => {
      openListExtend.value = false;
      extendProfile.value?.onSearch({ appId: props.appId });
    });
};

onMounted(() => {
  if (props.appId) {
    extendProfile.value?.onSearch({ appId: props.appId });
  } else {
    extendProfile.value?.onSearch();
  }
});
</script>
