import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const ApplicationTableConfig: TableConfig = {
  columns: [
    { data: "code", heading: "applicationPage.code", sortable: true },
    { data: "name", heading: "applicationPage.name", sortable: true },
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
  url: API_PATH.APPLICATION,
  useConfirmDeletedBy: "name",
};

export default ApplicationTableConfig;
