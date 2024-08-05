<template>
  <!-- Button trigger modal -->
  <NButton
    :id="`modal-trigger-${id}`"
    data-bs-toggle="modal"
    :data-bs-target="`#modal-${id}`"
    class="d-none"
  >
  </NButton>

  <!-- Modal -->
  <div
    :id="`modal-${id}`"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      :class="{ [`modal-${props.size}`]: props.size }"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-3">
            {{ props.title }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="onToggle(false)"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div v-if="props.footer" class="modal-footer">
          <slot name="action"></slot>
          <slot name="actions">
            <NButton
              data-bs-dismiss="modal"
              color="secondary"
              @click="onToggle(false)"
            >
              {{ $t(props.labelClose) }}
            </NButton>
            <NButton :disabled="disabledBtnSave" @click="emits('confirm')">
              {{ $t(props.labelSave) }}
            </NButton>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NButton from "~~/components/base/NButton.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "lg", // sm | lg | xl | fullscreen
  },
  labelClose: {
    type: String,
    default: "close",
  },
  labelSave: {
    type: String,
    default: "save",
  },
  disabledBtnSave: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: Boolean,
    default: true,
  }
});

const emits = defineEmits(["confirm", "update:modelValue"]);

const id = ref<string>(Math.random().toString());

const onToggle = (value: boolean) => {
  emits("update:modelValue", value);
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    const el = document.getElementById(`modal-trigger-${id.value}`);
    if (el) el.click();
  }
);
</script>
