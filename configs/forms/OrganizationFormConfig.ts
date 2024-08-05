import API_PATH from "~~/enums/API_PATH";
import type { FormConfig } from "~~/types";

const OrganizationFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        {
          key: "name",
          label: "organization.name",
          rules: { required },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "code",
          label: "organization.code",
          rules: { required },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "level",
          label: "table.header.level",
          type: "number-int",
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "parentId",
          label: "organization.parent",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/organization",
            path: "get/select",
            searchKey: "name",
            apiSearch: "name",
          },
          rules: { required },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "commander",
          label: "organization.commander",
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "email",
          label: "table.user.email",
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "phone",
          label: "table.user.phone",
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "address",
          label: "address.address",
          rules: { required },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "longtitude",
          label: "address.longtitude",
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "latitude",
          label: "address.latitude",
        },
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
            path: "get/select",
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
          key: "districtId",
          label: "side-bar.district",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/district",
            path: "get/select",
            searchKey: "name",
            apiSearch: "name",
            search: "provinceId",
          },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "communeId",
          label: "side-bar.commune",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/commune",
            path: "get/select",
            searchKey: "name",
            apiSearch: "name",
            search: "districtId",
          },
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
        {
          key: "description",
          type: "textarea",
          label: "table.header.description",
        },
      ],
    },
  ],
  api: API_PATH.ORGANIZATION,
  title: "side-bar.organization",
};

export default OrganizationFormConfig;
