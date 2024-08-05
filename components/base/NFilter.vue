<template>
  <div class="base-advance-search p-5 mb-5">
    <div class="row pt-2 pb-4">
      <div
        v-for="(field, i) in props.options"
        :key="`search-${i}`"
        :class="`col-${field.layout} py-2`"
      >
        <div
          v-if="
            !field.type ||
            field.type == 'text' ||
            field.type == 'number' ||
            field.type == 'number-int'
          "
        >
          <NInput
            v-model.trim="data[field.key]"
            :type="field.type"
            :label="field.label"
            :has-label="false"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @update:modelValue="changeValue(data, field.key, $event)"
            size="sm"
          >
          </NInput>
        </div>

        <div v-else-if="field.type == 'select'">
          <NSelect
            v-model="data[field.key]"
            :id="`input-select-${i}`"
            :label="field.label"
            :options="field.options"
            :data="data"
            @update:modelValue="changeValue(data, field.key, $event)"
            size="sm"
          >
          </NSelect>
        </div>

        <div v-else-if="field.type == 'checkbox' || field.type == 'switch'">
          <NCheck
            v-model="data[field.key]"
            :label="field.label"
            :type="field.type"
            :true-value="field?.options?.trueValue || true"
            :false-value="field?.options?.falseValue || false"
            :disabled="field.disabled"
            :size="field.size"
            class="pt-6"
            @update:modelValue="changeValue(data, field.key, $event)"
          >
          </NCheck>
        </div>

        <div v-else-if="field.type == 'datetime' || field.type == 'date' || field.type == 'time'">
          <NDatePicker
            v-model="data[field.key]"
            :type="field.type"
            :options="field.options"
            :label="field.label"
          ></NDatePicker>
        </div>
      </div>
    </div>
    <NButton prepend-icon="ph:magnifying-glass" color-icon="white" size="sm" @click="onSearch">
      {{ $t("table.filter.search") }}
    </NButton>
  </div>
</template>

<script lang="ts" setup>
import NInput from "~~/components/base/NInput.vue";
import NButton from "~~/components/base/NButton.vue";
import NCheck from "~~/components/base/NCheck.vue";
import NSelect from "~~/components/base/NSelect.vue";
import NDatePicker from "~~/components/base/NDatePicker.vue";

type T = {
  layout?: string | number;
  type?: string;
  key: string;
  label: string;
  options: any;
  disabled: boolean;
  placeholder?: string;
  size?: string;
};

const props = defineProps({
  options: {
    type: Array as PropType<T[]>,
    default: () => [],
  },
});

const emits = defineEmits(["filter", "vchange"]);

let data = ref<any>({});

let isLoad = ref<boolean>(true);

const onSearch = () => {
  if (isLoad.value) {
    isLoad.value = false;
    emits("filter", data.value);
    setTimeout(() => {
      isLoad.value = true;
    }, 1000);
  }
};

const changeValue = (item: any, field: any, value: any) => {
  item[field] = value;
  emits("vchange", { field, value });
  data.value = { ...data.value, [field]: value };
};

watch(data, () => {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const validKeys = Object.keys(data.value).filter((k) => data.value[k]);
    validKeys.length !== 0 && onSearch();
  });
});
</script>
