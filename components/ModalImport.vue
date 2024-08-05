<template>
  <div class="mx-3">
    <NButton
      v-if="props.options.import"
      size="sm"
      color-icon="white"
      class="btn dropdown-toggle py-3"
      data-bs-toggle="dropdown"
    >
      {{ $t("import-export") }}
    </NButton>
    <ul class="dropdown-menu">
      <li class="dropdown-item cursor-pointer btn-file">
        <BaseNIcon name="material-symbols:ios-share" size="14" class="mb-1"></BaseNIcon>
        {{ $t("import") }}
        <input type="file" accept=".xlsm, .xlsx , .xls , .json" @change="onSelectFile" />
      </li>
      <li>
        <hr class="dropdown-divider cursor-pointer" />
      </li>
      <li class="dropdown-item cursor-pointer" @click="handleExport('export')">
        <BaseNIcon name="material-symbols:place-item" size="14" class="mb-1"></BaseNIcon>
        {{ $t("export") }}
      </li>
    </ul>
  </div>
  <NModal v-model="openImport" :title="$t('import')" labelSave="import" @confirm="onImportFile()">
    <template #body>
      <div style="min-height: 300px">
        <div>
          <div class="mb-5">
            <NInput
              :label="$t('applicationPage.id')"
              v-model:model-value="params.appId"
              disabled
            ></NInput>
          </div>
          <div class="mb-5">
            <NInput :label="$t('forms.importFile.prefix')" v-model.required="importPrefix"></NInput>
            <span class="suggestion">
              {{ $t("forms.importFile.example") }}: [{{
                `${$t("forms.importFile.prefix")} api`.toLocaleLowerCase()
              }}]/update ---> o/update</span
            >
          </div>
          <div class="mb-5">
            <div>
              <label class="form-label">{{ $t("forms.importFile.methodAPIs") }} </label>
              <NTag
                :placeholder="$t('forms.importFile.methodAPIs')"
                :modelValue="inputTags"
                @update:modelValue="getTags"
                :suggestion="'view,update,import,template,add,export,delete,replace,reject,approve'"
              ></NTag>
            </div>
          </div>
        </div>
        <p>{{ $t("forms.importFile.selectedFile") }}: {{ fileToImport }}</p>
      </div>
    </template>
  </NModal>
</template>

<script lang="ts" setup>
import API_PATH from "~~/enums/API_PATH";
import NButton from "~~/components/base/NButton.vue";
import NModal from "~~/components/base/NModal.vue";
import NInput from "~~/components/base/NInput.vue";
import NTag from "~~/components/base/NTag.vue";
import type { Tag } from "~~/components/base/NTag.vue";

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});

const { t } = useI18n();
const emits = defineEmits(["loadData"]);

const service = useService(props.options.url);

const openImport = ref<boolean>(false);
const inputTags = ref<Tag[]>([]);
const importPrefix = ref<string>("");
const fileToImport = ref<string>("");
const fileToSend = ref<FormData>();

const getTags = (tags: Tag[]) => (inputTags.value = tags);

const onSelectFile = async (event: any) => {
  const formData = new FormData();
  const file = event.target.files[0];
  if (file) {
    formData.append("file", file);
    fileToImport.value = file.name;
    fileToSend.value = formData;
    if (props.options.hideModalImport) {
      onImport();
    } else {
      openImport.value = true;
    }
  }
  event.target.value = "";
};

const importFile = async (path: API_PATH) => {
  try {
    const { data }: any = await useAPI({ path })._post(fileToSend.value);
    if ((data.value.data || []).length === 0) return;
    emits("loadData");
    useNotify("success", t("updateSucessfully")).show();
  } catch (error) {
    console.log("error: ", error);
  }
};

const onImport = async () => {
  importFile(`${service.path}/import` as API_PATH);
};

const onImportFile = async () => {
  const prefixQuery = importPrefix.value.length > 0 ? `&prefix=${importPrefix.value}` : "";
  const methodsApisQueries = inputTags.value.reduce(
    (prev, next) => prev.concat(`&methodApis=${next.name}`),
    ""
  );
  const path = `?appId=${props.params.appId}${prefixQuery}${methodsApisQueries}`;

  importFile(`${service.path}/import${path}` as API_PATH);

  openImport.value = false;
};

const handleExport = async (action: string) => {
  let params = {};
  if (action === "export") {
    params = {
      type: "excel",
      appId: props.params.appId,
    };
  }
  const { data }: any = await useAPI({
    path: `${service.path}/${action}` as API_PATH,
  })._get(params);
  saveAs(data.value);
};

const saveAs = (response: any) => {
  const FILE = `data:${response.data.mediaType};base64,${response.data.base64}`;
  const docUrl = document.createElement("a");
  document.body.appendChild(docUrl);
  docUrl.href = FILE;
  docUrl.download = response.data.fileName;
  docUrl.click();
};
</script>
