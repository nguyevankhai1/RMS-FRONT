import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const UserInfoFormConfig: FormConfig = {
  columns: [
    {
      layout: "2",
      fields: [{ key: "avatar", label: "Avatar", type: "slot" }],
    },
    {
      layout: "3",
      fields: [
        { key: "name", label: "table.user.name", readonly: true },
        { key: "account", label: "table.user.account", readonly: true },
      ],
    },
    {
      layout: "3",
      fields: [
        { key: "phone", label: "table.user.phone", rules: { phone } },
        { key: "email", label: "table.user.email", rules: { email } },
      ],
    },
  ],
  api: API_PATH.DISTRICT,
  title: "profile",
};

export default UserInfoFormConfig;
