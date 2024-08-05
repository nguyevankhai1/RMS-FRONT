<template>
  <h1>Danh sách chức năng cho vai trò</h1>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-5">
          <p class="text-uppercase mt-4 text-center">
            Danh sách chức năng đã phân quyền
          </p>
          <div
            class="py-6 tree-wrapper parent"
            :class="shouldBlinkPermiss ? 'blink' : ''"
          >
            <tree
              :key="renderKey"
              :data="permiss"
              @emit-to-parent="onCheckPermiss"
            ></tree>
          </div>
        </div>
        <div class="col-2 d-flex justify-content-center align-items-center">
          <div class="mt-12">
            <p>
              <NButton width="80px" @click="moveToPermiss">&lt;&lt;</NButton>
            </p>
            <p>
              <NButton width="80px" @click="moveToImpermiss">>></NButton>
            </p>
          </div>
        </div>
        <div class="col-5">
          <p class="text-uppercase mt-4 text-center">
            Danh sách chức năng chưa phân quyền
          </p>
          <div
            class="py-6 tree-wrapper"
            :class="shoudlBlinkImpermiss ? 'blink' : ''"
          >
            <tree
              :key="renderKeyX"
              :data="imper"
              @emit-to-parent="onCheckImpermissible"
            ></tree>
          </div>
        </div>
      </div>
    </div>
    <p class="text-center mt-10">
      <NButton width="80px" @click="save">Lưu</NButton>
    </p>
  </section>
</template>

<script lang="ts" setup>
import API_PATH from "~/enums/API_PATH";
import CommonService from "~~/services/common.service";
import { MyTreeData } from "~~/utils/typetree";
import NButton from "~~/components/base/NButton.vue";

const clickedBtn = ref<string>("");

const renderKey = ref<number>(0);
const renderKeyX = ref<number>(0);

const shouldBlinkPermiss = ref<boolean>(false);
const shoudlBlinkImpermiss = ref<boolean>(false);

const permiss = ref<MyTreeData[]>([]);
const tempPermiss = ref<MyTreeData[]>([]);

const imper = ref<MyTreeData[]>([]);
const tempImper = ref<MyTreeData[]>([]);

// DANH SÁCH CHỨC NĂNG ĐÃ PHÂN QUYỀN
const { id } = useRoute().params;
const roleId = id.toString();
// b9aed51b-df98-450c-9f82-3446261c7aa5
// const roleId = "b9aed51b-df98-450c-9f82-3446261c7aa5";

const getAuthorizedData = () => {
  class RoleResourcesService extends CommonService {
    public async getAuthorizedList(roleId: string) {
      const { data } = await useAPI({
        path: `${this.path}/roleResource/get` as API_PATH,
      })._get({ roleId });
      return data;
    }
  }

  const roleServices = new RoleResourcesService(API_PATH.ROLE);
  roleServices.getAuthorizedList(roleId).then((response: any) => {
    const res: any = response.value;
    permiss.value = res.data;
    renderKey.value++;
  });
};
getAuthorizedData();

// DANH SÁCH CHỨC NĂNG CHƯA PHÂN QUYỀN
//appId = 18a89943-62e3-45d3-8fa5-30d18beaa06c
const defaultAppId = "18a89943-62e3-45d3-8fa5-30d18beaa06c";
const unauthorizedList = useService(API_PATH.RESOURCE);

const getMissingParents = (arg: MyTreeData[]): MyTreeData[] => {
  const remainingIds = arg.map((r) => r.id);

  const missingParent = arg
    .map((item) => {
      if (item.parentId !== null && !remainingIds.includes(item.parentId)) {
        return permiss.value.filter(
          (permiss) => permiss.id === item.parentId
        )[0];
      }
    })
    .filter((i) => i);

  return missingParent;
};

const getUnauthorizedData = () => {
  unauthorizedList
    .getByPage({
      appId: defaultAppId,
    })
    .then((response: any) => {
      const authorizedDataIds = permiss.value.map((v) => v.id);

      const unauthorizedItems: MyTreeData[] = response.value.data.filter(
        (item) => !authorizedDataIds.includes(item.id)
      );

      const missingParent = getMissingParents(unauthorizedItems);

      // imper.value = res.data;
      imper.value = getUniqueItems([...unauthorizedItems, ...missingParent]);
      renderKeyX.value++;
    });
};

watch(permiss, () => {
  getUnauthorizedData();
});

const resetTempValues = () => {
  renderKey.value++;
  renderKeyX.value++;
  tempImper.value = [];
  tempPermiss.value = [];
};

const toggleBlink = () => {
  if (clickedBtn.value === "permissible") {
    shouldBlinkPermiss.value = true;
    setTimeout(() => {
      shouldBlinkPermiss.value = false;
    }, 1000);
  } else if (clickedBtn.value === "impermissible") {
    shoudlBlinkImpermiss.value = true;
    setTimeout(() => {
      shoudlBlinkImpermiss.value = false;
    }, 1000);
  }
};

const customCheckItem = (
  clickValue: string,
  newTreeItems: MyTreeData[],
  remainingItems: MyTreeData[]
) => {
  clickedBtn.value = clickValue;
  tempImper.value = newTreeItems;
  tempPermiss.value = remainingItems;
};

interface EmitData {
  newTreeItems: MyTreeData[];
  remainingItems: MyTreeData[];
}

const onCheckPermiss = (item: EmitData) => {
  customCheckItem("impermissible", item.newTreeItems, item.remainingItems);
};

const onCheckImpermissible = (item: EmitData) => {
  customCheckItem("permissible", item.remainingItems, item.newTreeItems);
};

const moveItems = (perm: MyTreeData[], impermiss: MyTreeData[]) => {
  permiss.value = perm;
  imper.value = impermiss;
  resetTempValues();
  toggleBlink();
};

const moveToPermiss = () => {
  if (tempPermiss.value.length === 0 || clickedBtn.value !== "permissible")
    return;

  moveItems(
    getUniqueItems<MyTreeData>([...tempPermiss.value, ...permiss.value]),
    tempImper.value
  );
};

const moveToImpermiss = () => {
  if (tempImper.value.length === 0 || clickedBtn.value !== "impermissible")
    return;

  moveItems(
    tempPermiss.value,
    getUniqueItems<MyTreeData>([...tempImper.value, ...imper.value])
  );
};

const save = async () => {
  const dataToSend = permiss.value.map((item) => ({
    roleId,
    resourceId: item.id,
  }));

  if (dataToSend.length < 1) {
    useNotify("danger", "Vui lòng chọn chức năng để phân quyền").show();
    return;
  }

  const service = useService(`${API_PATH.ROLE}/roleResource` as API_PATH);
  service.update(dataToSend).then((response: any) => {
    if (response.value.statusCode == 200) {
      useNotify("success", "Thực hiện phân quyền thành công").show();
      getAuthorizedData();
    }
  });
};
</script>

<style>
h1 {
  padding-left: 20px;
}

.tree-wrapper {
  border: 1px solid rgb(0, 163, 255);
  border-radius: 6px;
  min-height: 170px;
}

.blink {
  animation: blinkEffect 0.75s ease-out 1;
}

@keyframes blinkEffect {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
