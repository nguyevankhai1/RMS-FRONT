import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const RoleFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        { key: "name", label: "table.header.name", rules: { required } },
      ],
    },
    // {
    //   layout: "6",
    //   fields: [
    //     { key: "code", label: "table.header.code", rules: { required } },
    //   ],
    // },
    {
      layout: "6",
      fields: [
        { key: "priority", label: "applicationPage.order", type: "number-int" },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "description",
          type: "textarea",
          label: "table.header.description",
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "status",
          type: "checkbox",
          label: "status.activate",
          options: {
            trueValue: 1,
            falseValue: 0,
          },
        },
      ],
    },
    {
      layout: "12",
      fields: [{ key: "role", type: "slot" }],
    },
  ],
  api: API_PATH.ROLE,
  title: "side-bar.roles",
};

export default RoleFormConfig;
