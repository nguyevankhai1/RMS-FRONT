import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const RolesTableConfig: TableConfig = {
  columns: [
    { data: "name", heading: "table.header.name", sortable: true },
    { data: "priority", heading: "applicationPage.order", sortable: "asc" },
    {
      data: "description",
      heading: "table.header.description",
      sortable: false,
    },
  ],
  searchOptions: [],
  url: API_PATH.ROLE,
  useConfirmDeletedBy: "name",
};

export default RolesTableConfig;
