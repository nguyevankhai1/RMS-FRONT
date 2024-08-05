import { MyInnerTreeData } from "./typetree";

export function getSortData(data: MyInnerTreeData[]) {
  const file = [];
  const folder = [];

  for (let i = 0; i < data.length; i++) {
    const treeItem = data[i];

    treeItem.children ? folder.push(treeItem) : file.push(treeItem);
  }

  return [...folder, ...file];
}

export function capitalizeFirstLetter(word: string) {
  return word[0].toUpperCase() + word.slice(1);
}

function goBack(locale?: String) {
  const router = useRouter();

  const urlPaths = router.currentRoute.value.path.split("/");
  const URL =
    urlPaths.length > 2
      ? locale !== "vi"
        ? locale + urlPaths[2]
        : urlPaths[1]
      : "";
  if (urlPaths.length > 3) window.history.back();
  navigateTo(`/${URL}`);
}

export { goBack };
