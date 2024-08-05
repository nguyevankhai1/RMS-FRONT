import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import WidgetResize from "@ckeditor/ckeditor5-widget/src/widgetresize";
import type { ViewContainerElement } from "ckeditor5/src/engine";
import type EventInfo from "@ckeditor/ckeditor5-utils/src/eventinfo";

import MediaResizeEditing from "~~/utils/customCkeditor/embeddedMedia/mediaResize/mediaResizeEditing";
import MediaUtils from "./mediaUtils";
import MediaToolbar from "./mediaToolbar";

import "./css/mediaresize.scss";

export default class CustomMedia extends Plugin {
  static get requires() {
    return [WidgetResize, MediaResizeEditing, MediaUtils, MediaToolbar];
  }

  public init(): void {
    this._enableInjectResizer();
  }

  // bind resize handler to element
  private _enableInjectResizer() {
    const editor = this.editor;
    const { editing, data } = editor;

    /** @type {string} - initialized undefined, assigned with element width with length unit inclueded */
    let originalWidth = "";

    data.upcastDispatcher.on("element:figure", (evt, data, conversionApi) => {
      // target only element has css class "media_resized" which is media in model
      if (!data.viewItem._classes.has("media_resized")) return;
      originalWidth = data.viewItem._styles._styles.width || "100%";
    });

    //listen to insert media element, then convert from
    editing.downcastDispatcher.on("insert", (event, data, conversionApi) => {
      if (event.name !== "insert:media") return;

      const viewElement = conversionApi.mapper.toViewElement(data.item);

      if (!viewElement) return;

      const widgetView: ViewContainerElement | null = viewElement._children[0].findAncestor({
        classes: "media",
      });

      if (!widgetView) return;

      const mediaModel = editing.mapper.toModelElement(widgetView);

      editor.data.model.change((writer) => {
        // @ts-ignore _attrs is a Map object
        if (mediaModel && !mediaModel._attrs["mediaStyle"]) {
          writer.setAttribute("mediaStyle", "alignCenter", mediaModel);
          editor.editing.view.change((writer) => {
            writer.addClass("media-style-align-center", widgetView);
          });
        }
      });

      let resizer = editor.plugins.get(WidgetResize).getResizerByViewElement(widgetView);

      if (resizer) {
        resizer.redraw();
        return;
      }

      resizer = editor.plugins.get(WidgetResize).attachTo({
        unit: "%",
        modelElement: mediaModel!,
        viewElement: widgetView,
        editor,

        getHandleHost(domWidgetElement: HTMLElement) {
          // set style(width attribute) for model
          editing.model.change((writer) => {
            writer.setAttributes({ resizedWidth: originalWidth || "100%" }, mediaModel!);
          });

          if (originalWidth) {
            domWidgetElement.style.width = originalWidth;
          }

          return domWidgetElement.querySelector(".ck-media__wrapper") as HTMLElement;
        },

        /*
         * Obtains the handle host.
         * Handle host is an object that  the handles are aligned to.
         */
        getResizeHost(_: HTMLElement): HTMLElement {
          return editing.view.domConverter.mapViewToDom(
            editing.mapper.toViewElement(mediaModel!)!
          )!;
        },

        /* this method is invoke when event mouseup occurs,
         * it's received final value at the moment user releases left mouse
         */
        /**
         * @param newValue Element width with length unit included, percentage in this case
         */
        onCommit(newValue: string) {
          originalWidth = newValue;
          editing.view.change((writer) => {
            writer.setStyle("width", originalWidth, widgetView);
          });
        },
      });

      resizer.on("updateSize", ({ source }: EventInfo) => {
        // @ts-ignore - third party library value
        originalWidth = source._sizeView._label;

        editing.view.change((writer) => {
          writer.setStyle("width", originalWidth, widgetView!);
        });

        if (!widgetView!.hasClass("media_resized")) {
          editing.view.change((writer) => {
            writer.addClass("media_resized", widgetView!);
          });
        }

        if (widgetView!.getStyle("height")) {
          editing.view.change((writer) => writer.removeStyle("height", widgetView!));
        }
      });

      resizer.bind("isEnabled").to(this);
    });
  }
}
