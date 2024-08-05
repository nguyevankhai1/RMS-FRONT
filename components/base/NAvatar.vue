<script lang="ts" setup>
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
  src: {
    type: String as PropType<string>,
    default: "",
  },
  styles: {
    type: Object,
  },
  rounded: {
    type: Boolean,
  },
  view: {
    type: Boolean,
    default: true,
  },
});

const defaultSrc = "/img/avatar-default_35x35.png";
const imagePath = ref<string>(defaultSrc);

const setDefaultSrc = () => {
  imagePath.value = defaultSrc;
};

const onCustomResponse = (response: any) => {
  const imageData: any = response.response._data;
  if (imageData.statusCode === "200") {
    const {
      data: { base64, mediaType },
    } = imageData as DataSuccess;
    imagePath.value = `data:${mediaType};base64,${base64}`;
  } else setDefaultSrc();
};

const setImgSrc = () => {
  const path = API_PATH.FILE_DOWNLOAD as API_PATH;
  useAPI({
    path,
    onCustomResponse,
  })._get({ id: props.src });
};

const handleError = (error: ErrorEvent) => {
  if (error.type === "error") setDefaultSrc();
};

// const onError = (error: ErrorEvent) => handleError(error);

const fetchImg = () => {
  const img: any  = new Image();
  img.src = props.src;
  if (img.complete) return;
  img.onerror = (error: ErrorEvent) => handleError(error);
};

const checkInvalidSrc = () => {
  return !props.src || props.src === defaultSrc;
};

(() => {
  if (checkInvalidSrc()) setDefaultSrc();
  else setImgSrc();
})();

watch(props, () => {
  if (checkInvalidSrc()) setDefaultSrc();
  else {
    setImgSrc();
    fetchImg();
  }
});
</script>

<template>
  <img
    v-view="view && props.src && imagePath !== defaultSrc"
    :src="imagePath"
    :style="{ ...styles }"
    class="img-fluid"
  />
</template>

<style lang="sass" scoped>
.img-fluid
  max-width: 500px

@media (max-width: 575px)
  .img-fluid
    max-width: 86vw
</style>
