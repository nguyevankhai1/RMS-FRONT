<template>
  <div class="menu-tree">
    <div class="list-group">
      <template v-for="(item, index) in items" :key="`province-${index}`">
        <div
          class="list-group-item list-group-item-action d-flex align-items-center"
        >
          <NCheck
            v-model="item.checked"
            size="small"
            @update:modelValue="onChecked(item, $event)"
            :class="item.selected && !item.checked ? 'opacity-checkbox' : ''"
          ></NCheck>
          <div class="cus-icon items-center cp">
            <NIcon
              :name="!item.expand ? 'ic:baseline-add' : 'ic:baseline-minus'"
              size="14"
              color="#0d6efd"
              @click="onExpand(item, 1)"
            ></NIcon>
          </div>
          <span class="px-4">{{ item.name }}</span>
        </div>

        <div v-if="item.expand" class="list-group">
          <template
            v-for="(district, index) in item.child"
            :key="`district-${index}`"
          >
            <div
              class="list-group-item list-group-item-action d-flex align-items-center"
            >
              <NCheck
                v-model="district.checked"
                size="small"
                @update:modelValue="onChecked(district, $event, item)"
                :class="district.selected && !district.checked  ? 'opacity-checkbox' : ''"
              >
              </NCheck>
              <div
                v-if="(item.child || []).length"
                class="cus-icon items-center cp ms-10"
              >
                <NIcon
                  :name="
                    !district.expand ? 'ic:baseline-add' : 'ic:baseline-minus'
                  "
                  size="14"
                  color="#0d6efd"
                  @click="onExpand(district, 2)"
                ></NIcon>
              </div>
              <span class="px-4">{{ district.name }}</span>
            </div>

            <div v-if="district.expand" class="list-group">
              <template
                v-for="(commune, index) in district.child"
                :key="`district-${index}`"
              >
                <div
                  class="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <NCheck
                    v-model="commune.checked"
                    size="small"
                    @update:modelValue="
                      onChecked(commune, $event, district, item)
                    "
                  ></NCheck>
                  <div class="ms-20"></div>
                  •<span class="px-5"> {{ commune.name }}</span>
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import API_PATH from "~~/enums/API_PATH";
import NIcon from "~~/components/base/NIcon.vue";
import NCheck from "~~/components/base/NCheck.vue";

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

const items = ref<any>([]);
const dataDetail = ref<any>({});
const getList = () => {
  if (dataDetail.value) {
    const service = useService(API_PATH.PROVINCE);
    service.getForSelect({page: 0,size: 80}, "get/select").then((response) => {
      items.value = setData((response.value as any)?.data, "provinces");
      items.value = valueToCheck((response.value as any)?.data, "parents");
    });
  }
};

const getDetail = () => {
  if (props.appId && props.userId) {
    dataDetail.value = props.options;
    getList();
  }
};

const setData = (arr: any = [], field: string) => {
  if ((dataDetail.value[field] || []).length) {
    for (let i = 0; i < arr.length; i++) {
      if (
        dataDetail.value[field].findIndex(
          (item: string) => item === arr[i].id
        ) !== -1
      ) {
        arr[i].checked = true;
      }
    }
  }

  return [...arr];
};

const valueToCheck = (arr: any = [], field: string) => {
  if ((dataDetail.value[field] || []).length) {
    for (let i = 0; i < arr.length; i++) {
      if (
        dataDetail.value[field].findIndex(
          (item: string) => item === arr[i].id
        ) !== -1
      ) {
        arr[i].selected = true;
      }
    }
  }

  return [...arr];
};

const onExpand = (item: any, type: number) => {
  item.expand = !item.expand;

  if (!item.child) {
    let service;
    let params = {};
    let field = "";
    if (type === 1) {
      service = useService(API_PATH.DISTRICT);
      params = { provinceId: item.id , size: 10000 , page: 0 };
      field = "districts";
    }
    if (type === 2) {
      service = useService(API_PATH.COMMUNE);
      params = { districtId: item.id , size: 10000 , page: 0};
      field = "communes";
    }
    service?.getForSelect(params, "get/select").then((response) => {
      item.child = (response.value as any)?.data;
      hasChecked(item.child, item.checked);
      item.child = setData((response.value as any)?.data, field);
      items.child = valueToCheck((response.value as any)?.data, "parents");
    });
  }
};

const onChecked = (item: any, value: any, entity: any = {}, data?: any) => {
  hasChecked(item.child, value);
  item.selected = value
  if ((entity.child || []).length) {
    let count = 0;
    for (let i = 0; i < entity.child.length; i++) {
      const element = entity.child[i];
      if (element.checked) count += 1;
      else count -= 1;
    }

    if (count === entity.child.length) {
      entity.checked = true;

      if (data) {
        let _count = 0;
        for (let i = 0; i < data.child.length; i++) {
          const element = data.child[i];
          if (element.checked) _count += 1;
        }

        if (_count === data.child.length) data.checked = true;
      }
    }
    if (count < entity.child.length) {
      entity.checked = false;
      entity.selected = value;
      if (data) {
        data.checked = false;
        data.selected = value;
      }
    }
  }
};

const hasChecked = (arr: [], checked: boolean = false) => {
  if (!(arr || []).length) return [];

  for (let i = 0; i < arr.length; i++) {
    let element: any = arr[i];
    element.checked = checked;

    if ((element.child || []).length) {
      hasChecked(element.child, checked);
    }
  }
};

const renewArray = (arr: any) => {
  return arr.filter((item: any, index: number) => arr.indexOf(item) === index);
};

const getData = () => {
  let provinces: any = [];
  let districts: any = [];
  let communes: any = [];

  for (let i = 0; i < items.value.length; i++) {
    const element = items.value[i];
    if (element.checked) {
      provinces.push(element.id);
    }

    if ((element.child || []).length) {
      for (let j = 0; j < element.child.length; j++) {
        const element1 = element.child[j];
        if (element1.checked) {
          districts.push(element1.id);
        }

        if ((element1.child || []).length) {
          for (let k = 0; k < element1.child.length; k++) {
            const element2 = element1.child[k];
            if (element2.checked) {
              communes.push(element2.id);
            }
          }
        }
      }
    }
  }

  provinces = renewArray(provinces);
  districts = renewArray(districts);
  communes = renewArray(communes);

  return { provinces, districts, communes };
};

watch(
  () => props.handleSave,
  () => {
    const data = {
      ...getData(),
      appId: props.appId,
      userId: props.userId,
    };
    emits("data", data);
  }
);

watch(
  () => props.options,
  () => {
    if (props.appId && props.userId) {
      dataDetail.value = props.options;
      getList();
    }
  }
);

onMounted(() => {
  getDetail();
});
</script>

<style scoped lang="scss">
.menu-tree {
  padding: 2rem;
}

.list-group-item {
  border: none;
  border-bottom: 1px dashed #f4f4f4;
  background-color: var(--bs-filter-table-bg2);
  padding: 0.5rem 1.2rem;
  height: 48px;
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
