// inspired from: github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5-image/src/imagestyle/imagestyleediting.ts

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imagestyle/imagestyleediting
 */

import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import { modelToViewStyleAttribute } from "@ckeditor/ckeditor5-image/src/imagestyle/converters";
import type { ImageStyleOptionDefinition } from "@ckeditor/ckeditor5-image/src/imageconfig";
import { first } from "ckeditor5/src/utils";
import utils from "@ckeditor/ckeditor5-image/src/imagestyle/utils";

import MediaStyleCommand from "./mediaStyleCommand";

/**
 * The image style engine plugin. It sets the default configuration, creates converters and registers
 * {@link module:image/imagestyle/imagestylecommand~ImageStyleCommand ImageStyleCommand}.
 */
export default class MediaStyleEditing extends Plugin {
  public static get pluginName() {
    return "MediaStyleEditing" as const;
  }

  public normalizedStyles?: Array<ImageStyleOptionDefinition>;

  public init(): void {
    const { normalizeStyles, getDefaultStylesConfiguration } = utils;
    const editor = this.editor;
    const isBlockPluginLoaded = editor.plugins.has("ImageBlockEditing");
    const isInlinePluginLoaded = editor.plugins.has("ImageInlineEditing");

    //dynamically adding styles to mediaEmbed config
    editor.config.define(
      "mediaEmbed.styles",
      getDefaultStylesConfiguration(isBlockPluginLoaded, isInlinePluginLoaded)
    );

    this.normalizedStyles = normalizeStyles({
      configuredStyles: editor.config.get("mediaEmbed.styles")!,
      isBlockPluginLoaded,
      isInlinePluginLoaded,
    });

    this._setupConversion();

    // Register mediaStyle command.
    editor.commands.add("mediaStyle", new MediaStyleCommand(editor, this.normalizedStyles));
  }

  private _setupConversion(): void {
    const { data, editing } = this.editor;

    const mediaNormalizedStyles = (this.normalizedStyles || []).map((style) => {
      if (!style.className) {
        return style;
      } else {
        return { ...style, className: style.className.replace("image", "media") };
      }
    });

    const modelToViewConverter = modelToViewStyleAttribute(mediaNormalizedStyles);

    data.upcastDispatcher.on("element:figure", (evt, data, conversionApi) => {
      type PositionAttribute = "alignCenter" | "alignBlockLeft" | "alignBlockRight";

      const setAlign = (attribute: PositionAttribute) => {
        const modelMediaElement = first(data.modelRange.getItems());
        conversionApi.writer.setAttribute("mediaStyle", attribute, modelMediaElement);
      };

      const cssClass = data.viewItem._classes;

      if (cssClass.has("media-style-align-center")) setAlign("alignCenter");
      else if (cssClass.has("media-style-block-align-left")) setAlign("alignBlockLeft");
      else setAlign("alignBlockRight");
    });

    // downcast
    editing.downcastDispatcher.on("attribute:mediaStyle", modelToViewConverter);
    data.downcastDispatcher.on("attribute:mediaStyle", modelToViewConverter);
  }
}
