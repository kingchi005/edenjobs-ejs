(function () {
	const ul = document.createElement("ul");
	ul.classList.add("notifications");
	ul.style.zIndex = "1";
	ul.id = "toast-notifications";
	document.querySelector("body").prepend(ul);
})();

const notifications = document.querySelector("#toast-notifications"),
	buttons = document.querySelectorAll(".buttons .btn");

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
	if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
	setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
};

/**
 *
 * @param {{ type:"success"|"error"|"warning"|"info", text:string, duration:number }} param
 */
function showToast({ type, text, duration }) {
	// Getting the icon and text for the toast based on the id passed
	const icon = toastType[type];
	const toast = document.createElement("li"); // Creating a new 'li' element for the toast
	toast.className = `toast ${type}`; // Setting the classes for the toast
	// toast.style.border = `1px solid var(--${type})`;
	toast.style.border = `1px solid var(--${type}-toast)`;
	// Setting the inner HTML for the toast
	toast.innerHTML = `<div class="column" >
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
	notifications.appendChild(toast); // Append the toast to the notification ul
	// Setting a timeout to remove the toast after the specified duration
	toast.timeoutId = setTimeout(() => removeToast(toast), duration);
}

// Adding a click event listener to each button to create a toast when clicked
buttons.forEach((btn) => {
	btn.addEventListener("click", () =>
		showToast({ duration: 5000, text: "texting here", type: btn.id })
	);
});
