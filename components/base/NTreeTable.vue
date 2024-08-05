<template>
  <div class="base-table table-responsive">
    <div class="d-flex align-items-center pb-5 pe-2">
      <div v-if="hasFilter" class="filter" @click="openFilter = !openFilter">
        <NIcon name="fe:filter" size="20" :color="openFilter ? '#00a3ff' : '#6c757d'"></NIcon>
      </div>
      <div class="flex-grow-1"></div>
      <NButton
        v-if="!props.hasHidden.add"
        size="sm"
        prepend-icon="material-symbols:add-sharp"
        color-icon="white"
        @click="goToPage('add')"
      >
        {{ $t("add") }}
      </NButton>
      <ModalImport :options="props.options" :params="props.params" @loadData="loadData" />
    </div>

    <Transition name="slide-fade">
      <NFilter
        v-show="openFilter"
        :options="props.options.searchOptions"
        @filter="onSearch"
      ></NFilter>
    </Transition>

    <div class="table-fixed-head">
      <table class="table table-hover">
        <thead>
          <tr>
            <th v-if="props.hasSelect" class="w-th">
              <NCheck v-model="checkedAll" class="m-0" @update:modelValue="onAllSelected"></NCheck>
            </th>
            <!-- <th v-if="props.hasIndex" class="w-th">STT</th> -->
            <template v-for="(item, index) in options.columns" :key="`table-th-${index}`">
              <th :style="item.style">
                {{ $t(item.heading) }}
              </th>
            </template>
            <th v-if="!props.hasHidden.actions" class="actions">
              {{ t("table.header.action") }}
            </th>
            <th v-if="props.optionsCheckbox.data" class="actions">
              {{ t("side-bar.view") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in options.data" :key="index">
            <Transition name="slide-fade">
              <tr v-if="!isLoading">
                <td v-if="props.hasSelect" class="text-center">
                  <NCheck
                    v-model="row.checked"
                    class="m-0"
                    @update:modelValue="onSelected(row, $event)"
                  ></NCheck>
                </td>
                <template v-for="(col, ind) in options.columns" :key="ind">
                  <td
                    :style="col.style"
                    class="text-content"
                    :class="{ [`text-${col.align}`]: col.align }"
                  >
                    <slot :name="col.data" :message="row[col.data]" :entity="row">
                      <div>
                        <span
                          v-if="!ind && (row.children || []).length"
                          style="border: 1px solid #38bdf833"
                          class="cp me-3"
                          @click="row.show = !row.show"
                        >
                          <NIcon
                            :name="checkOpenAll(row.show) ? 'ic:baseline-add' : 'ic:baseline-minus'"
                            size="14"
                            color="#0d6efd"
                          ></NIcon>
                        </span>

                        <svg v-else-if="!ind" width="16" height="16" class="me-2"></svg>
                        <span>{{ row[col.data] }}</span>
                      </div>
                    </slot>
                  </td>
                </template>

                <td v-if="!props.hasHidden.actions">
                  <div class="actions">
                    <slot name="action-delete" :entity="row">
                      <div
                        v-if="!props.hasHidden.delete"
                        class="button"
                        @click="goToPage('delete', row)"
                      >
                        <NIcon name="feather:trash-2" size="16" color="#d21953"></NIcon>
                      </div>
                    </slot>
                    <slot name="action-edit" :entity="row">
                      <div
                        v-if="!props.hasHidden.edit"
                        class="button"
                        @click="goToPage('edit', row)"
                      >
                        <NIcon name="pajamas:pencil" size="16" color="#008BD9"></NIcon>
                      </div>
                    </slot>

                    <slot name="action-add-parent">
                      <div class="button" @click="goToPage('add-parent', row)">
                        <NIcon name="material-symbols:add" size="20" color="#008BD9"></NIcon>
                      </div>
                    </slot>
                  </div>
                </td>
                <td v-if="props.optionsCheckbox.data">
                  <NCheck
                    v-model="row.view"
                    :disabled="row.disabled"
                    class="m-0"
                    @update:modelValue="handleCheckBox(row)"
                  >
                  </NCheck>
                </td>
              </tr>
            </Transition>
            <NTr
              v-if="(row.children || []).length && checkOpenAll(!row.show)"
              :data="row.children"
              :options="options"
              :has-select="props.hasSelect"
              :options-checkbox="optionsCheckbox"
              :open-all="openAll"
              @selected="onSelected($event?.row, $event?.value)"
              @action="goToPage($event?.action, $event?.entity)"
              @checkBox="handleCheckBox($event)"
            >
              <template v-for="col in props.options.columns" #[col.data]>
                <slot :name="col.data" :message="row[col.data]" :entity="row"> </slot>
              </template>
            </NTr>
          </template>

          <NTableNotData
            v-if="!(options.data || []).length && !isLoading"
            :colspan="(options.columns || []).length + 3"
          >
          </NTableNotData>

          <NTableLoading
            v-if="isLoading"
            :colspan="(options.columns || []).length + 3"
          ></NTableLoading>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Transition from "vue";
import NIcon from "~~/components/base/NIcon.vue";
import NButton from "~~/components/base/NButton.vue";
import NCheck from "~~/components/base/NCheck.vue";
import NFilter from "~~/components/base/NFilter.vue";
import NTableNotData from "~~/components/base/NTableNotData.vue";
import NTr from "~~/components/base/NTr.vue";
import NTableLoading from "~~/components/base/NTableLoading.vue";
import ModalImport from "~~/components/ModalImport.vue";

const { t } = useI18n();

const props = defineProps({
  isLoad: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Array,
    default: [],
  },
  hasHidden: {
    type: Object,
    default: () => ({}),
  },
  hasSelect: {
    type: Boolean,
    default: false,
  },
  hasFilter: {
    type: Boolean,
    default: true,
  },
  selectKey: {
    type: String,
    default: "id",
  },
  reload: {
    type: Number,
    default: 0,
  },
  router: {
    type: String,
  },
  query: {
    type: String,
  },
  isDataTree: {
    type: Boolean,
    default: true,
  },
  optionsTree: {
    type: Object,
    default: () => ({}),
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  optionsCheckbox: {
    type: Object,
    default: () => ({}),
  },
  openAll: {
    type: Boolean,
    default: false,
  },
});

const isLoading = ref<boolean>(false);

const emits = defineEmits(["selected"]);

let options = ref<any>({});

const service = useService(props.options.url);

type OPTION_TREE = { idKey: string; parentKey: string; childrenKey: string };

const entity = ref<any>({});
const dataTable = ref<any>();
const openFilter = ref<boolean>(false);
let selected = ref<any>([]);
const lsParent = ref<any>();
let checkedAll = ref<any>(false);
let searchParam = ref<any>({});
let listParent = ref<any[]>([]);
let listData = ref<any>([]);

options.value = Object.assign(deepCopy(props.options), { actions: true });

const onSearch = async (params: any) => {
  searchParam.value = params || {};
  if (props.options.searchClient) {
    searchClient(params);
  } else {
    await loadData();
  }
};

const router = useRouter();

const { setHistory } = useHistory();

const loadData = async () => {
  isLoading.value = true;

  const params = {
    ...searchParam.value,
    ...props.params,
  };

  service.getByPage(params).then((data) => {
    const response: any = data.value;
    listData.value = deepCopy(response.data);
    if (props.hasHidden.checkName) {
      response.data.map((e: any) => {
        if (!e.name) {
          e.name = e.path;
        }
      });
    }
    addCheckBox(response);
    if (props.isDataTree) options.value.data = response.data;
    else {
      const configs = { ...props.optionsTree } as OPTION_TREE;
      options.value.data = listToTree(response.data, configs);
    }
    isLoading.value = false;
    onLoadChecked();
    setHistory({
      name: router.currentRoute.value.name,
      params: router.currentRoute.value.params,
      path: router.currentRoute.value.path,
      query: router.currentRoute.value.query,
    });
  });
};

const findItem = (listData: any, parentId: any, listParentId: any) => {
  const parent = listData.value.find((a: any) => a.id == parentId);
  if (listParentId.indexOf(parentId) == -1) {
    listParentId.push(parent.id);
    lsParent.value.push(parent);
  }
  if (parent?.parentId != null) {
    findItem(listData, parent.parentId, listParentId);
  }
};

const searchClient = (params: any) => {
  let listParentId: any = [];
  let listChildren: any = [];
  lsParent.value = [];
  const configs = { ...props.optionsTree } as OPTION_TREE;
  if (params.path) {
    listData.value.map((e: any) => {
      const regex = new RegExp(params.path, "g");
      if (e.path?.match(regex)) {
        if (listParentId.indexOf(e.id) == -1) {
          listParentId.push(e.id);
          listChildren.push(e);
        }
        if (e.parentId != null && listParentId.indexOf(e.parentId) == -1) {
          findItem(listData, e.parentId, listParentId);
        }
      }
    });
    options.value.data = listToTree(listChildren.concat(lsParent.value), configs);
  } else {
    options.value.data = listToTree(listData.value, configs);
  }
};

const listToTree = (data: any[], options: OPTION_TREE) => {
  options = options || {};
  const ID_KEY = options.idKey || "id";
  const PARENT_KEY = options.parentKey || "parentId";
  const CHILDREN_KEY = options.childrenKey || "children";

  let tree: any = [],
    childrenOf: any = {};
  let item, id, parentId;

  for (let i = 0, length = data.length; i < length; i++) {
    item = data[i];
    if (item) {
      id = item[ID_KEY];
      parentId = item[PARENT_KEY] || 0;
      // every item may have children
      childrenOf[id] = childrenOf[id] || [];
      // init its children
      item[CHILDREN_KEY] = childrenOf[id];
      if (parentId != 0) {
        // init its parent's children object
        childrenOf[parentId] = childrenOf[parentId] || [];
        // push it into its parent's children object
        childrenOf[parentId].push(item);
      } else {
        tree.push(item);
      }
    }
  }

  tree = setLevel(tree);
  return tree;
};

const setLevel = (array: any[] = [], level: number = 0) => {
  for (let i = 0; i < array.length; i++) {
    array[i].level = level;
    if (array[i].children.length) {
      setLevel(array[i].children, level + 1);
    }
  }
  return array;
};

const page = ref<any>({
  add: "/them-moi",
  edit: "/",
  "add-parent": "/them-moi",
});

const goToPage = (action: string, item?: any) => {
  entity.value = item;
  if (action == "delete") {
    useConfirm({
      confirmFn: onConfirmDelete,
      confirmBtnColor: "danger",
      message: `${t("confirmBeforeDeleting")} <strong>${
        item[props.options.useConfirmDeletedBy]
      }</strong>${t("confirmText")}?`,
      t,
    }).show();
    return;
  }

  let path = props.router
    ? router.currentRoute.value.path + props.router
    : router.currentRoute.value.path;

  if (action == "add") {
    path += page.value[action];
  } else if (action == "edit") {
    path += `${page.value[action]}${item.id}`;
  } else if (action == "add-parent") {
    path += `${page.value[action]}/${item.id}`;
  }
  if (props.query) {
    router.push({ path, query: { [props.query]: item?.[props.query] } });
  } else {
    router.push({ path });
  }
};

const onConfirmDelete = async () => {
  service.delete(entity.value.id).then((data) => {
    const response: any = data.value;
    if (response.statusCode == 200) {
      useNotify("success", t("deleteRecordSuccessfully")).show();
      loadData();
    }
  });
};

const getData = () => {
  return dataTable.value;
};

const handleCheckBox = (row: any) => {
  listParent.value = [];
  const object = findObjectById(options.value.data, row.id);
  if ((listParent.value || []).length !== 0) {
    if (listParent.value[0].children.find((e: any) => !e.view)) {
    } else {
      listParent.value[0].view = true;
    }
  }
  if ((object.children || []).length !== 0) {
    setChildren(object, row.view);
  }
};

const setChildren = (object: any, value: boolean) => {
  for (let i = 0; i < object.children.length; i++) {
    object.children[i].view = value;
    if ((object.children[i] || []).length !== 0) {
      setChildren(object.children[i], value);
    }
  }
};

const findObjectById = (objectArray: any, targetId: any) => {
  for (const obj of objectArray) {
    if (obj.id === targetId) {
      return obj;
    }
    if (obj.children.length > 0) {
      const foundObject: any = findObjectById(obj.children, targetId);
      if (foundObject) {
        listParent.value.push(obj);
        return foundObject;
      }
    }
  }
  return null;
};

const setSelected = (array: any[], checked: boolean) => {
  for (let i = 0; i < array.length; i++) {
    array[i].checked = checked;

    if (checked) {
      selected.value.push(array[i][props.selectKey]);
    } else {
      selected.value = selected.value.filter((id: any) => {
        return id != array[i][props.selectKey];
      });
    }
    if ((array[i].children || []).length) {
      setSelected(array[i].children, checked);
    }
  }

  selected.value = renewArray(selected.value);
};

const onAllSelected = (value: boolean) => {
  if (!(options.value.data || []).length) return;
  setSelected(options.value.data, value);
};

const onSelected = (entity: any, value: any) => {
  setSelected([entity], value);
  onLoadChecked();
  emits("selected", selected.value);
};

const addCheckBox = (response: any) => {
  if (props.optionsCheckbox.data) {
    response.data.map((e: any) => {
      if (props.optionsCheckbox.resource?.find((element: any) => element === e.id)) {
        e.view = true;
      }
      if (props.optionsCheckbox.data?.find((element: any) => element === e.id)) {
        e.view = true;
        e.disabled = true;
      }
    });
    dataTable.value = response.data;
  }
};

const onLoadChecked = () => {
  if (!(options.value.data || []).length) return;
  let array = [...options.value.data];
  let count = 0;
  let length = 0;

  let setChecked = (arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      length += 1;
      if (selected.value.find((item: any) => item === element[props.selectKey])) {
        element.checked = true;
        count += 1;
      } else element.checked = false;

      if ((element.children || []).length) {
        setChecked(element.children);
      }
    }
  };
  setChecked(array);

  options.value.data = [...array];
  checkedAll.value = count === length;
};

const renewArray = (arr: any) => {
  return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
};

const checkOpenAll = (type: boolean) => {
  return props.openAll ? type : !type;
};

const init = () => {
  if (props.isLoad) {
    loadData();
  }
};

watch(
  () => props.reload,
  (newVal) => {
    loadData();
  }
);

watch(
  () => props.data,
  (newVal) => {
    options.value.data = newVal;
  }
);

onMounted(init);

defineExpose({
  getData,
  loadData,
});
</script>

<style lang="sass">
@import '~~/assets/sass/_table.sass'

.suggestion
  margin-top: 5px
  display: inline-block
  color: #a8acbc
</style>
