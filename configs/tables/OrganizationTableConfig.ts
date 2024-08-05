import API_PATH from "~~/enums/API_PATH";
import type { TableConfig } from "~~/types";

const OrganizationTableConfig: TableConfig = {
  columns: [
    { data: "name", heading: "table.header.name", sortable: true },
    { data: "code", heading: "table.header.code", sortable: true },
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
    {
      key: "code",
      label: "table.header.code",
      layout: 4,
    },
    {
      key: "description",
      label: "table.header.description",
      layout: 4,
    },
  ],
  url: API_PATH.ORGANIZATION,
  import: true,
  useConfirmDeletedBy: "name",
};

export default OrganizationTableConfig;
