<template>
  <div>
    <label v-if="props.hasLabel" class="form-label">
      {{ $t(props.label) }}
      <span v-if="props.required" class="text-danger">(*)</span>
    </label>
    <VueMultiselect
      v-model="selected"
      :options="slotOptions"
      label="label"
      openDirection="bottom"
      :multiple="props.options.multiple"
      :taggable="props.options.taggable"
      :placeholder="$t(props.label)"
      :searchable="props.options.filter"
      :track-by="props.options.value || 'label'"
      close-on-select
      :show-labels="false"
      :internal-search="!!props.options.data"
      :disabled="props.options.disabled"
      :customLabel="customLabel"
      tagPlaceholder="Enter"
      class="base-select"
      @tag="addTag"
      @search-change="onSearch"
      @select="changeSelected"
      :loading="isLoading"
    >
      <template #clear>
        <div
          v-if="!!selected && !props.options.noClear"
          class="multiselect__clear"
          @mousedown.prevent.stop="clearAll"
        >
          <NIcon name="ion:ios-close" color="#999"></NIcon>
        </div>
      </template>
      <template #noOptions>
        <div class="fs-6">
          {{
            props.options.taggable
              ? $t("inputThenEnterToAddData")
              : $t("noData")
          }}
        </div>
      </template>
      <template #noResult>
        <div class="fs-6">{{ $t("noSuitableSearchResult") }}</div>
      </template>
    </VueMultiselect>
  </div>
</template>

<script lang="ts" setup>
import VueMultiselect from "vue-multiselect";
import API_PATH from "~/enums/API_PATH";
import NIcon from "~~/components/base/NIcon.vue";
import type { SelectBoxOptions } from "~~/types/index";

useHead({
  link: [
    {
      href: "/css/vue-multiselect.css",
      rel: "stylesheet",
    },
  ],
});

export interface SelectOptions extends SelectBoxOptions {
  value: string;
  label: string;
  api: string;
  searchKey: string;
  apiSearch?: string;
  mounted?: boolean;
  disabledItems?: string[];
  translateItem?: boolean;
}

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: "",
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: "",
  },
  options: {
    type: Object as PropType<SelectOptions>,
    default: () => ({}),
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  required: {
    type: Boolean,
    default: false,
  },
  returnObject: {
    type: Boolean,
    default: false,
  },
});
const isLoading = ref<Boolean>(false);
const emits = defineEmits(["update:modelValue"]);

const service = useService(props.options.api as API_PATH, () => {});

const CHARACTER_JOIN = ",";

const { t } = useI18n();
const selected = ref<any>();

const slotOptions = ref<any>([]);
const params = ref<any>({});

const customLabel = (item: any) => {
  let output = item["label"];
  if (props.options.label) {
    let listLabel = [];
    if (typeof props.options.label === "string") {
      listLabel = [props.options.label];
    } else listLabel = props.options.label;

    let arr;
    arr = listLabel.reduce((acc: any[], entity: any) => {
      acc.push(item[entity]);
      return acc;
    }, []);
    output = arr.join(" - ");
  }
  if (props.options?.translateItem) {
    output = t(output);
  }
  return output;
};

const validateTag = (value: string) => {
  let output = false;
  const CHARACTER = [","];

  for (let i = 0; i < CHARACTER.length; i++) {
    const element = CHARACTER[i];
    if (value.includes(element)) {
      useNotify("warning", t("containsInvalidDigits")).show();
      output = true;
      break;
    }
  }

  if ((props.modelValue as string).includes(value)) {
    useNotify("warning", t("duplicateRecord")).show();
    output = true;
  }

  return output;
};

const addTag = (tag: any) => {
  if (validateTag(tag)) return;
  let output: any = props.modelValue || [];
  if (output.length) {
    output = [props.modelValue];
  }
  output.push(tag);
  emits("update:modelValue", output.join(CHARACTER_JOIN));
};

const changeSelected = () => {
  emits("update:modelValue", selected.value);
}

const clearAll = () => {
  selected.value = [];
  emits("update:modelValue", "");
};

const onSearch = (searchQuery: any) => {
  if (props.options.apiSearch) {
    params.value[props.options.searchKey] = searchQuery;
    loadData();
  }
};

if (props.options.search) {
  let filter = props.options.search as string[];
  if (typeof filter === "string") filter = [filter];
  setTimeout(() => {
    filter.forEach((element: string) => {
      watch(
        () => props.data[element],
        (newVal, oldVal) => {
          clearAll();
          params.value[element] = newVal;
          reLoad();
        }
      );
    });
  }, 500);
}

const reLoad = (data?: any) => {
  params.value = { ...params.value, ...data };
  loadData();
};

const loadData = async (type?: string) => {
  isLoading.value = true;
  if (props.options.params || {}) {
    const pagination = {
      page: 0,
      size: 20,
    };
    params.value = { ...pagination, ...params.value, ...props.options.params };
  }

  const data = await service.getForSelect(
    deepCopy(params.value),
    props.options.path
  );
  slotOptions.value = deepCopy((data.value as any)?.data);
  if (props.options.isNotCurrentValue) {
    slotOptions.value = slotOptions.value.filter(
      (item: any) =>
        item[props.options.value] != props.data[props.options.value]
    );
  }
  isLoading.value = false;
  handleDisabled();

};

const onInit = () => {
  if (props.options.notLoad) {
    slotOptions.value = props.options.data || [];
    return;
  }

  if (props.options.search) {
    let filter = props.options.search as string[];
    if (typeof filter === "string") filter = [filter];

    filter.forEach((element: string) => {
      params.value[element] = props.data[element] || "";
    });
  }
  params.value = { ...params.value, ...props.options.params };
  loadData("init");
};

onMounted(onInit);

const handleDisabled = () => {
  if ((props.options.disabledItems || []).length !== 0) {
    const select: any = props.modelValue;
    slotOptions.value.map((e: any) => {
      if (
        props.options.disabledItems?.find(
          (f: any) => f === e[props.options.value]
        ) &&
        !select?.split(",").find((f: any) => f === e[props.options.value])
      ) {
        e.$isDisabled = true;
      } else {
        e.$isDisabled = false;
      }
      return e;
    });
  }
};

watch(
  () => props.options.disabledItems,
  () => {
    handleDisabled();
  }
);

watch(
  () => props.modelValue,
  () => {
    selected.value = props.modelValue
  }
);

defineExpose({
  reLoad,
});
</script>

<style lang="sass">
@import "/assets/css/vue-multiselect.css"

.base-select
  $primary: #039be5
  $close: #f1416c
  $background: #e3f2fd

  .multiselect__tags
    min-height: 43.56px !important
    &:focus-within
      border-color: #00A3FF
  .multiselect__input::placeholder
    color: #ccc
  .multiselect__single
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    font-size: 1.1rem
    margin: 2px 0 0 0
    padding-right: 0.6rem
  .multiselect__option
    font-size: 1.1rem !important
  .multiselect__option--selected
    color: $primary
    background: $background
  .multiselect__option--highlight
    font-weight: bold
    color: black
    background-color: white
  .multiselect__tag
    border-radius: 2px
    color: $primary
    background-color: $background
  .multiselect__tag-icon
    border-radius: 0
    border-left: 1px solid white
  .multiselect__tag-icon::after
    color: $primary
  .multiselect__tag-icon:hover::after
    color: $close
  .multiselect__clear
    position: absolute
    right: 26px
    top: 9px
    z-index: 1
    cursor: pointer
  .multiselect__option--selected.multiselect__option--highlight
    background: $background
    color: $primary
  input
    font-size: 1.1rem !important
  .multiselect__content-wrapper
    border-color: #00A3FF
    .multiselect__content
      .multiselect__element
        .multiselect__option
          &:hover
            color: #00A3FF
            background-color: #F1F6F9
</style>
