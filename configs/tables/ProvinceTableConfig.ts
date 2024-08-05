import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const ProvinceTableConfig: TableConfig = {
  columns: [
    { data: "code", heading: "table.header.code", sortable: true },
    { data: "name", heading: "table.header.name", sortable: true },
    {
      data: "description",
      heading: "table.header.description",
      sortable: true,
    },
  ],
  searchOptions: [
    {
      key: "code",
      label: "table.header.code",
      layout: 3,
    },
    {
      key: "name",
      label: "table.header.name",
      layout: 3,
    },
  ],
  url: API_PATH.PROVINCE,
  import: true,
  useConfirmDeletedBy: "name",
};

export default ProvinceTableConfig;
