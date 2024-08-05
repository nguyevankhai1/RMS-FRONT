import { FormConfig } from "~~/types/index";

const ExtendFormDataConfig: FormConfig = {
  columns: [
    {
      layout: "6",
      fields: [
        { key: "label", label: "forms.extend.label", rules: { required } },
      ],
    },
    {
      layout: "6",
      fields: [
        { key: "value", label: "forms.extend.value", rules: { required } },
      ],
    },
    {
      layout: "6",
      fields: [{ key: "api", label: "API", rules: { required } }],
    },
    {
      layout: "6",
      fields: [{ key: "path", label: "table.header.path" }],
    },
  ],
  isButtonBottom: true,
  noHead: true,
};

export default ExtendFormDataConfig;
