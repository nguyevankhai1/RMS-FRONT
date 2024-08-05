<template>
  <!-- modal for selecting image to crop -->
  <NModal
    v-model="openModal"
    :title="'Update Avatar'"
    @confirm="confirm"
    @update:model-value="closeCroppingModal"
  >
    <template #body>
      <div class="mb-5">
        <div class="crop-img-container">
          <img class="img-fluid" :src="imageToCrop || ''" ref="imgElement" />
        </div>
      </div>
      <input
        type="file"
        ref="inputElement"
        accept=".jpg, .jpeg, .png"
        @change="selectImage"
        class="d-none"
      />
    </template>
  </NModal>

  <!-- after cropping start -->
  <div class="col-12">
    <div class="image-input image-input-outline">
      <img
        style="border-radius: 0.475rem"
        :src="croppedImage"
        class="img-fluid image-input-wrapper w-200px h-200px"
      />
      <label
        class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
        data-kt-image-input-action="change"
        @click="openSelectWindow"
      >
        <NIcon name="mingcute:pencil-line" size="15px"></NIcon>
      </label>
      <label
        class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
        data-kt-image-input-action="remove"
        @click="removeFile"
      >
        <NIcon name="material-symbols:close" size="15px"></NIcon>
      </label>
    </div>
    <div class="form-text">
      <p>
        {{ $t("allowedFileExtensions") }}:
        <span v-for="(fileType, index) in typeFile.accept" :key="fileType">
          {{
            `${fileType}${
              index !== typeFile.accept.length - 1 ? "," + " " : "."
            }`
          }}
        </span>
      </p>
    </div>
  </div>
  <!-- end -->
</template>

<script lang="ts" setup>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

import NIcon from "~~/components/base/NIcon.vue";
import NModal from "~/components/base/NModal.vue";

import API_PATH from "~~/enums/API_PATH";

interface DataSuccess {
  data: {
    base64: string;
    fileName: string;
    mediaType: string;
  };
  message: "" | string;
  statusCode: "200";
}

const props = defineProps({
  imgRatio: {
    type: Number,
    default: 1,
  },
  croppedWidth: {
    type: Number,
    default: 200,
  },
  croppedHeight: {
    type: Number,
    default: 200,
  },
  src: {
    type: String as PropType<string>,
    default: "",
  },
  customProps: {
    type: Object,
    default: () => {},
  },
});

//instance of input field acting like a button
const inputElement = ref<HTMLInputElement | null>(null);
const emits = defineEmits(["uploaded"]);
const selectedFile = ref(null);
const imageToCrop = ref<string>("");
const imgElement = ref<HTMLImageElement | null>(null);

// after cropping start
const openModal = ref<boolean>(false);

const defaultSrc = "/img/avatar-default.png";
const croppedImage = ref<string>(defaultSrc);
const typeFile = ref({
  accept: ["png", "jpg", "jpeg"],
});
// after cropping end

let cropper: any = null;

const onOpenModal = () => {
  openModal.value = true;
  setTimeout(() => {
    cropper = new Cropper(imgElement.value!, {
      aspectRatio: props.imgRatio,
      minCropBoxWidth: 200,
      minCropBoxHeight: 200,
      autoCropArea: 0.5,
      viewMode: 3,
      dragMode: "move",
      background: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
    });
    cropper.replace(imageToCrop.value);
  }, 200);
};

const openSelectWindow = () => {
  inputElement.value!.click();
};

const removeFile = () => {
  croppedImage.value = defaultSrc;
  props.customProps.data[props.customProps.option.key] = "";
};

const fileReader = new FileReader();
fileReader.onload = (event: any) => {
  imageToCrop.value = event.target.result;
  onOpenModal();
};

const selectImage = (changeEvent: any) => {
  const files = changeEvent.target!.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
    fileReader.readAsDataURL(files[0]);
  }
};

const setDefaultSrc = () => {
  croppedImage.value = defaultSrc;
};

const onCustomResponse = (response: any) => {
  const imageData: any = response.response._data;
  if (imageData.statusCode === "200") {
    const {
      data: { base64, mediaType },
    } = imageData as DataSuccess;
    croppedImage.value = `data:${mediaType};base64,${base64}`;
  } else setDefaultSrc();
};

const setImgSrc = (id?: string) => {
  const path = API_PATH.FILE_DOWNLOAD as API_PATH;
  useAPI({
    path,
    onCustomResponse,
  })._get({ id: id || props.src });
};

const uploadImage = async (image: FormData) => {
  const { data } = await useAPI({ path: API_PATH.FILE_UPLOAD })._post(image);
  setImgSrc(data.value.data.data.fileDownloadUri);
  emits("uploaded", data.value.data.data.fileDownloadUri);
};

const onCrop = () => {
  cropper
    .getCroppedCanvas({
      width: props.croppedWidth,
      height: props.croppedHeight,
      imageSmoothingQuality: "high",
    })
    .toBlob((blob: Blob) => {
      //convert image blob to regular image
      if (blob) {
        const imageFile = new File([blob], "avatar.jpeg", { type: blob.type });
        const formData = new FormData();
        formData.append("file", imageFile);
        uploadImage(formData);
      }
    }, "image/jpeg");
};

const closeCroppingModal = () => {
  selectedFile.value = null;
  imageToCrop.value = "";
  openModal.value = false;

  const modal = document.getElementsByClassName("cropper-container")[0];
  modal && modal.remove();
  cropper.destroy();
};

const confirm = () => {
  onCrop();
  closeCroppingModal();
};

const setSrcImg = () => {
  if (!props.src) setDefaultSrc();
  else setImgSrc();
};
setSrcImg();

watch(
  () => props.src,
  () => {
    setSrcImg();
  }
);
</script>

<style lang="sass" scoped>


.crop-img-container
  width: 400px
  margin: 0 auto
</style>
