export default function usePermission() {
  const permission = useState<any[]>();

  const setPermission = (entity: any) => {
    permission.value = entity;
  };
  const isPermission = async (entity: any) => {
    let apis = [];

    if (!permission.value) {
      const res = await useAuth().me();
      apis = res?.data?.apis;
    } else {
      apis = permission.value;
    }

    let path = entity.path.replace("them-moi", "create");
    if (entity.params.id) {
      if (Object.keys(entity.params).length > 1) {
        return true;
      }

      let parserPath = "/api" + pathNoLang(path);
      const arr = entity.path.split(entity.params.id);

      if ((arr[1] || []).length) {
        parserPath = parserPath.replace(`/${entity.params.id}`, "");
      } else parserPath = parserPath.replace(entity.params.id, "update");

      return (
        permission.value?.filter((e: any) => e === parserPath).length !== 0
      );
    }
    return (
      permission.value?.filter((e: any) => e === "/api" + pathNoLang(path))
        .length !== 0
    );
  };

  const pathNoLang = (path: string) => {
    const nuxtApp = useNuxtApp();
    const locales = nuxtApp.$i18n.localeCodes;
    let isChecked: boolean = false;

    if (locales.value.length) {
      locales.value.map((item: string) => {
        if (`/${item}/` == path.slice(0, 4)) {
          isChecked = true;
        }
      });

      if (isChecked) return path.slice(3);
    }

    return path;
  };

  return {
    permission,
    setPermission,
    isPermission,
    pathNoLang,
  };
}
