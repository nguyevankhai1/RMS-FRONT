import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const SpecializesTableConfig: TableConfig = {
  columns: [
    { data: "code", heading: "table.header.code", sortable: true },
    { data: "name", heading: "table.header.name", sortable: true },
    { data: "priority", heading: "applicationPage.order", sortable: "asc" },
    {
      data: "description",
      heading: "table.header.description",
      sortable: false,
    },
  ],
  searchOptions: [
    {
      key: "name",
      label: "table.header.name",
      layout: 4,
    },
  ],
  url: API_PATH.SPECIALIZE,
  useConfirmDeletedBy: "name",
  import: true,
};

export default SpecializesTableConfig;
