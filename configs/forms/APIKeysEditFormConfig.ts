import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const APIKeysFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        {
          key: "application",
          label: "side-bar.application",
          rules: { required },
          type: "selectobj",
          options: {
            value: "id",
            label: "name",
            api: "/application",
            searchKey: "name",
            apiSearch: "name",
            notLoad: true,
            disabled: true,
          },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "user",
          label: "table.user.userId",
          type: "selectobj",
          rules: { required },
          options: {
            value: "id",
            label: "name",
            notLoad: true,
            disabled: true,
          },
        },
      ],
    },
    {
      layout: "6",
      fields: [{ key: "name", label: "forms.apiKey.name", rules: { required } }],
    },
    {
      layout: "6",
      fields: [
        {
          key: "id",
          label: "apiKey",
          type: "toggle-password",
          disabled: true,
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "restriction",
          label: "forms.apiKey.restriction",
          rules: { required },
          type: "select",
          options: {
            value: "id",
            label: "name",
            notLoad: true,
            translateItem: true,
            data: [
              { id: "NONE", name: "noRestriction" },
              { id: "WEBSITES", name: "Websites" },
              { id: "IP_ADDRESSES", name: "ipAddresses" },
            ],
          },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "expiration",
          label: "table.header.expiredAt",
          type: "datetime",
        },
      ],
    },
    {
      layout: "2",
      fields: [
        {
          key: "activation",
          type: "checkbox",
          label: "status.activate",
          options: {
            trueValue: true,
            falseValue: false,
          },
        },
      ],
    },
    {
      layout: "12",
      fields: [{ key: "apiKeysRestrictions", label: "Dynamic table", type: "slot" }],
    },
  ],
  api: API_PATH.APIKEYS_CONFIG,
  title: "side-bar.apikeys",
};

export default APIKeysFormConfig;
