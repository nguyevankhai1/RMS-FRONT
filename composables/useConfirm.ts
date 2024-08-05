declare var bootstrap: any;

type COLOR = "success" | "primary" | "danger" | "info" | "warning" | "secondary" | "dark" | "light";

interface Props {
  confirmFn: Function;
  confirmBtnColor: COLOR;
  message: string;
  hidden?: Function;
  t?: Function;
}

export const useConfirm = (props: Props) => {
  let modal: any;
  const id: string = Math.random().toString();

  const title = props.t("confirmTitle");

  const build = () => {
    const divEl = document.createElement("div");

    const content = `<div class="modal fade" id="${id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">${title}</h3>
              <button id="cancel-${id}"  type="button" class="btn-close cancelBtn" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body fs-5">
              ${props.message || "Bạn có chắc chắn muốn xóa thông tin này không?"}
            </div>
            <div class="modal-footer">
              <button type="button" id="cancel-${id}" class="btn btn-secondary btn-sm cancelBtn" data-bs-dismiss="modal">${props.t(
      "cancel"
    )}</button>
              <button id="confirm-${id}" type="button" class="btn btn-${
      props.confirmBtnColor || "primary"
    } btn-sm" data-bs-dismiss="modal">${title}</button>
            </div>
          </div>
        </div>
      </div>`;

    divEl.innerHTML = content;

    divEl.addEventListener("shown.bs.modal", function (event) {
      const elConfirm = document.getElementById(`confirm-${id}`);
      if (elConfirm) {
        elConfirm.addEventListener("click", function () {
          modal.hide();
          props.confirmFn();
        });
      }

      // const elCancel = document.getElementById(`cancel-${id}`);
      // if (elCancel) {
      //   elCancel.addEventListener("click", function () {
      //     if (hidden) {
      //       hidden();
      //     }
      //   });
      // }

      const cancelBtns = document.querySelectorAll(".cancelBtn");
      if (cancelBtns.length === 0) return;

      const cancelAction = (element: Element) => {
        element.addEventListener("click", () => {
          if (props.hidden) props.hidden();
        });
      };

      cancelBtns.forEach((btn) => cancelAction(btn));
    });

    divEl.addEventListener("hidden.bs.modal", function (event) {
      divEl.remove();
    });

    return divEl;
  };

  const show = () => {
    document.body.appendChild(build());
    const el = document.getElementById(id);
    if (el) {
      modal = new bootstrap.Modal(el);
      modal.show();
    }
  };
  return {
    build,
    show,
  };
};
