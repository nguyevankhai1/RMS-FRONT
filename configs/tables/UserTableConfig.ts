import { TableConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const UserTableConfig: TableConfig = {
  columns: [
    { data: "name", heading: "table.user.name", sortable: true },
    { data: "account", heading: "table.user.account", sortable: true },
    { data: "phone", heading: "table.user.phone", sortable: true },
    { data: "email", heading: "table.user.email", sortable: false },
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
  url: API_PATH.USER_APPLICATION,
  useConfirmDeletedBy: "name",
};

export default UserTableConfig;
