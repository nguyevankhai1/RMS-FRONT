<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        ref="applicationFormConfig"
        :configs="ApplicationFormConfig"
        :id="route.params.id"
        :customSave="onSave"
      >
        <template #tabs>
          <NTabs :tabs="tabs" v-model:selected="tabSelect">
            <template #tab="{ activeValue }">
              <div v-if="activeValue == 'roles'">
                <NTable
                  :options="RolesTableConfig"
                  :has-filter="false"
                  :params="{ appId: route.params.id }"
                  :has-select="false"
                  @selected="handleSelectedRole"
                >
                  <template #action-head>
                    <NuxtLink class="pe-5">
                      <NButton
                        size="sm"
                        append-icon="material-symbols:add-sharp"
                        color-icon="white"
                        @click="goToPage('add')"
                      >
                        {{ $t("add") }}
                      </NButton>
                    </NuxtLink>
                  </template>
                  <template #action-edit="props">
                    <div
                      class="button"
                      @click="goToPage('edit', props.entity)"
                      :style="{
                        display: props.entity.isManager ? 'none' : 'flex',
                        marginLeft:
                          props.entity.isDefault || props.entity.isManager ? '30px' : '0px',
                      }"
                    >
                      <NIcon
                        name="pajamas:pencil"
                        size="16"
                        color="#008BD9"
                      ></NIcon>
                    </div>
                  </template>
                </NTable>
              </div>
              <div v-else-if="activeValue == 'resources'">
                <NTreeTable
                  :options="ResourceTableConfig"
                  :is-data-tree="false"
                  :has-select="false"
                  :params="{ appId: route.params.id }"
                  router="/resource"
                  query="path"
                >
                </NTreeTable>
              </div>
              <div v-else-if="activeValue == 'user'">
                <NTable
                  :options="UserTableConfig"
                  :params="{ appId: route.params.id }"
                  :has-select="false"
                  @selected="handleSelectedRole"
                  :hasHidden="{}"
                >
                  <template #action-head>
                    <NuxtLink class="pe-5">
                      <NButton
                        size="sm"
                        append-icon="material-symbols:add-sharp"
                        color-icon="white"
                        @click="goToPageUse('add')"
                      >
                        {{ $t("addUser") }}
                      </NButton>
                    </NuxtLink>
                  </template>
                  <template #action-edit="props">
                    <div
                      class="button"
                      @click="goToPageUse('edit', props.entity)"
                    >
                      <NIcon
                        name="pajamas:pencil"
                        size="16"
                        color="#008BD9"
                      ></NIcon>
                    </div>
                  </template>
                </NTable>
                <NModal
                  v-model="openListUser"
                  labelSave="table.user.permission"
                  @confirm="confirm()"
                >
                  <template #body>
                    <div style="height: 357px">
                      <NSelect
                        ref="permissionRole"
                        v-model="userId"
                        :label="userOp.label"
                        :options="userOp.options"
                        @update:modelValue="userError = false"
                      >
                      </NSelect>
                      <div class="v-messages" v-if="userError">
                        <div class="help text-danger">
                          {{ $t("required-message") }}
                        </div>
                      </div>
                    </div>
                  </template>
                </NModal>
              </div>
              <div v-else-if="activeValue === 'config'">
                <NTreeTable
                  :options="CategoryTableConfig"
                  :is-data-tree="false"
                  :has-filter="false"
                  :has-select="false"
                  :params="{ appId: route.params.id }"
                  router="/category"
                >
                </NTreeTable>
              </div>
              <div v-else-if="activeValue === 'extend'">
                <Extend :appId="route.params.id"></Extend>
              </div>
              <div v-show="activeValue === 'setting'">
                <Setting
                  :appId="route.params.id"
                  :onSave="saveChange"
                  @data="dataSetting = $event"
                ></Setting>
              </div>
            </template>
          </NTabs>
        </template>
      </NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApplicationFormConfig from "~~/configs/forms/ApplicationFormConfig";
import RolesTableConfig from "~~/configs/tables/RolesTableConfig";
import UserTableConfig from "~~/configs/tables/UserTableConfig";
import ResourceTableConfig from "~~/configs/tables/ResourceTableConfig";
import CategoryTableConfig from "~~/configs/tables/CategoryTableConfig";

import NIcon from "~~/components/base/NIcon.vue";
import NTable from "~~/components/base/NTable.vue";
import NButton from "~~/components/base/NButton.vue";
import NTreeTable from "~~/components/base/NTreeTable.vue";
import NTabs from "~~/components/base/NTabs.vue";
import NForm from "~~/components/base/NForm.vue";
import NModal from "~~/components/base/NModal.vue";
import NSelect from "~~/components/base/NSelect.vue";
import Setting from "~~/components/pages/Setting.vue";
import Extend from "~~/pages/extend/index.vue";
import API_PATH from "~~/enums/API_PATH";

const route = useRoute();
const router = useRouter();

const applicationFormConfig = ref()
const permissionRole = ref<any>();
const saveChange = ref<boolean>(false)
const dataSetting = ref()
const tabs = ref<any>([
  {
    label: "side-bar.roles",
    value: "roles",
    icon: "",
    shouldDisplay: true,
  },
  {
    label: "side-bar.resource",
    value: "resources",
    icon: "",
    shouldDisplay: true,
  },
  {
    label: "side-bar.user",
    value: "user",
    icon: "",
    shouldDisplay: true,
  },
  {
    label: "side-bar.config",
    value: "config",
    icon: "",
    shouldDisplay: true,
  },
  {
    label: "side-bar.extend",
    value: "extend",
    icon: "",
    shouldDisplay: true,
  },
  {
    label: "side-bar.setting",
    value: "setting",
    icon: "",
    shouldDisplay: true,
  },
]);

const { t } = useI18n();
const userId = ref<any>("");
const userError = ref(false);
const userOp = ref<any>({
  label: "side-bar.user",
  options: {
    value: "id",
    label: "name",
    api: "user",
    searchKey: "name",
    notLoad: true,
    apiSearch: "name",
    description: "email",
  },
});

const tabSelect = ref<string>(route.query.tabSelect ? route.query.tabSelect.toString() : "roles");

const ids = ref<number[]>([]);
const openListUser = ref(false);

const goToPage = (action: string, entity: any = {}) => {
  if (action === "add") {
    router.push({ path: `${route.path}/role/them-moi` });
  }

  if (action === "edit") {
    router.push({ path: `${route.path}/role/${entity.id}` });
  }
};

const onSave =  () => {
  saveChange.value = !saveChange.value
  setTimeout(async () => {
    const path = '/setting/expireTokenApp' as API_PATH;
    const { data }:any = await useAPI({
      path,
    })._post(dataSetting.value);
    if (data.value.statusCode == 200) {
      applicationFormConfig.value?.onUpdate()
    }
  });
}

const goToPageUse = (action: string, entity: any = {}) => {
  if (action === "add") {
    permissionRole.value.reLoad();
    openListUser.value = true;
  }

  if (action === "edit") {
    router.push({ path: `${route.path}/user/${entity.id}` });
  }
};

const handleSelectedRole = (entity: number[] = []) => {
  ids.value = entity;
};

const confirm = () => {
  if (userId.value) {
    openListUser.value = false;
    router.push({ path: `${route.path}/user/${userId.value}` });
  } else {
    userError.value = true;
  }
};

watch(
  () => tabSelect.value,
  () => {
    router.push({ path: route.path, query: { tabSelect: tabSelect.value } });
  }
);
</script>

<style lang="sass" scoped>
.button
  width: 30px
  height: 30px
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  gap: 10px
  cursor: pointer
</style>
