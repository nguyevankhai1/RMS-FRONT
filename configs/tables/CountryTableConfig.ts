import API_PATH from "~~/enums/API_PATH";
import { TableConfig } from "~~/types";

const CountryTableConfig: TableConfig = {
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
  url: API_PATH.COUNTRY,
  import: true,
  useConfirmDeletedBy: "name",
};

export default CountryTableConfig;
