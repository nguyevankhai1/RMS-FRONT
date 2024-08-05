import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const ResourceFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        { key: "path", label: "table.header.path", rules: { required } },
      ],
    },
    {
      layout: "6",
      fields: [{ key: "name", label: "table.header.name" }],
    },
    {
      layout: "6",
      fields: [{ key: "code", label: "table.header.code" }],
    },
    {
      layout: "6",
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
  ],
  api: API_PATH.RESOURCE,
  title: "side-bar.resource",
};

export default ResourceFormConfig;
