<template>
  <div class="base-table table-responsive">
    <!-- <div class="d-flex align-items-center ps-5 pt-4 pb-2">
      <span class="fw-bolder fs-2">Danh sách</span>
      <div class="flex-grow-1"></div>
      <NInput
        v-model="textSearch"
        type="text"
        :placeholder="`${t('table.filter.search')} ...`"
      >
      </NInput>
      <NButton
        prepend-icon="ph:magnifying-glass"
        color-icon="white"
        class="mx-2"
        style="width: 58px"
        @click="onSearch"
      >
      </NButton>
    </div> -->

    <!-- <div class="border-bottom py-1"></div> -->

    <div class="d-flex align-items-center pt-2 pb-5 pe-2">
      <div
        v-if="hasFilter && props.options.searchOptions"
        class="filter"
        @click="opeBaseNFilter = !opeBaseNFilter"
      >
        <NIcon
          name="fe:filter"
          size="20"
          :color="opeBaseNFilter ? '#00a3ff' : '#6c757d'"
        />
      </div>
      <div class="flex-grow-1"></div>
      <slot name="action-head">
        <NButton
          v-if="!props.hasHidden.add && hasPermission('create')"
          size="sm"
          prepend-icon="material-symbols:add-sharp"
          color-icon="white"
          @click="goToPage('add')"
        >
          {{ $t("addNewOne") }}
        </NButton>
        <div class="mx-3">
          <NButton
            v-if="props.options.import"
            size="sm"
            color-icon="white"
            class="btn dropdown-toggle py-3"
            data-bs-toggle="dropdown"
          >
            {{ $t("import-export") }}
          </NButton>
          <ul class="dropdown-menu">
            <li class="dropdown-item cursor-pointer btn-file">
              <NIcon
                name="material-symbols:ios-share"
                size="14"
                class="mb-1"
              ></NIcon>
              {{ $t("import") }}
              <input
                type="file"
                accept=".xlsm, .xlsx , .xls"
                @change="handleFile"
              />
            </li>
            <li>
              <hr class="dropdown-divider cursor-pointer" />
            </li>
            <li
              class="dropdown-item cursor-pointer"
              @click="handleExport('export')"
            >
              <NIcon
                name="material-symbols:place-item"
                size="14"
                class="mb-1"
              ></NIcon>
              {{ $t("export") }}
            </li>
            <li>
              <hr class="dropdown-divider cursor-pointer" />
            </li>
            <li
              class="dropdown-item cursor-pointer"
              @click="handleExport('export/template')"
            >
              <NIcon
                name="material-symbols:article"
                size="14"
                class="mb-1"
              ></NIcon>
              {{ $t("template") }}
            </li>
          </ul>
        </div>
      </slot>
    </div>

    <Transition name="slide-fade">
      <BaseNFilter
        v-show="opeBaseNFilter && props.options.searchOptions && hasFilter"
        :options="props.options.searchOptions"
        @filter="onSearch"
      ></BaseNFilter>
    </Transition>

    <div class="table-fixed-head">
      <Transition name="slide-fade">
        <table class="table table-hover" v-if="!isLoading">
          <thead>
            <tr>
              <th v-if="props.hasSelect" class="w-th">
                <BaseNCheck
                  v-model="checkedAll"
                  class="m-0"
                  @update:modelValue="onAllSelected"
                ></BaseNCheck>
              </th>
              <th v-if="props.hasIndex" class="w-th">
                {{ $t(`table.header.stt`) }}
              </th>
              <template
                v-for="(item, index) in options.columns"
                :key="`table-th-${index}`"
              >
                <th>
                  <span
                    v-if="item.sortable"
                    class="cursor-pointer user-select-none text-nowrap"
                    @click="onSort(item, item.sortable === 'asc' ? 'desc' : 'asc')"
                  >
                    {{ $t(item.heading) }}
                  </span>
                  <span v-else class="user-select-none text-nowrap">
                    {{ $t(item.heading) }}
                  </span>
                  <ClientOnly>
                    <span v-if="item.sortable" class="table-sort cp">
                      <IconArrowDown
                        v-if="item.sortable === 'asc'"
                        @click="onSort(item, 'desc')"
                      ></IconArrowDown>
                      <IconArrowUp
                        v-if="item.sortable === 'desc'"
                        @click="onSort(item, 'asc')"
                      >
                      </IconArrowUp>
                      <span
                        @click="onSort(item, item.sortable === 'asc' ? 'desc' : 'asc')"
                      >
                        <IconSort
                          v-if="item.sortable === true"
                          class="icon-arrow"
                        ></IconSort>
                      </span>
                    </span>
                  </ClientOnly>
                </th>
              </template>
              <th v-if="!props.hasHidden.actions" class="actions text-nowrap">
                {{ $t(`table.header.action`) }}
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(row, index) in options.data" :key="row">
              <tr>
                <td v-if="props.hasSelect" class="text-center">
                  <BaseNCheck
                    v-model="row.checked"
                    class="m-0"
                    @update:modelValue="onSelected(row, $event)"
                  ></BaseNCheck>
                </td>
                <td v-if="props.hasIndex">
                  {{ (currentPage || 0) * numPerPage + index + 1 }}
                </td>
                <template v-for="(col, ind) in options.columns" :key="ind">
                  <td
                    :style="{
                      ...col.style,
                    }"
                    class="text-content"
                    :class="{ [`text-${col.align}`]: col.align }"
                  >
                    <slot
                      :name="col.data"
                      :message="row[col.data]"
                      :entity="row"
                      :index="index"
                    >
                      <div class="text-truncate">
                        {{ row[col.data] }}
                      </div>
                    </slot>
                  </td>
                </template>

                <td v-if="!props.hasHidden.actions">
                  <div class="actions">
                    <slot name="action-view" :entity="row">
                      <div
                        v-if="props.hasHidden.view"
                        class="button"
                        @click="goToPage('view', row)"
                      >
                        <NIcon name="feather:eye" size="16"></NIcon>
                      </div>
                    </slot>
                    <slot name="action-repeat" :entity="row">
                      <div
                        v-if="props.hasHidden.repeat"
                        class="button"
                        @click="goToPage('repeat', row)"
                      >
                        <NIcon name="feather:repeat" size="16"></NIcon>
                      </div>
                    </slot>
                    <slot name="action-delete" :entity="row" :index="index">
                      <div
                        v-if="!props.hasHidden.delete && hasPermission('delete')"
                        class="button"
                        @click="goToPage('delete', row)"
                        :style="{
                          display: row.isDefault || row.isManager ? 'none' : 'flex',
                        }"
                      >
                        <NIcon name="feather:trash-2" size="16" color="#d21953">
                        </NIcon>
                      </div>
                    </slot>

                    <slot
                      name="action-edit"
                      :entity="{ ...row }"
                      :index="index"
                    >
                      <div
                        v-if="!props.hasHidden.edit && hasPermission('update')"
                        class="button"
                        @click="goToPage('edit', row)"
                      >
                        <NIcon name="pajamas:pencil" size="16" color="#008BD9">
                        </NIcon>
                      </div>
                    </slot>
                    <slot name="action" :entity="row"></slot>
                  </div>
                </td>
              </tr>
            </template>

            <BaseNTableNotData
              v-if="!(options.data || []).length && !isLoading"
              :colspan="(options.columns || []).length + 3"
            >
            </BaseNTableNotData>
            <NTableLoading
              v-if="isLoading"
              :colspan="(options.columns || []).length + 3"
            ></NTableLoading>
          </tbody>
        </table>
      </Transition>
    </div>

    <BaseNPagination
      v-if="props.isPagination && (options.data || []).length"
      :options="options"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :numPerPage="numPerPage"
      @changePage="currentPage = $event"
      @changePerPage="numPerPage = $event"
      @reLoad="loadData"
    >
    </BaseNPagination>
  </div>
</template>

<script lang="ts" setup>
import API_PATH from "~~/enums/API_PATH";
import NButton from "~~/components/base/NButton.vue";
import NIcon from "~~/components/base/NIcon.vue";
import NTableLoading from "~~/components/base/NTableLoading.vue";
import IconSort from "~~/components/icons/svg/IconSort.vue";
import IconArrowDown from "~~/components/icons/svg/IconArrowDown.vue";
import IconArrowUp from "~~/components/icons/svg/IconArrowUp.vue";

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
    default: () => [],
  },
  hasHidden: {
    type: Object,
    default: () => ({}),
  },
  hasSelect: {
    type: Boolean,
    default: false,
  },
  hasIndex: {
    type: Boolean,
    default: true,
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
  numPerPage: {
    type: Number,
    default: 20,
  },
  isPagination: {
    type: Boolean,
    default: true,
  },
  router: {
    type: String,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["selected"]);

const isLoading = ref<boolean>(false);
const route = useRoute();

const isAdmin = ref<boolean>(useUserRole().role.value.includes("ROLE ADMIN"));

let options = ref<any>({});

const service = useService(props.options.url);

let selected = ref<any>([]);
const entity = ref<any>({});
let checkedAll = ref<any>(false);

const opeBaseNFilter = ref<boolean>(false);

const currentPage = ref<number>(0);
const numPerPage = ref<number>(props.numPerPage);
let totalPages = ref<number>(1);

let sortParam = ref<any>({});
let searchParam = ref<any>({});
let textSearch = ref<string>("");

options.value = Object.assign(deepCopy(props.options));

const hasPermission = (action: string) => {
  const { permission, pathNoLang } = usePermission();
  const apis = [...permission.value];
  let parserPath = `${route.path}/${action}`;
  parserPath = parserPath.replace("them-moi", "create");

  if (route.params.id) {
    const arr = parserPath.split(`${route.params.id}`);
    if ((arr[1] || []).length) {
      parserPath = parserPath.replace(`/${route.params.id}`, "");
    } else parserPath = parserPath.replace(`${route.params.id}`, "update");
  }
  return apis.filter((e: any) => e === "/api" + pathNoLang(parserPath)).length !== 0;
};

const onSearch = async (params: any) => {
  searchParam.value = params || {};
  currentPage.value = 0;
  await loadData();
};

const router = useRouter();

const { history, setHistory } = useHistory();

const currentUrl: string = router.currentRoute.value.path;

const historyItem = history.value.find((item) => item.path === currentUrl);

const loadData = async () => {
  let textSort: any = [];
  isLoading.value = true;

  if (sortParam.value) {
    let array = Object.keys(sortParam.value);
    array.forEach((element) => {
      if (sortParam.value[element] !== true)
        textSort.push(`${element}@${sortParam.value[element]}`);
    });
  }

  if (!textSort.length) textSort = undefined;

  const params = {
    page: Number(currentPage.value),
    size: Number(numPerPage.value),
    textSort,
    ...searchParam.value,
    ...props.params,
  };

  service
    .getByPage(params)
    .then((data) => {
      const response: any = data.value;
      options.value.data = response.data ? [...response.data] : [];
      if (props.isPagination) {
        options.value.totalData = response.totalItems;
        currentPage.value = response.currentPage;
        totalPages.value = response.totalPages;
      }
      onLoadChecked();
      setHistory({
        name: router.currentRoute.value.name,
        params: router.currentRoute.value.params,
        path: router.currentRoute.value.path,
        query: router.currentRoute.value.query,
        search: {
          currentPage: Number(currentPage.value),
          numPerPage: Number(numPerPage.value),
        },
      });
    })
    .finally(() => (isLoading.value = false));
};

const page = ref<any>({
  add: "/them-moi",
  edit: "/",
});

const handleFile = async (event: any) => {
  const formData = new FormData();
  const file = event.target.files[0];
  if (file) {
    formData.append("file", file);
    const { data }: any = await useAPI({
      path: `${service.path}/import` as API_PATH,
    })._post(formData);
    if ((data.value.data || []).length !== 0) {
      loadData();
      useNotify("success", t("updateSucessfully")).show();
      toggleDropdown();
    }
  }
  event.target.value = "";
};

const handleExport = async (action: string) => {
  let params = {};
  if (action === "export") {
    params = {
      type: "excel",
    };
  }

  toggleDropdown();

  const { data }: any = await useAPI({
    path: `${service.path}/${action}` as API_PATH,
  })._get(params);
  saveAs(data.value);
};

const saveAs = (response: any) => {
  const FILE = `data:${response.data.mediaType};base64,${response.data.base64}`;
  const docUrl = document.createElement("a");
  document.body.appendChild(docUrl);
  docUrl.href = FILE;
  docUrl.download = response.data.fileName;
  docUrl.click();
};

const toggleDropdown = () => {
  const toggleElement: any = document.getElementsByClassName("dropdown-toggle")[0];
  if (toggleElement) {
    toggleElement.classList.toggle("show");
  }
};

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
  }
  router.push({ path });
};

const onConfirmDelete = async () => {
  service.delete(entity.value.id, props.params).then((data) => {
    const response: any = data.value;
    if (response.statusCode == 200) {
      useNotify("success", t("deleteRecordSuccessfully")).show();
      loadData();
    }
  });
};

const onAllSelected = (value: boolean) => {
  if (!(options.value.data || []).length) return;

  options.value.data.forEach((element: any) => {
    onSelected(element, value);
  });
  selected.value = renewArray(selected.value);
};

const onSelected = (entity: any, value: any) => {
  if (value) {
    selected.value.push(entity[props.selectKey]);
  } else {
    selected.value = selected.value.filter((id: any) => {
      return id != entity[props.selectKey];
    });
  }

  onLoadChecked();
  emits("selected", selected.value);
};

const onLoadChecked = () => {
  if (!(options.value.data || []).length) return;
  let array = [...options.value.data];
  let count = 0;

  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (selected.value.find((item: any) => item === element[props.selectKey])) {
      element.checked = true;
      count += 1;
    } else element.checked = false;
  }

  options.value.data = [...array];
  checkedAll.value = count === array.length;
};

const renewArray = (arr: any) => {
  return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
};

const onSort = (entity: any, value: any) => {
  entity.sortable = value;
  sortParam.value[entity.data] = value;
  debounce(loadData(), 500);
};

const init = () => {
  if (props.isLoad) {
    if (historyItem && historyItem.search) {
      // if found in history, set paging data with found history item, or else, set default values
      const { search } = historyItem;
      currentPage.value = search.currentPage || 0;
      numPerPage.value = search.numPerPage || 20;
    }

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

onBeforeMount(init);

defineExpose({
  onSearch,
});
// onMounted(init);
</script>

<style lang="sass">
@import '~~/assets/sass/_table.sass'
</style>
