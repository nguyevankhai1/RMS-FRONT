// inspired from: https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5-image/src/imagetoolbar.ts

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imagetoolbar
 */
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import { WidgetToolbarRepository } from "ckeditor5/src/widget";
import { isObject } from "lodash-es";
import type { ImageStyleDropdownDefinition } from "@ckeditor/ckeditor5-image/src/imageconfig";

// import MediaUtils from "../mediaUtils";
import type MediaUtilsType from "../mediaUtils";
import MediaStyleUI from "./mediaStyleUI";

type MediaConfig = Array<string | ImageStyleDropdownDefinition>;

/**
 * The image toolbar plugin. It creates and manages the image toolbar (the toolbar displayed when an image is selected).
 *
 * For an overview, check the {@glink features/images/images-overview#image-contextual-toolbar image contextual toolbar} documentation.
 *
 * Instances of toolbar components (e.g. buttons) are created using the editor's
 * {@link module:ui/componentfactory~ComponentFactory component factory}
 * based on the {@link module:image/imageconfig~ImageConfig#toolbar `image.toolbar` configuration option}.
 *
 * The toolbar uses the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon}.
 */
export default class MediaToolbar extends Plugin {
  /**
   * @inheritDoc
   */
  public static get requires() {
    return [WidgetToolbarRepository, MediaStyleUI] as const;
  }

  /**
   * @inheritDoc
   */
  public static get pluginName() {
    return "MediaToolbar" as const;
  }

  /**
   * @inheritDoc
   */
  public afterInit(): void {
    const { t, plugins, config } = this.editor;

    const widgetToolbarRepository = plugins.get(WidgetToolbarRepository);
    const mediaUtils: MediaUtilsType = plugins.get("MediaUtils");

    widgetToolbarRepository.register("media", {
      ariaLabel: t("Media toolbar"),
      items: normalizeDeclarativeConfig(config.get("mediaEmbed.toolbar") || []),
      getRelatedElement: (selection) => mediaUtils.getClosestSelectedImageWidget(selection)!,
    });
  }
}

/**
 * Convert the dropdown definitions to their keys registered in the ComponentFactory.
 * The registration precess should be handled by the plugin which handles the UI of a particular feature.
 */
function normalizeDeclarativeConfig(config: MediaConfig): string[] {
  return config.map((item) => (isObject(item) ? item.name : item));
}
