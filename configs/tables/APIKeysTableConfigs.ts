import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const APIKeysTableConfigs: TableConfig = {
  columns: [
    { data: "appName", heading: "applicationPage.name", sortable: true },
    { data: "name", heading: "table.header.keyName", sortable: true },
    { data: "id", heading: "apiKey", sortable: true },
    { data: "createdAt", heading: "table.header.createdAt", sortable: true },
    { data: "expiration", heading: "table.header.expiredAt", sortable: true },
  ],
  searchOptions: [
    {
      layout: 6,
      key: "appId",
      label: "applicationPage.name",
      type: "select",
      options: {
        value: "id",
        label: "name",
        api: "/application",
        searchKey: "name",
        apiSearch: "name",
      },
    },
    {
      key: "name",
      label: "table.header.keyName",
      layout: 6,
    },
  ],
  url: API_PATH.APIKEYS_CONFIG,
  useConfirmDeletedBy: "name",
};

export default APIKeysTableConfigs;
