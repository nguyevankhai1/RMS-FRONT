<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
  status: {
    type: Boolean,
    required: true,
  },
  confirm: {
    type: Boolean,
    Default: false
  },
});

const { t } = useI18n();
const state = ref<boolean>(props.status);
const emit = defineEmits(["switchToggle", "confirmTrue"]);
const onSwitch = () => {
  state.value = !state.value;
  if (props.confirm) {
    useConfirm({
      confirmFn: () => {
        emit("confirmTrue", props.data);
      },
      confirmBtnColor: "danger",
      message: t("confirmBeforeChange"),
      hidden: () => {
        state.value = !state.value;
      },
      t,
    }).show();
  } else {
    emit("switchToggle", state.value);
  }
};
</script>

<template>
  <div class="form-check form-switch">
    <input
      style="cursor: pointer"
      class="form-check-input"
      type="checkbox"
      id="flexSwitchCheckChecked"
      :checked="state"
      @change="onSwitch"
    />
  </div>
</template>
