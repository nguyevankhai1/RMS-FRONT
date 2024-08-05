import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const UsersTableConfig: TableConfig = {
  columns: [
    { data: "avatar", heading: "table.user.avatar" },
    { data: "name", heading: "table.user.name", sortable: true },
    { data: "account", heading: "table.user.account", sortable: true },
    { data: "email", heading: "table.user.email", sortable: true },
    { data: "phone", heading: "table.user.phone", sortable: true },
    { data: "status", heading: "table.user.status", sortable: true },
  ],
  searchOptions: [
    {
      key: "name",
      label: "table.user.name",
      layout: 3,
    },
    {
      key: "account",
      label: "table.user.account",
      layout: 3,
    },
    {
      key: "email",
      label: "table.user.email",
      layout: 3,
    },
    {
      key: "phone",
      label: "table.user.phone",
      layout: 3,
    },
  ],
  url: API_PATH.USER,
  useConfirmDeletedBy: "name",
};

export default UsersTableConfig;
