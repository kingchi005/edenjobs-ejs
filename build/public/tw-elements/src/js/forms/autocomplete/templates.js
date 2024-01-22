"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNoResultsTemplate = exports.getLoaderTemplate = exports.getItemsTemplate = exports.getDropdownTemplate = void 0;
const index_1 = require("../../util/index");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const sanitizer_1 = require("../../util/sanitizer");
const AUTOCOMPLETE_DROPDOWN_REF = "data-te-autocomplete-dropdown-ref";
const AUTOCOMPLETE_ITEMS_LIST_REF = "data-te-autocomplete-items-list-ref";
const AUTOCOMPLETE_ITEM_REF = "data-te-autocomplete-item-ref";
const AUTOCOMPLETE_LOADER_REF = "data-te-autocomplete-loader-ref";
function getDropdownTemplate(settings, classes) {
    const { id, items, width, options } = settings;
    const dropdownContainer = (0, index_1.element)("div");
    manipulator_1.default.addClass(dropdownContainer, classes.dropdownContainer);
    manipulator_1.default.addStyle(dropdownContainer, { width: `${width}px` });
    dropdownContainer.setAttribute("id", id);
    const dropdown = (0, index_1.element)("div");
    dropdown.setAttribute(AUTOCOMPLETE_DROPDOWN_REF, "");
    manipulator_1.default.addClass(dropdown, classes.dropdown);
    const itemsList = (0, index_1.element)("ul");
    const listHeight = options.listHeight;
    itemsList.setAttribute(AUTOCOMPLETE_ITEMS_LIST_REF, "");
    manipulator_1.default.addClass(itemsList, classes.autocompleteList);
    manipulator_1.default.addClass(itemsList, classes.scrollbar);
    manipulator_1.default.addStyle(itemsList, { maxHeight: `${listHeight}px` });
    itemsList.setAttribute("role", "listbox");
    const itemsListTemplate = getItemsTemplate(items, options);
    itemsList.innerHTML = itemsListTemplate;
    dropdown.appendChild(itemsList);
    dropdownContainer.appendChild(dropdown);
    return dropdownContainer;
}
exports.getDropdownTemplate = getDropdownTemplate;
function getItemsTemplate(items = [], options, itemClasses) {
    const displayValue = options.displayValue;
    const itemContent = options.itemContent;
    return `
    ${items
        .map((item, index) => {
        const content = typeof itemContent === "function"
            ? (0, sanitizer_1.sanitizeHtml)(itemContent(item), sanitizer_1.DefaultWhitelist, null)
            : displayValue(item);
        return `<li data-te-index="${index}" role="option" class="${itemClasses}" ${AUTOCOMPLETE_ITEM_REF} >${content}</li>`;
    })
        .join("")}
  `;
}
exports.getItemsTemplate = getItemsTemplate;
function getLoaderTemplate(classes) {
    const container = (0, index_1.element)("div");
    container.setAttribute(AUTOCOMPLETE_LOADER_REF, "");
    manipulator_1.default.addClass(container, classes.autocompleteLoader);
    manipulator_1.default.addClass(container, classes.spinnerIcon);
    container.setAttribute("role", "status");
    const content = `<span class="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">Loading...</span>`;
    container.innerHTML = content;
    return container;
}
exports.getLoaderTemplate = getLoaderTemplate;
function getNoResultsTemplate(message, classes) {
    return `<li class="${classes.autocompleteItem}">${message}</li>`;
}
exports.getNoResultsTemplate = getNoResultsTemplate;
//# sourceMappingURL=templates.js.map