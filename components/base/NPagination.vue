<template>
  <div class="d-flex pt-10">
    <nav aria-label="...">
      <ul class="pagination">
        <li
          :class="{ nonEvent: !isPrevious }"
          class="page-icon"
          @click="previous()"
        >
          <NIcon name="ic:baseline-keyboard-arrow-left" size="22"></NIcon>
        </li>
        <li
          v-for="i in listPage"
          :key="i"
          :class="{ active: currentPage == i - 1, nonEvent: i == '...' }"
          class="page-item"
          @click="changePage(i)"
        >
          <a class="page-link" href="#">
            {{ i }}
          </a>
        </li>
        <li :class="{ nonEvent: !isNext }" class="page-icon" @click="next()">
          <NIcon name="ic:baseline-keyboard-arrow-right" size="22"></NIcon>
        </li>
      </ul>
    </nav>
    <div class="flex-grow-1"></div>
    <div class="d-flex align-items-center">
      <div class="fs-12 me-5">
        {{ $t("record") }}
        {{
          totalPages >= 1 ? (currentPage + 1) * numPerPage - numPerPage + 1 : 0
        }}
        -
        {{
          options.totalData > (currentPage + 1) * numPerPage
            ? (currentPage + 1) * numPerPage
            : options.totalData
        }}
        , {{ $t("total") }}: {{ options.totalData }}
      </div>
      <div>
        <select
          v-model="numPerPage"
          class="form-select form-select-sm"
          @change="changePerPage"
        >
          <option
            v-for="(item, idx) in optionPerPage"
            :key="`per-page-${idx}`"
            :value="item"
          >
            {{ item }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NIcon from "~~/components/base/NIcon.vue";

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  numPerPage: {
    type: Number,
    default: 20,
  },
});

const emits = defineEmits(["reLoad", "changePage", "changePerPage"]);

const numPerPage = ref<number>(props.numPerPage);
const optionPerPage = ref<number[]>([10, 20, 25, 50, 100]);
let isPrevious = ref(false);
let isNext = ref(false);

const listPage = computed(() => {
  return generatePageRange(props.currentPage, props.totalPages);
});

const previous = () => {
  emits("changePage", props.currentPage - 1);
  emits("reLoad");
};

const next = () => {
  emits("changePage", props.currentPage + 1);
  emits("reLoad");
};

const changePage = (page: number) => {
  emits("changePage", page - 1);
  emits("reLoad");
};

const changePerPage = () => {
  emits("changePerPage", numPerPage.value);
  emits("changePage", 0);
  emits("reLoad");
};

const generatePageRange = (
  currentPage: number,
  lastPage: number,
  delta = 2
) => {
  // creates array with base 1 index
  const range = Array(lastPage)
    .fill(1)
    .map((_, index) => index + 1);

  return range.reduce((pages: any[], page) => {
    // allow adding of first and last pages
    if (page === 1 || page === lastPage) {
      return [...pages, page];
    }

    // if within delta range add page
    if (page - delta <= currentPage && page + delta >= currentPage) {
      return [...pages, page];
    }

    // otherwise add 'gap if gap was not the last item added.
    if (pages[pages.length - 1] !== "...") {
      return [...pages, "..."];
    }

    return pages;
  }, []);
};

watch(
  () => props,
  (newVal, oldVal) => {
    if (newVal.currentPage == 0) {
      isPrevious.value = false;
      if (newVal.totalPages == 1) {
        isNext.value = false;
      } else isNext.value = true;
    } else {
      isPrevious.value = true;
      if (newVal.currentPage == newVal.totalPages - 1) {
        isNext.value = false;
      } else isNext.value = true;
    }
  },
  { deep: true }
);

onMounted(() => {
  if (props.currentPage == 0) {
      isPrevious.value = false;
      if (props.totalPages == 1) {
        isNext.value = false;
      } else isNext.value = true;
    } else {
      isPrevious.value = true;
      if (props.currentPage == props.totalPages - 1) {
        isNext.value = false;
      } else isNext.value = true;
    }
})
</script>
