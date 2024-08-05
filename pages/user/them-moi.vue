<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <NForm :configs="UsersFormConfig" :params="{ applicationId: appId() }">
        <template #avatar="props">
          <div class="row mb-6 min-h-249px">
            <label class="col-lg-4 col-form-label fw-semibold fs-6"> </label>
            <div class="col-lg-8">
              <div class="image-input image-input-outline">
                <NAvatar :src="avatar" :class="'image-input-wrapper w-200px h-200px'"></NAvatar>
                <label
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                >
                  <NIcon name="mingcute:pencil-line" size="15px"></NIcon>
                  <input
                    type="file"
                    name="avatar"
                    accept=".png, .jpg, .jpeg"
                    @input="selectedFile($event, props)"
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>
                <span
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                >
                  <NIcon name="mingcute:pencil-line" size="15px"></NIcon>
                </span>
                <span
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  @click="removeFile(props)"
                >
                  <NIcon name="material-symbols:close" size="15px"></NIcon>
                </span>
              </div>
              <div class="form-text">
                <p>
                  {{ $t("allowedFileExtensions") }}:
                  <span v-for="(fileType, index) in typeFile.accept" :key="fileType">
                    {{ `${fileType}${index !== typeFile.accept.length - 1 ? "," + " " : "."}` }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </template>
      </NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import API_PATH from "~~/enums/API_PATH";

import UsersFormConfig from "~~/configs/forms/UsersFormConfig";
import NAvatar from "~~/components/base/NAvatar.vue";
import NIcon from "~~/components/base/NIcon.vue";
import NForm from "~~/components/base/NForm.vue";

const { t } = useI18n();

UsersFormConfig.columns[0].fields[1].type = "text";
UsersFormConfig.columns[0].fields[2].type = "password";

const typeFile = ref({
  accept: ["png", "jpg", "jpeg"],
});
const avatar = ref<string>("");
const selectedFile = async (_event: any, props: any) => {
  const formData = new FormData();
  const file = _event.target.files[0];
  if (onCheckTypeFile(file)) {
    const TYPE = typeFile.value.accept.join();
    useNotify("warning", `${t("pleaseSelectValidFileExtension")} (${TYPE}.)`).show();
    return;
  }

  if (file) {
    formData.append("file", file);
    const { data } = await useAPI({ path: API_PATH.FILE_UPLOAD })._post(formData);
    avatar.value = props.data[props.option.key] = (data.value as any).data.data.fileDownloadUri;
  }
};

const onCheckTypeFile = (file: File) => {
  let output = true;
  for (let i = 0; i < typeFile.value.accept.length; i++) {
    const element = typeFile.value.accept[i];
    if (!element) continue;
    if (file.name.includes(element) || file.type.includes(element)) {
      output = false;
    }
  }
  return output;
};

const removeFile = (props: any) => {
  avatar.value = props.data[props.option.key] = "";
};

const appId = () => {
  return useUserZone().zone.value.appId;
};
</script>
<style scoped>
.min-h-249px {
  min-height: 249px !important;
}
</style>
