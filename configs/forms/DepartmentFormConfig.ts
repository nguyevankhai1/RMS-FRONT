import API_PATH from "~~/enums/API_PATH";
import type { FormConfig } from "~~/types";

const DepartmentFormConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [{ key: "name", label: "department.name", rules: { required } }],
    },
    {
      layout: "6",
      fields: [
        {
          key: "code",
          label: "department.code",
          rules: { required },
        },
      ],
    },
    {
      layout: "6",
      fields: [
        {
          key: "organizationId",
          label: "side-bar.organization",
          type: "select",
          options: {
            value: "id",
            label: "name",
            api: "/organization",
            searchKey: "name",
            apiSearch: "name",
          },
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
          key: "priority",
          label: "table.header.priority",
          type: "number-int",
        },
      ],
    },
    // {
    //   layout: "2",
    //   fields: [
    //     {
    //       key: "status",
    //       type: "checkbox",
    //       label: "status.activate",
    //       options: {
    //         trueValue: 1,
    //         falseValue: 0,
    //       },
    //     },
    //   ],
    // },
    {
      layout: "12",
      fields: [
        {
          key: "description",
          type: "textarea",
          label: "table.header.description",
          rules: { required },
        },
      ],
    },
  ],
  api: API_PATH.DEPARTMENT,
  title: "side-bar.department",
};

export default DepartmentFormConfig;
