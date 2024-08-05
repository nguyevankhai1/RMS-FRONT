import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const PermissionResourceTableConfig: TableConfig = {
  columns: [
    { data: "name", heading: "table.header.name" },
  ],
  searchOptions: [],
  url: API_PATH.RESOURCE,
};

export default PermissionResourceTableConfig;
