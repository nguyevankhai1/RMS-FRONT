import type { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const CategoryTableConfig: TableConfig = {
  columns: [
    { data: "name", heading: "table.header.name" },
    { data: "code", heading: "table.header.code" },
    { data: "description", heading: "table.header.description" },
  ],
  url: API_PATH.CATEGORY,
  import: true,
  hideModalImport: true,
  useConfirmDeletedBy: "name",
};

export default CategoryTableConfig;
