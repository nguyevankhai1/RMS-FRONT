// inspired from: https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5-image/src/imagestyle/imagestylecommand.ts

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imagestyle/imagestylecommand
 */

import type { Element } from "ckeditor5/src/engine";
import Command from "@ckeditor/ckeditor5-core/src/command";
import type Editor from "@ckeditor/ckeditor5-core/src/editor/editor";
import type { ImageStyleOptionDefinition } from "@ckeditor/ckeditor5-image/src/imageconfig";

import type MediaUtils from "../mediaUtils";

/**
 * The image style command. It is used to apply {@link module:image/imageconfig~ImageStyleConfig#options image style option}
 * to a selected image.
 *
 * **Note**: Executing this command may change the image model element if the desired style requires an image of a different
 * type. See {@link module:image/imagestyle/imagestylecommand~ImageStyleCommand#execute} to learn more.
 */
export default class MediaStyleCommand extends Command {
  /**
   * An object containing names of default style options for the inline and block images.
   * If there is no default style option for the given image type in the configuration,
   * the name will be `false`.
   */
  private _defaultStyles: Record<string, string | false>;

  /**
   * The styles handled by this command.
   */
  private _styles: Map<string, ImageStyleOptionDefinition>;

  /**
   * Creates an instance of the image style command. When executed, the command applies one of
   * {@link module:image/imageconfig~ImageStyleConfig#options style options} to the currently selected image.
   *
   * @param editor The editor instance.
   * @param styles The style options that this command supports.
   */
  constructor(editor: Editor, styles: Array<ImageStyleOptionDefinition>) {
    super(editor);

    this._defaultStyles = {
      imageBlock: false,
      imageInline: false,
    };

    this._styles = new Map(
      styles.map((style) => {
        if (style.isDefault) {
          for (const modelElementName of style.modelElements) {
            this._defaultStyles[modelElementName] = style.name;
          }
        }

        return [style.name, style];
      })
    );
  }

  /**
   * @inheritDoc
   */
  public override refresh(): void {
    const { plugins, model } = this.editor;
    const mediaUtils: MediaUtils = plugins.get("MediaUtils");
    const element = mediaUtils.getClosestSelectedImageElement(model.document.selection)!;

    this.isEnabled = !!element;

    if (!this.isEnabled) this.value = false;
    else this.value = "block";
  }

  public override execute(options: { value?: string; setImageSizes?: boolean } = {}): void {
    const { plugins, model } = this.editor;
    const mediaUtils: MediaUtils = plugins.get("MediaUtils");

    model.change((writer) => {
      /**
       * @type: DEFAULT_OPTIONS[getter].name. Eg: alignBlockLeft, alignBlockRight
       */
      const requestedStyle = options.value;
      const imageElement = mediaUtils.getClosestSelectedImageElement(model.document.selection)!;
      writer.setAttribute("mediaStyle", requestedStyle, imageElement);
    });
  }

  /**
   * Returns `true` if requested style change would trigger the image type change.
   *
   * @param requestedStyle The name of the style (as configured in {@link module:image/imageconfig~ImageStyleConfig#options}).
   * @param imageElement The image model element.
   */
  public shouldConvertImageType(requestedStyle: string, imageElement: Element): boolean {
    const supportedTypes = this._styles.get(requestedStyle)!.modelElements;

    return !supportedTypes.includes(imageElement.name);
  }
}
