import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const CommuneFormConfig: FormConfig = {
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
          key: "districtId",
          label: "side-bar.district",
          rules: { required },
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/district",
            searchKey: "name",
            apiSearch: "name",
          },
        },
      ],
    },
    {
      layout: "4",
      fields: [
        {
          key: "priority",
          label: "table.header.priority",
          type: "number-int",
        },
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
          key: "metadata",
          type: "textarea",
          label: "table.header.metadata",
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
  api: API_PATH.COMMUNE,
  title: "side-bar.commune",
};

export default CommuneFormConfig;
