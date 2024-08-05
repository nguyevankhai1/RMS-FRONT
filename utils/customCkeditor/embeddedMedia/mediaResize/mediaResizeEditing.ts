// inspired from: https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5-image/src/imageresize/imageresizeediting.ts

import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

import ResizeMediaCommand from "./resizeMediaCommand";

export default class MediaResizeEditing extends Plugin {
  public static get pluginName() {
    return "MediaResizeEditing" as const;
  }

  public init(): void {
    const editor = this.editor;
    const resizeMediaCommand = new ResizeMediaCommand(editor);

    this._registerConverters();

    // Register `resizeMedia` command and add `mediaResize` command as an alias for backward compatibility.
    editor.commands.add("resizeMedia", resizeMediaCommand);
    editor.commands.add("mediaResize", resizeMediaCommand);
  }

  private _registerConverters() {
    const editor = this.editor;

    const imageType = "media";

    // Dedicated converter to propagate image's attribute to the img tag.
    editor.conversion.for("downcast").add((dispatcher) =>
      dispatcher.on(`attribute:resizedWidth:${imageType}`, (evt, data, conversionApi) => {
        if (!conversionApi.consumable.consume(data.item, evt.name)) return;

        const viewWriter = conversionApi.writer;
        const viewImg = conversionApi.mapper.toViewElement(data.item);

        if (data.attributeNewValue !== null) {
          viewWriter.setStyle("width", data.attributeNewValue, viewImg);
          viewWriter.addClass("media_resized", viewImg);
        } else {
          viewWriter.removeStyle("width", viewImg);
          viewWriter.removeClass("media_resized", viewImg);
        }
      })
    );
  }
}
