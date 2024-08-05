import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const UserFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        { key: "name", label: "Tên", rules: { required } },
        { key: "priority", label: "applicationPage.order", type: "number-int" },
      ],
    },
    {
      layout: "6",
      fields: [
        { key: "code", label: "Mã", rules: { required } },
        {
          key: "status",
          type: "checkbox",
          label: "Kích hoạt",
          options: {
            trueValue: 1,
            falseValue: 0,
          },
        },
      ],
    },
    {
      layout: "12",
      fields: [{ key: "description", type: "textarea", label: "Mô tả" }],
    },
    {
      layout: "12",
      fields: [{ key: "role", type: "slot" }],
    },
  ],
  api: API_PATH.ROLE,
  title: "User",
};

export default UserFormConfig;
