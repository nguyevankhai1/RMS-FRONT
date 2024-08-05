import API_PATH from "~~/enums/API_PATH";
import { FormConfig } from "~~/types";

const CountryFormConfig: FormConfig = {
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
          key: "regionId",
          label: "side-bar.region",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/region",
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
          key: "description",
          type: "textarea",
          label: "table.header.description",
          rules: {},
        },
      ],
    },
  ],
  api: API_PATH.COUNTRY,
  title: "side-bar.country",
};

export default CountryFormConfig;
