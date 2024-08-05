<template>
  <div>
    <div class="row">
      <div class="col-6 py-2">
        <NSelect
          v-model="form[commanderOrgField.key]"
          :label="commanderOrgField.label"
          :options="commanderOrgField.options"
          @update:modelValue="onChangeSelect()"
        >
        </NSelect>
      </div>
      <div class="col-6 py-2">
        <NSelect
          v-model="form[deptField.key]"
          :label="deptField.label"
          :options="deptField.options"
        >
        </NSelect>
      </div>
      <div class="col-6 py-2">
        <NSelect
          v-model="form[mainOrgField.key]"
          :label="mainOrgField.label"
          :options="mainOrgField.options"
          @update:modelValue="onChangeSelect()"
        >
        </NSelect>
      </div>
      <div class="col-6 py-2">
        <NSelect
          v-model="form[speField.key]"
          :label="speField.label"
          :options="speField.options"
        >
        </NSelect>
      </div>
      <div class="col-6 py-2">
        <NSelect
          v-model="form[orgField.key]"
          :label="orgField.label"
          :options="orgField.options"
          @update:modelValue="onChangeSelect()"
        >
        </NSelect>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NSelect from "~~/components/base/NSelect.vue";

const props = defineProps({
  appId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
  },
  handleSave: {
    type: Boolean,
  },
  open: {
    type: Boolean,
  },
});

const emits = defineEmits(["data"]);

const form = ref<any>({});

const commanderOrgField = ref<any>({
  key: "commandOrgId",
  label: "side-bar.commander",
  type: "select",
  options: {
    value: "id",
    label: "name",
    api: "/organization",
    path: "get/select",
    searchKey: "name",
    apiSearch: "name",
  },
})

const mainOrgField = ref<any>({
  key: "mainorgId",
  label: "side-bar.mainOrganization",
  type: "select",
  options: {
    value: "id",
    label: "name",
    api: "/organization",
    path: "get/select",
    searchKey: "name",
    apiSearch: "name",
  },
})

const orgField = ref<any>({
  key: "organizations",
  label: "side-bar.organization",
  type: "select",
  options: {
    value: "id",
    label: "name",
    api: "/organization",
    path: "get/select",
    searchKey: "name",
    apiSearch: "name",
    multiple: true,
  },
});

const deptField = ref<any>({
  key: "deptpartmentes",
  label: "side-bar.department",
  type: "select",
  options: {
    value: "id",
    label: "name",
    api: "/department",
    searchKey: "name",
    multiple: true,
    apiSearch: "name",
  },
});

const speField = ref<any>({
  key: "specializes",
  label: "side-bar.specializes",
  type: "select",
  options: {
    value: "id",
    label: "name",
    api: "/specialize",
    searchKey: "name",
    multiple: true,
    apiSearch: "name",
  },
});

const getDetail = () => {
  if (props.appId && props.userId && props.options) {
    const data: any = props.options
    form.value.organizations = data.organizations.join();
    form.value.deptpartmentes = data.deptpartmentes.join();
    form.value.specializes = data.specializes.join();
    form.value.mainorgId = data.mainorgId;
    form.value.commandOrgId = data.commandOrgId;
    setTimeout(() => {
      onChangeSelect()
    }, 100);
  }
};

const onChangeSelect = () => {
  const arr = [...form.value.organizations?.split(","), form.value.commandOrgId, form.value.mainorgId]
  orgField.value.options.disabledItems = arr
  mainOrgField.value.options.disabledItems = arr
  commanderOrgField.value.options.disabledItems = arr
}

watch(
  () => props.handleSave,
  () => {
    const data = {
      mainorgId: form.value.mainorgId,
      commandOrgId: form.value.commandOrgId,
      organizations: form.value.organizations?.split(","),
      deptpartmentes: form.value.deptpartmentes?.split(","),
      specializes: form.value.specializes?.split(","),
      appId: props.appId,
      userId: props.userId,
    };
    emits('data', data)
  }
);

watch(
  () => props.options,
  () => {
    getDetail();
  }
);

onMounted(() => {
  getDetail();
})
</script>
