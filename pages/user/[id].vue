<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm
        ref="formEditUser"
        :configs="UsersFormConfig"
        :id="route.params.id"
        @data="onLoad"
        :customSave="onSave"
      >
        <template #avatar="props">
          <div class="row mb-6 min-h-250px">
            <label class="col-lg-4 col-form-label fw-semibold fs-6"> </label>
            <div class="col-lg-8">
              <NCropableAvatar
                :src="avatar"
                :customProps="props"
                @uploaded="uploadAvatar"
              ></NCropableAvatar>
            </div>
          </div>
        </template>
      </NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import API_PATH from "~~/enums/API_PATH";
import UsersFormConfig from "~~/configs/forms/UsersEditFormConfig";
import NForm from "~~/components/base/NForm.vue";
import NCropableAvatar from "~/components/base/NCropableAvatar.vue";

const route = useRoute();
const { t } = useI18n();
const { goBack } = useHistory();
const service = useService(API_PATH.USER);

const avatar = ref<string>("");
const formEditUser = ref<any>(null);

const uploadAvatar = (imageId: string) => {
  avatar.value = imageId;
};

const onLoad = (entity: any) => {
  avatar.value = entity.avatar;
};

const onSave = (data: any) => {
  service
    .update({ ...data, avatar: avatar.value })
    .then((response) => {
      if ((response.value as any).statusCode == 200) {
        useNotify("success", t("updateSucessfully")).show();
        goBack();
      }
    })
    .finally(() => formEditUser.value?.hideLoading());
};
</script>
<style scoped>
.min-h-250px {
  min-height: 250px !important;
}
</style>
