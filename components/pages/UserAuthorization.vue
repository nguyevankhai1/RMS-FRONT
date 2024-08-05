<script lang="ts" setup>
import PermissionResourceTableConfig from "~~/configs/tables/PermissionResourceTableConfig";
import API_PATH from "~~/enums/API_PATH";
import NButton from "~~/components/base/NButton.vue";
import NSelect from "~~/components/base/NSelect.vue";
import NTabs from "~~/components/base/NTabs.vue";
import ZonePermission from "~~/components/ZonePermission.vue";
import AbilityPermission from "~~/components/AbilityPermission.vue";
import NTreeTable from "~~/components/base/NTreeTable.vue";
import ExtendProfile from "./ExtendProfile.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const props = defineProps({
  save: {
    type: Boolean,
  },
});

const appLicationId = ref<string>(route.params.userId ? (route.params.id as string) : "");
const optionsCheckbox = ref<any>({
  data: [],
  resource: [],
});

const appOp = ref<any>({
  label: "side-bar.application",
  options: {
    value: "id",
    label: "name",
    api: "/application",
    path: "get/select",
    searchKey: "name",
    disabled: true,
  },
});

const roleOp = ref<any>({
  label: "side-bar.roles",
  options: {
    value: "id",
    label: "name",
    api: "/application/role",
    path: "get/list",
    params: {
      appId: appLicationId.value,
    },
    searchKey: "name",
    multiple: true,
  },
});

const tabSelect = ref<string>(
  route.query.tabSelect ? (route.query.tabSelect as string) : "permission"
);

const loadComponent = ref<any>({
  permission: false,
  zone: false,
  ability: false,
  profile: false,
});

const permissionRole = ref<any>(null);
const treeTable = ref<any>(null);
const saveData = ref<boolean>(false);
const onloadZonePermission = ref<boolean>(true);
const onloadAbilityPermission = ref<boolean>(true);
const displayZoneTab = ref<boolean>(false);
const displayAbilitiesTab = ref<boolean>(false);
const roleIds = ref<any>(null);
const dataPermission = ref<any>({
  permission: {
    roleIds: "",
  },
});

const tabs = computed(() => {
  return [
    {
      label: "table.user.permission",
      value: "permission",
      icon: "",
      shouldDisplay: true,
    },
    {
      label: "table.user.zone",
      value: "zone",
      icon: "",
      shouldDisplay: displayZoneTab.value,
    },
    {
      label: "table.user.ability",
      value: "ability",
      icon: "",
      shouldDisplay: displayAbilitiesTab.value,
    },
    {
      label: "profile",
      value: "profile",
      icon: "",
      shouldDisplay: true,
    },
  ];
});

const userId = !route.params.userId ? route.params.id : route.params.userId;

const saveAuthorize = () => {
  const params = dataPermission.value;
  params.permission.roleIds = roleIds.value?.split(",");
  let selectIdTable = treeTable.value
    ?.getData()
    ?.filter((e: any) => e.view)
    .map((e: any) => e.id);
  if (selectIdTable) {
    params.permission.resource = selectIdTable.filter(
      (item: any) => !optionsCheckbox.value.data.includes(item)
    );
  }

  const service = useService(`${API_PATH.USER_PERMISSION}` as API_PATH);
  service.update(deepCopy(params)).then((response: any) => {
    if (response.value.statusCode == 200) {
      useNotify("success", t("applicationPage.authorizeSuccessfully")).show();
      backHistory();
    }
  });
};

const savePermission = () => {
  if (!appLicationId.value) return useNotify("danger", t("noAppId")).show();
  saveAuthorize();
};

const changeValue = async (field: string, value: any) => {
  if (field === "appLicationId" && value) {
    if (route.params.userId) {
      router.push({
        path: `/application/${appLicationId.value}/user/${route.params.userId}/`,
        query: { tabSelect: tabSelect.value },
      });
    } else {
      roleOp.value.options.params = { appId: appLicationId.value };
      roleIds.value = "";
      permissionRole.value?.reLoad();
      getDetail();
    }
  } else if (field === "roleId") {
    const service = useService(
      `${API_PATH.USER_PERMISSION}/${API_PATH.RESOURCESBYROLEIDS}` as API_PATH
    );
    const arr = roleIds.value?.split(",");
    const params = {
      appId: appLicationId.value,
      roleIds: arr,
    };
    service.getForSelect(params, "get").then((data) => {
      const response: any = data.value;
      optionsCheckbox.value.data = response.data;
      treeTable.value?.loadData(true);
    });
  }
};

const getDetail = () => {
  if (appLicationId.value) {
    const params = {
      appId: appLicationId.value,
      userId: userId,
    };
    const service = useService(`${API_PATH.USER_PERMISSION}` as API_PATH);
    service.getForSelect(params, "get").then((data) => {
      const res: any = data.value;
      dataPermission.value = res.data;
      optionsCheckbox.value.resource = res.data?.permission.resource;
      roleIds.value = dataPermission.value.permission?.roleIds?.join();
      if (!route.query.tabSelect || route.query.tabSelect === "permission") {
        changeValue("roleId", roleIds.value);
        loadComponent.value.permission = true;
        setTimeout(() => {
          treeTable.value?.loadData();
        });
      } else {
        loadComponent.value[route.query.tabSelect as string] = true;
      }
    });
  }
};

const onSave = async () => {
  if (appLicationId.value) {
    saveData.value = !saveData.value;

    setTimeout(() => {
      savePermission();
    });
  }
};

const backHistory = () => {
  router.push({
    path: `/application/${appLicationId.value}`,
    query: { tabSelect: "user" },
  });
};

watch(
  () => tabSelect.value,
  (value) => {
    router.push({ path: route.path, query: { tabSelect: tabSelect.value } });
    if (value === "permission" && !loadComponent.value.permission) {
      setTimeout(() => {
        treeTable.value?.loadData();
      });
    }
    loadComponent.value[value] = true;
  }
);

watch(
  () => props.save,
  () => {
    onSave();
  }
);

onBeforeMount(() => {
  //check zone + abilities permission to show/hide Zone or Ability tabs
  const { permission } = usePermission();

  const zonePathsCheck = ["/api/province/get/select"];
  const abilityPathsCheck = [
    "/api/organization/get/select",
    "/api/department/get/list",
    "/api/specialize/get/list",
  ];

  const includesAll = (arrayToCheck: string[]): boolean | Function => {
    if (arrayToCheck.length === 0) return true;

    for (let i = 0; i < permission.value?.length; i++) {
      if (!arrayToCheck.includes(permission.value[i])) continue;
      arrayToCheck.splice(arrayToCheck.indexOf(permission.value[i]), 1);
      return includesAll(arrayToCheck);
    }
  };

  const setBoolValue = (bool: boolean, ref: Ref<boolean>) => {
    if (bool) ref.value = true;
    else ref.value = false;
  };

  const shouldDisplayAbilitiesTab = Boolean(includesAll(abilityPathsCheck));
  const shouldDisplayZoneTab = Boolean(includesAll(zonePathsCheck));

  setBoolValue(shouldDisplayZoneTab, displayZoneTab);
  setBoolValue(shouldDisplayAbilitiesTab, displayAbilitiesTab);
});

onMounted(() => {
  getDetail();
});
</script>

<template>
  <!-- Phân quyền người dùng -->
  <div class="card">
    <div class="form-layout">
      <div class="form-head border-b">
        <div class="mt-auto d-flex">
          <h3>
            {{ $t("table.user.authorization") }}:
            {{
              dataPermission.permission?.userInfo?.name ||
              dataPermission.permission?.userInfo?.account
            }}
          </h3>
        </div>
        <div class="flex-grow-1"></div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <slot name="button">
            <NButton color="secondary" prepend-icon="mdi:arrow-left-thin" @click="backHistory()">{{
              $t("goBack")
            }}</NButton>
            <NButton width="116px" @click="onSave"> {{ $t("save") }}</NButton>
          </slot>
        </div>
      </div>
      <div class="form-body">
        <div class="row g-5">
          <div class="col-6">
            <NSelect
              v-model="appLicationId"
              :label="appOp.label"
              :options="appOp.options"
              @update:modelValue="changeValue('appLicationId', $event)"
            >
            </NSelect>
          </div>

          <div class="col-12">
            <NTabs :tabs="tabs" v-model:selected="tabSelect">
              <template #tab="{ activeValue }">
                <div v-show="activeValue == 'permission'" class="row g-5 py-6 px-2">
                  <template v-if="loadComponent.permission">
                    <div class="col-6">
                      <NSelect
                        ref="permissionRole"
                        v-model="roleIds"
                        :label="roleOp.label"
                        :options="roleOp.options"
                        @update:modelValue="changeValue('roleId', $event)"
                      >
                      </NSelect>
                    </div>
                    <div class="col-12">
                      <NTreeTable
                        ref="treeTable"
                        :options="PermissionResourceTableConfig"
                        :is-data-tree="false"
                        :is-load="false"
                        :has-filter="false"
                        :has-select="false"
                        :params="{ appId: appLicationId }"
                        router="/resource"
                        :has-hidden="{
                          add: true,
                          actions: true,
                          checkName: true,
                        }"
                        :options-checkbox="optionsCheckbox"
                      >
                      </NTreeTable>
                    </div>
                  </template>
                </div>
                <div v-show="activeValue === 'zone'">
                  <template v-if="loadComponent.zone">
                    <ZonePermission
                      :app-id="appLicationId"
                      :user-id="`${userId}`"
                      :options="dataPermission.zone"
                      :open="onloadZonePermission"
                      :handleSave="saveData"
                      @data="dataPermission.zone = $event"
                    >
                    </ZonePermission>
                  </template>
                </div>
                <div v-show="activeValue === 'ability'">
                  <template v-if="loadComponent.ability">
                    <AbilityPermission
                      :app-id="appLicationId"
                      :user-id="`${userId}`"
                      :options="dataPermission.ability"
                      :open="onloadAbilityPermission"
                      :handleSave="saveData"
                      @data="dataPermission.ability = $event"
                    >
                    </AbilityPermission>
                  </template>
                </div>
                <div v-show="activeValue === 'profile'">
                  <template v-if="loadComponent.profile">
                    <ExtendProfile
                      :handleSave="saveData"
                      :options="dataPermission"
                      @data="dataPermission.profile = $event"
                    >
                    </ExtendProfile>
                  </template>
                </div>
              </template>
            </NTabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
.form-layout
  .h-100
    height: 100%
  .form-head, .form-footer
    display: flex
    padding: 12px 20px

  .form-body
    padding: 20px 40px 40px

  .border-b
    border-bottom: 1px solid rgb(229, 229, 229)
</style>
