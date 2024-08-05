<template>
  <div>
    <div
      v-for="(item, index) in props.options"
      :key="`radio-${index}`"
      class="form-check form-check-inline cursor-pointer"
    >
      <input
        :id="`radios-${id}-${index}`"
        :value="item.key"
        :disabled="item.disabled"
        type="radio"
        class="form-check-input"
        name="inlineRadioOptions"
        :checked="item.key == modelValue"
        :style="`width: ${props.size}; height: ${props.size}`"
        @change="onChange"
      />
      <label class="form-check-label" :for="`radios-${id}-${index}`">
        {{ item.label }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
type OPTION = {
  key: string | number;
  label: string;
  disabled?: boolean;
};

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  options: {
    type: Array as PropType<OPTION[]>,
    default: () => [],
  },
  size: {
    type: String,
    default: "1.6rem",
  },
});

const emits = defineEmits(["update:modelValue"]);

const id = ref<string>(Math.random().toString());

const onChange = (e: any) => {
  emits("update:modelValue", (e.target as HTMLInputElement).value);
};
</script>

<style lang="sass" scoped>
.form-check
    input, label
        cursor: pointer
</style>
