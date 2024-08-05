/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imagestyle/imagestyleui
 */

import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import { ButtonView } from "ckeditor5/src/ui";
import type {
  ImageStyleDropdownDefinition,
  ImageStyleOptionDefinition,
} from "@ckeditor/ckeditor5-image/src/imageconfig";

import type MediaStyleCommand from "./mediaStyleCommand";
import MediaStyleEditing from "./mediaStyleEditing";

import "./css/mediaStyle.scss";

/**
 * The image style UI plugin.
 *
 * It registers buttons corresponding to the {@link module:image/imageconfig~ImageConfig#styles} configuration.
 */
export default class MediaStyleUI extends Plugin {
  public static get requires() {
    return [MediaStyleEditing] as const;
  }

  public static get pluginName() {
    return "MediaStyleUI" as const;
  }

  public get localizedDefaultStylesTitles(): Record<string, string> {
    const t = this.editor.t;

    return {
      "Wrap text": t("Wrap text"),
      "Break text": t("Break text"),
      "In line": t("In line"),
      "Full size image": t("Full size image"),
      "Side image": t("Side image"),
      "Left aligned image": t("Left aligned image"),
      "Centered image": t("Centered image"),
      "Right aligned image": t("Right aligned image"),
    };
  }

  public init(): void {
    const plugins = this.editor.plugins;
    const mediaStyleEditing: MediaStyleEditing = plugins.get("MediaStyleEditing");

    const definedStyles = translateStyles(
      mediaStyleEditing.normalizedStyles!,
      this.localizedDefaultStylesTitles
    );

    for (const styleConfig of definedStyles) {
      this._createButton(styleConfig);
    }
  }

  /**
   * Creates a button and stores it in the editor {@link module:ui/componentfactory~ComponentFactory}.
   */
  private _createButton(buttonConfig: ImageStyleOptionDefinition): void {
    const buttonName = buttonConfig.name;

    this.editor.ui.componentFactory.add(getUIComponentName(buttonName), (locale) => {
      const command: MediaStyleCommand = this.editor.commands.get("mediaStyle")!;

      const view = new ButtonView(locale);

      view.set({
        label: buttonConfig.title,
        icon: buttonConfig.icon,
        tooltip: true,
        isToggleable: true,
      });

      view.bind("isEnabled").to(command, "isEnabled");
      view.bind("isOn").to(command, "value", (value) => value === buttonName);
      view.on("execute", this._executeCommand.bind(this, buttonName));

      return view;
    });
  }

  private _executeCommand(name: string): void {
    this.editor.execute("mediaStyle", { value: name });
    this.editor.editing.view.focus();
  }
}

/**
 * Returns the translated `title` from the passed styles array.
 */
function translateStyles<T extends ImageStyleOptionDefinition | ImageStyleDropdownDefinition>(
  styles: Array<T>,
  titles: Record<string, string>
): Array<T> {
  for (const style of styles) {
    // Localize the titles of the styles, if a title corresponds with
    // a localized default provided by the plugin.
    if (titles[style.title!]) style.title = titles[style.title!];
  }

  return styles;
}

/**
 * Returns the image style component name with the "mediaStyle:" prefix.
 */
function getUIComponentName(name: string): string {
  return `mediaStyle:${name}`;
}
