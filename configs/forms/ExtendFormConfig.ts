import { FormConfig } from "~~/types/index";
import API_PATH from "~~/enums/API_PATH";

const ExtendFormConfig: FormConfig = {
  columns: [
    {
      layout: "12",
      fields: [
        { key: "fields", type: "slot" },
      ],
    },
  ],
  api: API_PATH.EXTEND,
  title: "side-bar.extend",
};

export default ExtendFormConfig;
