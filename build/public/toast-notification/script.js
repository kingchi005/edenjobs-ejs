"use strict";
(function () {
    const ul = document.createElement("ul");
    ul.classList.add("notifications");
    ul.style.zIndex = "1";
    ul.id = "toast-notifications";
    document.querySelector("body").prepend(ul);
})();
const notifications = document.querySelector("#toast-notifications"), buttons = document.querySelectorAll(".buttons .btn");
const toastDetails = {
    success: {
        icon: "fa-circle-check",
        text: "Success: This is a success toast.",
    },
    error: {
        icon: "fa-circle-xmark",
        text: "Error: This is an error toast.",
    },
    warning: {
        icon: "fa-triangle-exclamation",
        text: "Warning: This is a warning toast.",
    },
    info: {
        icon: "fa-circle-info",
        text: "Info: This is an information toast.",
    },
};
const toastType = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
};
const removeToast = (toast) => {
    toast.classList.add("hide");
    if (toast.timeoutId)
        clearTimeout(toast.timeoutId);
    setTimeout(() => toast.remove(), 500);
};
function showToast({ type, text, duration }) {
    const icon = toastType[type];
    const toast = document.createElement("li");
    toast.className = `toast ${type}`;
    toast.style.border = `1px solid var(--${type}-toast)`;
    toast.innerHTML = `<div class="column" >
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast);
    toast.timeoutId = setTimeout(() => removeToast(toast), duration || 5000);
}
buttons.forEach((btn) => {
    btn.addEventListener("click", () => showToast({ duration: 5000, text: "texting here", type: btn.id }));
});
//# sourceMappingURL=script.js.map