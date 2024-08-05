// insprired from: https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5-image/src/imageresize/resizeimagecommand.ts

import Command from "@ckeditor/ckeditor5-core/src/command";

import type MediaUtils from "../mediaUtils/index.ts";

export default class ResizeMediaCommand extends Command {
  // Desired image width and height.
  public declare value: null | {
    width: string | null;
    height: string | null;
  };

  /** @inheritDoc */
  public override refresh(): void {
    const editor = this.editor;
    // @ts-ignore
    const mediaUtils: MediaUtils = editor.plugins.get("MediaUtils");
    const imageElement = mediaUtils.getClosestSelectedImageElement(editor.model.document.selection);

    this.isEnabled = !!imageElement;

    if (!imageElement || !imageElement.hasAttribute("resizedWidth")) {
      this.value = null;
    } else {
      this.value = {
        width: imageElement.getAttribute("resizedWidth") as string,
        height: null,
      };
    }
  }

  public override execute(options: { width: string | null }): void {
    const editor = this.editor;
    const model = editor.model;
    const mediaUtils: MediaUtils = editor.plugins.get("MediaUtils");
    const imageElement = mediaUtils.getClosestSelectedImageElement(model.document.selection);

    this.value = {
      width: options.width,
      height: null,
    };

    if (imageElement) {
      model.change((writer) => {
        writer.setAttribute("resizedWidth", options.width, imageElement);
        writer.removeAttribute("resizedHeight", imageElement);
        mediaUtils.setImageNaturalSizeAttributes(imageElement);
      });
    }
  }
}
