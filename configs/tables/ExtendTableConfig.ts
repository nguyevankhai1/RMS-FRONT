import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const ExtendTableConfig: TableConfig = {
  columns: [
    // { data: "table_", heading: "table.header.table", sortable: true },
    { data: "name", heading: "table.header.name", sortable: true },
    {
      data: "description",
      heading: "table.header.description",
      sortable: true,
    },
    { data: "extend_", heading: "table.header.extendable", sortable: true },
  ],
  url: API_PATH.EXTEND,
  useConfirmDeletedBy: "name",
};

export default ExtendTableConfig;
