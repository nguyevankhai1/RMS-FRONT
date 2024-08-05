<script lang="ts" setup>
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import { Bold, Italic, Underline, Strikethrough } from "@ckeditor/ckeditor5-basic-styles";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { Link } from "@ckeditor/ckeditor5-link";
import { List } from "@ckeditor/ckeditor5-list";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import {
  Image,
  ImageUpload,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageResize,
  ImageToolbar,
  ImageStyle,
  ImageCaption,
  ImageBlock,
} from "@ckeditor/ckeditor5-image";
import type { ImageConfig } from "@ckeditor/ckeditor5-image";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
import type { MediaEmbedConfig } from "@ckeditor/ckeditor5-media-embed";
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing";
import { GeneralHtmlSupport } from "@ckeditor/ckeditor5-html-support";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor";
// @ts-ignore
// import CKEditorInspector from "@ckeditor/ckeditor5-inspector";

import customImageUploadAdapter from "~~/utils/customCkeditor/extraPlugins/CustomUploader";
import CustomMedia from "~~/utils/customCkeditor/embeddedMedia";
import REDUCED_MATERIAL_COLORS from "~~/utils/customCkeditor/utils/colors";

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: "",
  },
  label: { type: String as PropType<string>, default: "" },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const pluginsConfig = [
  Essentials,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Heading,
  Link,
  List,
  Paragraph,
  Image,
  ImageToolbar,
  ImageUpload,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageResize,
  ImageStyle,
  ImageCaption,
  ImageBlock,
  Strikethrough,
  MediaEmbed,
  CustomMedia,
  SourceEditing,
  GeneralHtmlSupport,
  FontColor,
];

const toolbarConfig = [
  "undo",
  "redo",
  "|",
  "heading",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "blockQuote",
  "|",
  "bulletedList",
  "numberedList",
  "|",
  "link",
  "uploadImage",
  "mediaEmbed",
  "sourceEditing",
  "fontColor",
];

const imageConfig = {
  resizeUnit: "%",
  resizeOptions: [
    {
      name: "resizeImage:original",
      value: null,
      icon: "original",
    },
    {
      name: "resizeImage:50",
      value: "50",
      icon: "medium",
    },
    {
      name: "resizeImage:75",
      value: "75",
      icon: "large",
    },
  ],
  toolbar: [
    "resizeImage:50",
    "resizeImage:75",
    "resizeImage:original",
    "|",
    "imageStyle:alignBlockLeft",
    "imageStyle:alignCenter",
    "imageStyle:alignBlockRight",
    "|",
    "toggleImageCaption",
  ],
};

const embeddedMediaConfig: MediaEmbedConfig = {
  previewsInData: true,
  elementName: "media",
  toolbar: ["mediaStyle:alignBlockLeft", "mediaStyle:alignCenter", "mediaStyle:alignBlockRight"],
};

// used for source editing feature
const htmlSupportConfig = {
  allow: [
    {
      name: /^.*$/,
      attributes: true,
      classes: true,
      styles: true,
    },
  ],
};

const fontColorConfig = {
  colors: REDUCED_MATERIAL_COLORS,
  columns: 20, // set columns in 1 row
};

const init = async () => {
  // Note that you do not have to specify the plugin and toolbar configuration — using defaults from the build.
  ClassicEditor.create(document.querySelector(`#editor`) as HTMLElement, {
    initialData: props.modelValue,
    plugins: pluginsConfig,
    toolbar: toolbarConfig,
    image: imageConfig as ImageConfig,
    mediaEmbed: embeddedMediaConfig,
    extraPlugins: [customImageUploadAdapter],
    // @ts-ignore
    htmlSupport: htmlSupportConfig,
    allowedContent: true,
    updateSourceElementOnDestroy: true,
    fontColor: fontColorConfig,
  })
    .then((editor) => {
      // editor dev tool
      // CKEditorInspector.attach(editor);
      // set style as allowed attribute of media in model
      const schema = editor.model.schema;
      schema.extend("media", {
        allowAttributes: ["resizedWidth", "mediaStyle"],
      });
      editor.model.document.on("change:data", () => {
        emit("update:modelValue", editor.getData());
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(init);
</script>

<template>
  <label v-if="label" class="form-label">
    {{ $t(label) }}
    <span v-if="required" class="text-danger">(*)</span>
  </label>
  <div id="editor"></div>
</template>

<style scoped lang="sass">
@import "./assets/css/customCkeditor5"
</style>
