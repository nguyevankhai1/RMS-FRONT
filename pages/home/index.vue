<script lang="ts" setup>
import ProvinceFormConfig from "~~/configs/forms/ProvinceFormConfig";
import NButton from "~~/components/base/NButton.vue";

let treeInfo = ref<any>([]);
let isLoading = ref<any>(false);

const checkItem = (item: any) => {
  console.log("item checked: ", item);
};
const dbclick = (item: any) => {
  console.log("db click item: ", item);
};
const toggleLoading = (item: any) => {
  isLoading.value = !isLoading.value;
};

function addData() {
  console.time("Execution Time");
  const data = [
    {
      id: 1,
      name: "Admin 123",
      parentId: null,
    },
    {
      id: 2,
      name: "Admin 1",
      parentId: 1,
    },
    {
      id: 3,
      name: "Admin 2",
      parentId: 1,
    },
    {
      id: 5,
      name: "Quản trị viên",
      parentId: null,
    },
    {
      id: 6,
      name: "Quản trị viên 1",
      parentId: 5,
    },
  ];
  treeInfo.value = data;
}
</script>
<template>
  <div class="post fs-6 d-flex flex-column-fluid">
    <div class="container-xxl">
      <div class="mt-5">
        <NForm :configs="ProvinceFormConfig"></NForm>
        inner text
      </div>
      <div class="mt-5">
        <div style="height: 300px; width: 100%" v-loading.spinner="isLoading">
          hello my fen !
        </div>
      </div>
      <div class="mt-5">
        <NButton @click="toggleLoading">toggle loading</NButton>
      </div>
      <div class="mt-5">
        <button @click="addData()">add data</button>
        <NTree
          class="item"
          :item="treeInfo"
          :is-line="true"
          @check-item="checkItem"
          @make-folder="dbclick"
        ></NTree>
      </div>
    </div>
  </div>
</template>
