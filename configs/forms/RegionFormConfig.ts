import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const RegionFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        {
          key: "name",
          label: "table.header.name",
          rules: { required, maxLength: maxLength(128) },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "code",
          label: "table.header.code",
          rules: { required, maxLength: maxLength(36) },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "priority",
          label: "table.header.priority",
          type: "number-int",
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
      fields: [
        {
          key: "description",
          type: "textarea",
          label: "table.header.description",
          rules: { maxLength: maxLength(512) },
        },
      ],
    },
  ],
  api: API_PATH.REGION,
  title: "side-bar.region",
};
export default RegionFormConfig;
