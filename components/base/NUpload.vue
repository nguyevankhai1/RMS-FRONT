<template>
  <div class="file-upload">
    <label class="file-input">
      <NIcon :name="iconUpload" size="18"></NIcon>
      {{ label }}
      <input
        :multiple="multiple"
        type="file"
        ref="inputFile"
        name="inputFile"
        :accept="accept"
        @change="handleFileChange($event)"
      />
    </label>
    <!-- preview/download files -->
    <template v-if="files.length > 0">
      <template v-if="onThumbnail">
        <div class="thumbnail-preview-container">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="thumb-item"
            :class="isUpload ? 'thumb-item-uploaded' : 'thumb-item-error'"
          >
            <div class="thumb-img">
              <img
                v-if="file.isImage"
                :src="file.downloadUrl"
                alt="preview upload files"
              />
              <svg
                class="file-img"
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14 4H6v16h12V8h-4V4zm2 7v4c0 2.21-1.79 4-4 4s-4-1.79-4-4V9.5a2.5 2.5 0 0 1 5 0V15h-2V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V15c0 1.1.9 2 2 2s2-.9 2-2v-4h2z"
                  opacity=".3"
                />
                <path
                  fill="currentColor"
                  d="M14 15c0 1.1-.9 2-2 2s-2-.9-2-2V9.5c0-.28.22-.5.5-.5s.5.22.5.5V15h2V9.5a2.5 2.5 0 0 0-5 0V15c0 2.21 1.79 4 4 4s4-1.79 4-4v-4h-2v4z"
                />
                <path
                  fill="currentColor"
                  d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h8v4h4v12z"
                />
              </svg>
            </div>
            <div class="thumb-detail">
              <div class="thumb-size">
                <span
                  ><strong>{{ `${file.fileSize}` }}</strong
                  >{{ ` MB` }}</span
                >
              </div>
              <div class="thumb-filename">
                <span
                  title="Click to download file"
                  @click="downloadFile(file)"
                  >{{ file.fileFullName }}</span
                >
              </div>
              <div class="thumb-action">
                <div
                  class="thumb-delete"
                  title="Delete file"
                  @click="handleDeleteFile(file, index)"
                >
                  <NIcon name="material-symbols:delete" size="22"></NIcon>
                </div>
              </div>
            </div>
            <div class="thumb-process"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="file-preview-container">
          <div v-for="(file, index) in files" :key="index" class="file-preview">
            <img
              v-if="file.isImage"
              class="file-img"
              :src="file.downloadUrl"
              alt="preview upload files"
            />
            <svg
              class="file-img"
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="55"
              height="55"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M14 4H6v16h12V8h-4V4zm2 7v4c0 2.21-1.79 4-4 4s-4-1.79-4-4V9.5a2.5 2.5 0 0 1 5 0V15h-2V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V15c0 1.1.9 2 2 2s2-.9 2-2v-4h2z"
                opacity=".3"
              />
              <path
                fill="currentColor"
                d="M14 15c0 1.1-.9 2-2 2s-2-.9-2-2V9.5c0-.28.22-.5.5-.5s.5.22.5.5V15h2V9.5a2.5 2.5 0 0 0-5 0V15c0 2.21 1.79 4 4 4s4-1.79 4-4v-4h-2v4z"
              />
              <path
                fill="currentColor"
                d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h8v4h4v12z"
              />
            </svg>
            <a
              @click="downloadFile(file)"
              class="file-name"
              title="Click to download file"
              >{{
                `${file.fileFullName} -
                          ${file.fileSize}MB`
              }}</a
            >
            <div class="file-delete" @click="handleDeleteFile(file, index)">
              <NIcon name="material-symbols:delete" size="22"></NIcon>
            </div>
          </div>
        </div>
      </template>
    </template>
    <!-- error message -->
    <div v-if="errors.length > 0">
      <div
        class="file-upload__error"
        v-for="(error, index) in errors"
        :key="index"
      >
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import API_PATH from "~~/enums/API_PATH";
import NIcon from "~~/components/base/NIcon.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => {
      [];
    },
    required: true,
  },
  label: {
    type: String,
    default: "Choose Files",
    required: false,
  },
  iconUpload: {
    type: String,
    default: "ic:outline-file-upload",
    required: false,
  },
  maxSize: {
    type: Number,
    default: 5,
    required: false,
  },
  accept: {
    type: String,
    default: "*" || "image/png, image/jpeg, image/jpg, video/", // * for all files, ex: "image/png, image/jpeg, image/jpg, video/* ...
    required: false,
  },
  acceptExtension: {
    type: String,
    default: "*" || "jpg, jpeg, png, gif", // * for all files, ex: "jpg, gif, pdf, doc, xlsx ...
    required: false,
  },
  multiple: {
    type: Boolean,
    default: false,
    required: false,
  },
  isPreview: {
    // use for preview files after upload
    type: Boolean,
    default: false,
    required: false,
  },
  onThumbnail: {
    // to use this props, make sure isPreview = true
    type: Boolean,
    default: false,
    required: false,
  },
});

watch(
  props.modelValue,
  async (newValue, oldValue) => {
    console.log("modelValue changed!!!", newValue);
    const fileLinks: any = newValue;
    // get file data
    let listFiles: any = [];
    for (let i = 0; i < fileLinks.length; i++) {
      const fileContent = await new Promise((resolve) => {
        useAPI({
          path: fileLinks[i] as API_PATH,
        })
          ._get()
          .then((value: any) => {
            const response: any = value.data.value;
            const fileName: any = fileLinks[i].split("/").reverse()[0];
            const file: any = {
              fileSize: Math.round((response.size / 1024 / 1024) * 100) / 100,
              fileExtention: fileName.split(".").pop(),
              fileName: fileName.split(".").shift(),
              fileFullName: fileName,
              isImage: ["jpg", "jpeg", "png", "gif"].includes(
                fileName.split(".").pop()
              ),
              downloadUrl: URL.createObjectURL(
                new Blob([response], { type: response.type })
              ),
            };
            listFiles = [...listFiles, getInfoFile(file)];
            resolve("");
          });
      });
    }
    files.value = listFiles;
    isUpload.value = true;
  },
  { immediate: true }
);

const emit = defineEmits(["update:modelValue"]);

let files = ref<any>([]);
let errors = ref<any>([]);
let isUpload = ref<any>(false);

const inputFile = ref<any>();

const downloadFile = async (file: any) => {
  // func download file
  const { data, error, pending } = await useAPI({
    path: `${API_PATH.FILE_DOWNLOAD}/${file.fileFullName}` as API_PATH,
  })._get();

  const response: any = data;

  const FILE = window.URL.createObjectURL(
    new Blob([response.value], { type: response.value.type })
  );
  const docUrl: any = document.createElement("a");
  docUrl.href = FILE;
  docUrl.setAttribute("download", file.fileFullName);
  document.body.appendChild(docUrl);
  docUrl.click();
};

const handleFileChange = (e: any) => {
  // func handle when user selects file
  console.log("input file changed");
  errors.value = [];
  // files.value = [];
  isUpload.value = false;

  // Check if file is selected
  if (e.target.files && e.target.files[0]) {
    // check file valid
    let fileInfos: any = [];

    for (let file of e.target.files) {
      fileInfos = [...fileInfos, getInfoFile(file)];
    }
    console.log("fileInfos", fileInfos);

    if (!fileInfos.some((x: any) => isFileValid(x))) {
      inputFile.value.value = "";
      return;
    }
    files.value = [...files.value, ...fileInfos];
    console.log("files", files.value);

    // Upload the file to the server
    uploadToServerMul(e.target.files);
  }
};
const getInfoFile = (file: any) => {
  return {
    fileSize: Math.round((file.size / 1024 / 1024) * 100) / 100,
    fileExtention: file.name.split(".").pop(),
    fileName: file.name.split(".").shift(),
    fileFullName: file.name,
    isImage: ["jpg", "jpeg", "png", "gif"].includes(file.name.split(".").pop()),
    downloadUrl: URL.createObjectURL(file),
  };
};
const uploadToServerMul = async (listFiles: any) => {
  // func upload files after user selected its
  const listRes = ref<any>([]);

  for (let i = 0; i < listFiles.length; i++) {
    const formData = new FormData();
    formData.append("file", listFiles[i]);

    const linkFile = await new Promise((resolve) => {
      useAPI({
        path: API_PATH.FILE_UPLOAD,
      })
        ._post(formData)
        .then((value: any) => {
          return resolve(value.data.value.fileDownloadUri);
        });
    });
    listRes.value = [...listRes.value, linkFile];
  }
  isUpload.value = true;
  emit("update:modelValue", listRes.value);
};

const handleDeleteFile = function (file: any, index: any) {
  files.value = files.value.filter((x: any, i: number) => i != index);
};

const isFileValid = (file: any) => {
  // func check valid files
  isFileSizeValid(file);
  isFileTypeValid(file);
  if (errors.value.length === 0) {
    return true;
  } else {
    return false;
  }
};

const isFileSizeValid = (file: any) => {
  if (file.fileSize <= props.maxSize) {
    return;
  }
  errors.value = [
    ...errors.value,
    `File ${file.fileName} size should be less than ${props.maxSize} MB`,
  ];
};

const isFileTypeValid = (file: any) => {
  if (
    props.acceptExtension === "*" ||
    props.acceptExtension
      .replace(/\s/g, "")
      .split(",")
      .includes(file.fileExtention)
  ) {
    return;
  }
  errors.value = [
    ...errors.value,
    `File ${file.fileName} type should be ${props.acceptExtension}`,
  ];
};
</script>

<style lang="sass" scoped>
@import '~~/assets/sass/_upload.sass'
</style>
