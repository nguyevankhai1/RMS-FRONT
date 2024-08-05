<template>
  <div class="container-xxl">
    <div class="card">
      <NTable :options="UsersTableConfig">
        <template #avatar="props">
          <div class="cursor-pointer symbol symbol-35px symbol-lg-35px">
            <NAvatar :src="props.entity.avatar" :rounded="true"></NAvatar>
          </div>
        </template>
        <template #status="props">
          <NSwitchButton
            :data="props.entity || false"
            :status="checkStatus(props.entity.status)"
            :confirm="true"
            @switch-toggle="confirmChangeStatus"
            @confirm-true="changeUserStatus"
          ></NSwitchButton>
        </template>
        <template #action="props">
          <NIcon
            v-if="isAdmin && hasPermission('change/password')"
            name="ic:sharp-lock-reset"
            size="24"
            color="#008BD9"
            @click="resetPassword(props)"
          >
          </NIcon>
        </template>
      </NTable>

      <NModal
        v-model="openForm"
        :footer="false"
        labelSave="update"
        size="sm"
        :title="$t('password.change')"
      >
        <template #body>
          <form class="cp_form" @submit.prevent="confirm()">
            <div class="form_group">
              <label class="label" for="name"> {{ $t("password.new") }}</label>
              <input
                v-model="newPassword"
                type="password"
                class="form-control"
                placeholder=" "
                required
                autocomplete="new-password"
              />
            </div>
            <div class="form_group">
              <label class="label" for="name">
                {{ $t("password.confirm") }}</label
              >
              <input
                v-model="confirmPassword"
                type="password"
                class="form-control"
                placeholder=" "
                required
                autocomplete="new-password"
              />
            </div>
            <div
              class="modal-footer"
              style="padding-right: 0; padding-bottom: 0;"
            >
              <NButton
                data-bs-dismiss="modal"
                color="secondary"
                @click="openForm = false"
              >
                {{ $t("close") }}
              </NButton>
              <button type="submit" class="btn btn-primary cp_submit">
                {{ $t("update") }}
              </button>
            </div>
          </form>
        </template>
      </NModal>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserUpdateParams {
  id: string | null;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  status: boolean;
}

import API_PATH from "~/enums/API_PATH";
import UsersTableConfig from "~~/configs/tables/UsersTableConfig";
import NAvatar from "~~/components/base/NAvatar.vue";
import NTable from "~~/components/base/NTable.vue";
import NIcon from "~~/components/base/NIcon.vue";
import NModal from "~~/components/base/NModal.vue";
import NButton from "~~/components/base/NButton.vue";
import NSwitchButton from "~~/components/base/NSwitchButton.vue";

const { t } = useI18n();
const userInfo = ref<any>();
const openForm = ref(false);
const newPassword = ref();
const confirmPassword = ref();
const userId = ref();
const isAdmin = ref<boolean>(useUserRole().role.value.includes("ROLE ADMIN"));
const route = useRoute();

const confirmChangeStatus = (userData: any) => {
  userInfo.value = userData;
};

const changeUserStatus = () => {
  if (!userInfo.value.id) {
    useNotify("danger", t("noUserId")).show();
    return;
  } else {
    const params: UserUpdateParams = {
      id: userInfo.value.id,
      name: userInfo.value.name,
      avatar: userInfo.value.avatar,
      phone: userInfo.value.phone,
      status: userInfo.value.status,
    };

    const userService = useService(API_PATH.USER);
    userService.update(params).then((response) => {
      if ((response.value as any).statusCode != 200) return;
      useNotify("success", t("updateSucessfully")).show();
    });
  }
};

const hasPermission = (action: string) => {
  const { permission, pathNoLang } = usePermission();
  const apis = [...permission.value];
  let parserPath = `${route.path}/${action}`;
  parserPath = parserPath.replace("them-moi", "create");
  if (route.params.id) {
    const arr = parserPath.split(`${route.params.id}`);
    if ((arr[1] || []).length) {
      parserPath = parserPath.replace(`/${route.params.id}`, "");
    } else parserPath = parserPath.replace(`${route.params.id}`, "update");
  }
  return apis.filter((e: any) => e === "/api" + pathNoLang(parserPath)).length !== 0;
};

const resetPassword = (row: any) => {
  userId.value = row.entity.id
  openForm.value = true
}

const confirm = () => {
  if (confirmPassword.value !== newPassword.value) {
    useNotify("danger", t("password.invalidRetypePassword")).show();
    return;
  }
  const path = API_PATH.USER_CHANGE_PASSWORD;
   useAPI({
    path,
  })._put({ userId:  userId.value , newPassword: newPassword.value}).then((response) => {
      if ((response.data.value as any).statusCode != 200) return;
      openForm.value = false
      useNotify("success", t("updateSucessfully")).show();
    });
}

const checkStatus = (status: any) => {
  if (status == null) {
    return true
  }
  return status
}
</script>

<style lang="sass" scoped>
.form_group
  margin-bottom: 15px
</style>
