import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const AreaFormConfig: FormConfig = {
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
          key: "countryId",
          label: "side-bar.country",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/country",
            searchKey: "name",
            apiSearch: "name",
          },
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
        {
          key: "description",
          type: "textarea",
          label: "table.header.description",
        },
      ],
    },
  ],
  api: API_PATH.AREA,
  title: "side-bar.area",
};

export default AreaFormConfig;
