import { FormConfig } from "~~/types/index";

const ProvinceFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        {
          key: "name",
          label: "table.header.name",
          rules: { required },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "code",
          label: "table.header.code",
          rules: { required },
        },
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
            search: "parent",
          },
          rules: { required },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "areaId",
          label: "side-bar.area",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/area",
            searchKey: "name",
            apiSearch: "name",
            search: "countryId",
          },
          rules: { required },
        },
      ],
    },
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
        },
      ],
    },
  ],
  api: "/province",
  title: "side-bar.province",
};

export default ProvinceFormConfig;
