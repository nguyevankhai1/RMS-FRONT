import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const DistrictFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        { key: "name", label: "table.header.name", rules: { required } },
      ],
    },
    {
      layout: "6",
      fields: [
        { key: "code", label: "table.header.code", rules: { required } },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "provinceId",
          label: "side-bar.province",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/province",
            searchKey: "name",
            apiSearch: "name",
          },
          rules: { required },
        },
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
        { key: "metadata", type: "textarea", label: "table.header.metadata" },
      ],
    },
    {
      layout: "12",
      fields: [
        {
          key: "description",
          type: "textarea",
          label: "table.header.description",
          rules: {},
        },
      ],
    },
  ],
  api: API_PATH.DISTRICT,
  title: "side-bar.district",
};

export default DistrictFormConfig;
