<script lang="ts" setup>
definePageMeta({
  layout: "login-layout",
});

const router = useRouter();
const { locale } = useI18n();
let menu = ref<any>([]);
let allRoutes = router.getRoutes();
allRoutes = [...allRoutes];

const listToTree = (data: any[], options: any = undefined) => {
  options = options || {};
  const ID_KEY = options.idKey || "path";
  const PARENT_KEY = options.parentKey || "parent";
  const CHILDREN_KEY = options.childrenKey || "children";

  const tree: any = [],
    childrenOf: any = {};
  let item, id, parentId;

  for (let i = 0, length = data.length; i < length; i++) {
    item = data[i];
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    childrenOf[id] = childrenOf[id] || [];
    item[CHILDREN_KEY] = childrenOf[id];
    if (parentId) {
      childrenOf[parentId] = childrenOf[parentId] || [];
      childrenOf[parentId].push(item);
    } else {
      tree.push(item);
    }
  }
  return tree;
};

const setParent = (item: any) => {
  let output = item.path;
  if (!output) return "";
  let path = item.path.split("/");
  path.pop();
  output = path.join("/");
  return output;
};

let arr = [];

if ((allRoutes || []).length && locale.value) {
  arr = allRoutes.reduce((acc: any, item: any) => {
    if ((item.name as string).includes(`__${locale.value}`)) {
      item.parent = setParent(item);
      acc.push(item);
    }
    return acc;
  }, []);

  menu.value = listToTree(arr);
}
</script>

<template>
  <div>{{ menu }}</div>
</template>
