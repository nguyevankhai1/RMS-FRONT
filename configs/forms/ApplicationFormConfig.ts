import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const ApplicationFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        {
          key: "id",
          label: "applicationPage.id",
          disabled: true,
        },
      ],
    },
    {
      layout: "6",
      fields: [
        { key: "name", label: "applicationPage.name", rules: { required } },
      ],
    },
    {
      layout: "6",
      fields: [
        { key: "code", label: "applicationPage.code", rules: { required } },
      ],
    },
    {
      layout: "4",
      fields: [
        { key: "priority", label: "applicationPage.order", type: "number-int" },
      ],
    },
    {
      layout: "2",
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
      fields: [
        {
          key: "description",
          type: "textarea",
          label: "table.header.description",
        },
      ],
    },
    {
      layout: "12",
      fields: [{ key: "tabs", type: "slot", label: "Roles and Resources" }],
    },
  ],
  api: API_PATH.APPLICATION,
  title: "side-bar.application",
};

export default ApplicationFormConfig;
