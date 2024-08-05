import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const ResourceTableConfig: TableConfig = {
  columns: [
    { data: "name", heading: "table.header.authorization" },
    { data: "path", heading: "table.header.path" },
    { data: "description", heading: "table.header.description" },
    { data: "allow", heading: "table.header.allow" },
  ],
  searchOptions: [
    {
      key: "path",
      label: "table.header.path",
      layout: 4,
    },
  ],
  searchClient: true,
  url: API_PATH.RESOURCE,
  import: true,
  useConfirmDeletedBy: "path",
};

export default ResourceTableConfig;
