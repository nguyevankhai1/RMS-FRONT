import CookieType from "~~/enums/cookieType";
import MenuSidebarConfig from "~~/configs/layout/MenuSidebarConfig";
import ColorPickerFragmentView from "@ckeditor/ckeditor5-ui/src/colorselector/colorpickerfragmentview";

export const useMenu: any = () => {
  return useState<any | []>("menu", () => []);
};
export const useListMenu: any = () => {
  return useState<any | []>("list-menu", () => []);
};

export const isClose = useCookie<Boolean>(CookieType.MENU_IS_CLOSE);

export const init = async () => {
  const menuState = useMenu();
  const listMenuState = useListMenu();
  if (isClose.value === undefined) {
    isClose.value = false;
  } else {
    toggleMenuBar(isClose.value);
  }
  listMenuState.value = MenuSidebarConfig;
  menuState.value = MenuSidebarConfig;
};

export const toggleMenuBar = (v: any) => {
  isClose.value = v;
  if (process.client) {
    const body = document.getElementById("kt_body")!;
    const minimize = "data-kt-aside-minimize";
    if (isClose.value) body.setAttribute(minimize, "on");
    else body.removeAttribute(minimize);
  }
};

export type typeMenu = "menu-sub" | "menu-item";

let nameOld = ref("");
export const toggleMenuItem = (
  $e: any,
  type: typeMenu,
  child?: any,
  name?: any
) => {
  const parent = $e.target.closest(
    "." + ((child || []).length > 0 ? "menu-item" : type)
  );
  if (!parent) {
    const show: any = document.getElementsByClassName(
      "menu-item menu-accordion show"
    );
    Array.prototype.forEach.call(show, function (el) {
      el.classList.toggle("show");
    });
  }

  if (parent && parent.classList[0] === "menu-item") {
    if (child === undefined || (child || []).length === 0) {
      const menuitem = document.getElementsByClassName(
        "menu-item menu-accordion show"
      );
      for (var i = 0; i < menuitem.length; i++) {
        if (name !== nameOld.value) {
          menuitem[i].classList.toggle("show");
        }
      }
    } else {
      parent.getElementsByClassName(
        "router-link-active router-link-exact-active menu-link"
      ).className = "menu-link";
    }
    parent.classList.toggle("show");
  }
  nameOld.value = name;
};
