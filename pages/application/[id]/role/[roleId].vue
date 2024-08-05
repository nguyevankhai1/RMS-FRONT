<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        ref="formEditRole"
        :configs="RoleFormConfig"
        :id="route.params.roleId"
        :params="{ applicationId: route.params.id }"
        :customSave="onSave"
      >
        <template #role>
          <h3>{{ $t("applicationPage.permissionListOfRole") }}</h3>
          <div class="container">
            <div class="row">
              <div class="col-5">
                <p class="text-uppercase mt-4 text-center">
                  {{ $t("applicationPage.authorizedFunctionsList") }}
                </p>
                <div
                  class="py-6 tree-wrapper parent"
                  v-loading.spinner="loadingPermiss"
                  v-if="loadingPermiss"
                ></div>
                <div
                  v-else
                  class="py-6 tree-wrapper parent"
                  :class="click.finalValue === 'permiss' ? 'blink' : ''"
                >
                  <tree
                    :key="renderKeyPermiss"
                    :data="permiss"
                    @tree-data="onCheckPermiss"
                  ></tree>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-center mt-12">
                <div class="mt-12">
                  <p>
                    <NButton
                      width="80px"
                      @click="moveToPermiss"
                      :disabled="!imper.length"
                    >
                      <NIcon name="ic:baseline-add" size="17" />
                    </NButton>
                  </p>
                  <p>
                    <NButton
                      width="80px"
                      @click="moveToImpermiss"
                      :disabled="!permiss.length"
                      ><NIcon name="ic:baseline-minus" size="17"
                    /></NButton>
                  </p>
                </div>
              </div>
              <div class="col-5">
                <p class="text-uppercase mt-4 text-center">
                  {{ $t("applicationPage.unauthorizedFunctionsList") }}
                </p>
                <div
                  v-if="loadingImper"
                  v-loading.spinner="loadingImper"
                  class="py-6 tree-wrapper"
                ></div>
                <div
                  v-else
                  class="py-6 tree-wrapper"
                  :class="click.finalValue === 'imper' ? 'blink' : ''"
                >
                  <tree
                    :key="renderKeyImper"
                    :data="imper"
                    :disabledIds="disabledIds"
                    @tree-data="onCheckImper"
                  ></tree>
                </div>
              </div>
            </div>
          </div>
        </template>
      </NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoleFormConfig from "~~/configs/forms/RoleFormConfig";
import API_PATH from "~/enums/API_PATH";
import { MyTreeData } from "~~/utils/typetree";
import NButton from "~~/components/base/NButton.vue";
import NForm from "~~/components/base/NForm.vue";
import NIcon from "~~/components/base/NIcon.vue";

interface EmitData {
  newTreeItems: MyTreeData[];
  remainingItems: MyTreeData[];
}

interface Click {
  softValue: "permiss" | "imper" | "";
  finalValue: "permiss" | "imper" | "";
}

const route = useRoute();
const { t } = useI18n();
const { goBack } = useHistory();

const renderKeyImper = ref<number>(0);
const renderKeyPermiss = ref<number>(0);
const click = ref<Click>({ softValue: "", finalValue: "" });

const permiss = ref<MyTreeData[]>([]);
const tempPermiss = ref<MyTreeData[]>([]);
const imper = ref<MyTreeData[]>([]);
const tempImper = ref<MyTreeData[]>([]);
const loadingPermiss = ref<Boolean>(true);
const loadingImper = ref<Boolean>(true);
const disabledIds = ref<any>([])

const formEditRole = ref<any>(null);
const allListResoure = ref<any>([]);
const { id, roleId } = route.params;

// DANH SÁCH CHỨC NĂNG ĐÃ PHÂN QUYỀN
const roleResourceService = useService(`${API_PATH.ROLE}/roleResource` as API_PATH);

const getAuthorizedData = async () => {
  const data: any = await roleResourceService.finBy({ roleId });
  permiss.value = data.value.data;
  loadingPermiss.value = false;
  getUnauthorizedData();
};
getAuthorizedData();

// DANH SÁCH CHỨC NĂNG CHƯA PHÂN QUYỀN
const getMissingParents = (arg: MyTreeData[]) => {
  const ids = arg.map((r) => r.id);
  // find parent items in the arg array
  const missingParent = arg.reduce((prev: MyTreeData[], { parentId }) => {
    if (parentId !== null && !ids.includes(parentId)) {
      const parent = permiss.value.find((item) => item.id === parentId);
      if (!parent) return prev;
      //if parent is not already added in prev, then add it in
      const isAlreadyExists = prev.find((item) => item.id === parent.id);
      if (isAlreadyExists) return prev;
      return [...prev, parent];
    }

    return prev;
  }, []);

  return missingParent;
};

const getUnauthorizedData = async () => {
  const unauthorizedList = useService(API_PATH.RESOURCE);
  if (allListResoure.value.length == 0) {
    const data: any = await unauthorizedList.getByPage({ appId: id });
    allListResoure.value = data.value.data;
  }
  const authorizedDataIds = permiss.value.map((v) => v.id);
  const unauthorizedItems: MyTreeData[] = allListResoure.value.filter(
    (item: MyTreeData) => !authorizedDataIds.includes(item.id)
  );
  // imper.value = [...unauthorizedItems, ...getMissingParents(unauthorizedItems)];
  imper.value = getUniqueItems(allListResoure.value);
  loadingImper.value = false;
};

const swapData = (newTreeItems: MyTreeData[], remainingItems: MyTreeData[]) => {
  tempImper.value = newTreeItems;
  tempPermiss.value = remainingItems;
};

const onCheckPermiss = (item: EmitData) => {
  renderKeyImper.value++;
  click.value.softValue = "imper";
  swapData(item.newTreeItems, item.remainingItems);
};

const onCheckImper = (item: EmitData) => {
  renderKeyPermiss.value++;
  click.value.softValue = "permiss";
  swapData(item.remainingItems, item.newTreeItems);
};

const resetTempValues = () => {
  renderKeyPermiss.value++;
  renderKeyImper.value++;
  tempImper.value = [];
  tempPermiss.value = [];
};

const moveItems = (permissItems: MyTreeData[], imperItems: MyTreeData[]) => {
  permiss.value = getUniqueItems(permissItems);
  // imper.value = getUniqueItems(imperItems);
  resetTempValues();
  setTimeout(() => (click.value = { softValue: "", finalValue: "" }), 750);
};

const moveToPermiss = () => {
  if (!click.value.softValue) return;
  if (tempPermiss.value.length && click.value.softValue !== "permiss") return;
  click.value.finalValue = "permiss";
  permiss.value.forEach((e) => {
    tempPermiss.value = tempPermiss.value.filter((m) => m.id !== e.id);
  });
  moveItems([...tempPermiss.value, ...permiss.value], tempImper.value);
};

const moveToImpermiss = () => {
  if (!click.value.softValue) return;
  if (tempImper.value.length && click.value.softValue !== "imper") return;
  click.value.finalValue = "imper";
  moveItems(tempPermiss.value, [...tempImper.value, ...imper.value]);
};

const update = async (dataToUpdate: any, service: any) => {
  const { value } = await service.update(dataToUpdate);
  if (value.statusCode === "200" && value.data !== null) return value.data;
};

const onSave = async (formValue: any) => {
  const dataToSend = permiss.value.map((item) => ({
    roleId,
    resourceId: item.id,
  }));

  Promise.all([
    update(formValue, useService(API_PATH.ROLE)),
    update(dataToSend, roleResourceService),
  ])
    .then((promises) => {
      if (promises.every((promise) => promise !== undefined)) {
        useNotify("success", t("updateSucessfully")).show();
        goBack();
      } else {
        throw new Error(t("updateUnsuccessfully"));
      }
    })
    .catch((error) => console.log("error: ", error))
    .finally(() => formEditRole.value?.hideLoading());
};
watch(
  () => permiss.value,
  () => { disabledIds.value = permiss.value.map((e) => e.id)
  });
</script>

<style scoped lang="sass">
.tree-wrapper
  border: 1px solid rgb(0, 163, 255)
  border-radius: 6px
  min-height: 170px

  .no-data
    padding-left: 20px
.blink
  animation: blinkEffect 0.75s ease-out 1

@keyframes blinkEffect
  0%
    opacity: 0

  50%
    opacity: 0.5

  100%
    opacity: 1

.container
  padding: 0
</style>
