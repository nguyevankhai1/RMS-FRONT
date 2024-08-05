<template>
  <div class="container-xxl mt-4">
    <div style="height: 400px">
      <div class="row">
        <h6>{{ $t('tokenExpiration') }}</h6>
        <div class="col-4 py-2 d-flex">
          <NInput
            v-model="expireToken"
            type="number"
            placeholder="86400000"
            :maxLength="50000"
          ></NInput>
        </div>
        <div class="col-12 mt-5">
          <h6>{{ $t('parttenPassword') }}</h6>
          <div
            class="list-group-item list-group-item-action d-flex align-items-center"
          >
            <NCheck
              v-model="checkedPartten"
              size="small"
              @update:modelValue="onChecked(checkedPartten)"
            ></NCheck>
            <span class="px-4">{{ 'All' }}</span>
          </div>
          <div class="list-group">
            <div
              v-for="(item, index) in listPartten"
              :key="item?.id"
              class="list-group-item list-group-item-action d-flex align-items-center"
            >
              <NCheck
                v-model="item.checked"
                size="small"
                @update:modelValue="onCheckedChild(item.checked , index)"
              ></NCheck>
              <div class="ms-5"></div>
              •<span class="px-5"> {{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NInput from "~~/components/base/NInput.vue";
import NCheck from "~~/components/base/NCheck.vue";
import API_PATH from "~~/enums/API_PATH";

const props = defineProps({
  appId: {
    type: [String, Array<string>],
  },
  onSave: {
    type: Boolean,
  },
});

const emits = defineEmits(["data"]);

const expireToken = ref()
const checkedPartten = ref(false)
const listPartten = ref()
const regexPassword = ref()

const onChecked = (checked: boolean) => {
	listPartten.value.map((e: any) => e.checked = checked)
	renderRegex()
}

const onCheckedChild = (checked: boolean , index: number) => {
	listPartten.value[index].checked = checked
	const lengthChecked =  listPartten.value.filter((e:any) => e.checked).length
	checkedPartten.value = lengthChecked ==  listPartten.value.length
	renderRegex()
}

const renderRegex = () => {
   let regex:any = []
	 listPartten.value.map((e:any) => {
		if (e.checked) {
			regex.push(e.code)
		}
	 })
	 regexPassword.value = regex.join()
}

const getListPartten = async () => {
	const path = API_PATH.CATEGORY + '/get/list' as API_PATH;
  const { data }:any = await useAPI({
    path,
  })._get({ appId: props.appId ,  parentCode: 'PARTTEN PASSWORD'});
	listPartten.value =  data.value.data
	detailSetting()
}

const detailSetting = async () => {
	const path = '/setting/get' as API_PATH;
  const { data }:any = await useAPI({
    path,
  })._get({ appId: props.appId });
 const res = data.value.data
 expireToken.value  = res.expireToken
 listPartten.value.map((e:any) => {
	e.checked = res.parttenPassword.split(",").filter((k:any) => k == e.code).length !== 0
 })
 const lengthChecked =  listPartten.value.filter((e:any) => e.checked).length
 checkedPartten.value = lengthChecked ==  listPartten.value.length
}

const init = () => {
	getListPartten()
}

watch(
  () => props.onSave,
  () => {
    renderRegex()
    const data = {
      appId: props.appId,
      expireToken: expireToken.value ? expireToken.value : null,
      parttenPassword: regexPassword.value
    }
    emits('data', data)
  }
);

onMounted(init)
</script>

<style lang="scss" scoped>
.tab-setting {
  padding: 1rem;
}

.list-group-item {
  border: none;
  border-bottom: 1px dashed #f4f4f4;
  background-color: var(--bs-filter-table-bg2);
  height: 48px;
	user-select: none;
	padding: 0px;
}

.list-group-item:last-child {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.cus-icon {
  width: 16.25px;
  height: 16.25px;
  border: 1px solid #38bdf833;
  display: flex;
}

.cp {
  cursor: pointer;
}
</style>
