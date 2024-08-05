<template>
  <section>
    <div :id="randomId" class="carousel slide" data-bs-ride="carousel">
      <div
        class="carousel-inner"
        style="width: 100%"
        :style="{ height: customHeight }"
      >
        <div
          class="carousel-item"
          v-for="(path, idx) in resolvedPath"
          :key="path"
          :class="{ active: idx === 0 }"
        >
          <img
            :src="path"
            class="d-block w-100"
            :alt="validArray ? 'slide image' : 'no image'"
            style="object-fit: fill"
            :style="{ height: customHeight }"
          />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        :data-bs-target="randomId"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        :data-bs-target="randomId"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
const props = defineProps({
  imgArr: {
    type: Array as PropType<string[]>,
    default: [],
  },
  height: {
    type: Number as PropType<number | string>,
  },
});

const placeholder = ["/img/no-image.jpg"];

const ifArrayOfString = (arr: string[]) => {
  const invalidValue = arr.find((item) => typeof item !== "string");

  if (isValidArray(arr) && !invalidValue) return true;
  return false;
};

const validArray = ifArrayOfString(props.imgArr);

const resolveImages = (arr: string[]) => arr.map((img) => img);

const resolvedPath = validArray ? resolveImages(props.imgArr) : placeholder;

const customHeight = props.height ? `${props.height}px` : "600px";
const randomId = crypto.randomUUID();
</script>
