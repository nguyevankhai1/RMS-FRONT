import type { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const UsersFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        { key: "name", label: "table.user.name", rules: { required } },
        { key: "account", label: "table.user.account", rules: { required } },
        {
          key: "password",
          label: "table.user.password",
          type: "password",
          rules: { required },
        },
        { key: "email", label: "table.user.email", rules: { email } },
        { key: "phone", label: "table.user.phone", rules: { phone } },
        {
          key: "gender",
          label: "table.user.gender",
          type: "select",
          options: {
            value: "id",
            label: "name",
            notLoad: true,
            translateItem: true,
            data: [
              { id: 1, name: "gender.male" },
              { id: 0, name: "gender.female" },
              { id: 2, name: "gender.other" },
            ],
          },
        },
        { key: "hob", label: "table.user.place-of-birth" },
        { key: "code", label: "table.header.code" },
      ],
    },
    {
      layout: "6",
      fields: [
        { key: "avatar", label: "Avatar", type: "slot" },
        {
          key: "dob",
          label: "table.user.birthday",
          type: "date",
          options: {
            format: "YYYY-MM-DDTHH:mm:ssZ",
            outputFormat: "YYYY-MM-DDTHH:mm:ssZ",
            max: new Date(),
          },
        },
        { key: "pod", label: "table.user.hometown" },
        {
          key: "ethnicId",
          label: "side-bar.ethnic",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/ethnic",
            searchKey: "name",
            apiSearch: "name",
          },
        },
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
  api: API_PATH.USER,
  title: "side-bar.user",
};

export default UsersFormConfig;
