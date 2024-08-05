export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("loading", (el: HTMLElement, bindings) => {
    if (bindings.oldValue == undefined && !bindings.value) return;

    if (bindings.modifiers.spinner) {
      for (let child of el.children) {
        child.classList.toggle("loadingg-blur");
      }
      if (bindings.value) {
        el.style.position = "relative";
        const loadingg =
          '<div class="loadingg">' +
          "  <span" +
          '    class="spinner-border spinner-border-sm text-dark"' +
          '    role="status"' +
          '    aria-hidden="true"' +
          "  ></span>" +
          '  <div class="title text-dark">Loading...</div>' +
          "</div>";
        el.innerHTML = loadingg + el.innerHTML;
      } else if (el.getElementsByClassName("loadingg")[0]) {
        el.getElementsByClassName("loadingg")[0].remove();
      }
    }
    if (bindings.modifiers.skeleton) {
      const elements: any = el.children;
      if (elements.length) {
        elements.forEach((element: HTMLElement) => {
          setHtml(element, bindings.value);
        });
      } else {
        setHtml(el, bindings.value);
      }
    }

    if (bindings.modifiers.dot) {
      setHtmlDot(el, bindings.value);
    }

    if (bindings.modifiers.placeholder) {
      setHtmlPlaceholder(el, bindings.value);
    }
  });

  nuxtApp.vueApp.directive("view", (el: HTMLElement, bindings) => {
    if (!bindings.value) return;
    let modal: any;
    const id: string = Math.random().toFixed(6).toString();

    const content = `
    <div id="${id}" class="modal fade" data-bs-keyboard="false" tabindex="-1" aria-hidden="true" style="user-select: none">
      <div class="modal-dialog modal-dialog-centered justify-content-center">
        <div id="content-${id}" class="modal-content rounded-circle" style="background-color:unset; box-shadow: unset; width: auto">
          ${el.outerHTML}
        </div>
      </div>
    </div>`;

    const divEl = document.createElement("div");
    divEl.innerHTML = content;

    el.addEventListener("click", function (event) {
      document.body.appendChild(divEl);
      const el = document.getElementById(id);
      if (el) {
        modal = new bootstrap.Modal(el);
        modal.show();
      }
    });

    divEl.addEventListener("hidden.bs.modal", () => divEl.remove());
  });
});

function setHtml(el: HTMLElement, value: boolean) {
  if (value) {
    el.innerHTML += `<div class="skeleton"><div class="skeleton-item" style="height: ${el.clientHeight}px;margin-top:-${el.clientHeight}px"></div></div>`;
  } else if (el.getElementsByClassName("skeleton")[0]) {
    el.getElementsByClassName("skeleton")[0].remove();
  }
}

function setHtmlDot(el: HTMLElement, value: boolean) {
  if (value) {
    el.style.position = "relative";
    if (el.getElementsByClassName("loader-dot")[0]) {
      el.getElementsByClassName("loader-dot")[0].remove();
    }
    el.innerHTML += `<div class="loader-dot">
    <div class="loader">
      <div class="loader--dot"></div>
      <div class="loader--dot"></div>
      <div class="loader--dot"></div>
      <div class="loader--dot"></div>
      <div class="loader--dot"></div>
      <div class="loader--dot"></div>
      <div class="loader--text"></div>
    </div>
  </div>`;
  } else if (el.getElementsByClassName("loader-dot")[0]) {
    el.getElementsByClassName("loader-dot")[0].remove();
  }
}

function setHtmlPlaceholder(el: HTMLElement, value: boolean) {
  if (value) {
    if (el.getElementsByClassName("card-text placeholder-glow")[0]) {
      el.getElementsByClassName("card-text placeholder-glow")[0].remove();
    }
    el.innerHTML += `<p class="card-text placeholder-glow" style="height: ${el.clientHeight}px;margin-top:-${el.clientHeight}px; background: #ffffff;z-index: 0;">
    <span class="placeholder col-7"></span>
    <span class="placeholder col-4"></span>
    <span class="placeholder col-4"></span>
    <span class="placeholder col-6"></span>
    <span class="placeholder col-8"></span>
  </p>`;
  } else if (el.getElementsByClassName("card-text placeholder-glow")[0]) {
    el.getElementsByClassName("card-text placeholder-glow")[0].remove();
  }
}
