"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@popperjs/core");
const data_1 = __importDefault(require("../../dom/data"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const index_1 = require("../../util/index");
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const templates_1 = require("./templates");
const keycodes_1 = require("../../util/keycodes");
const sanitizer_1 = require("../../util/sanitizer");
const NAME = "autocomplete";
const DATA_KEY = "te.autocomplete";
const AUTOCOMPLETE_ACTIVE = "data-te-input-state-active";
const ITEMS_ACTIVE = "data-te-autocomplete-item-active";
const AUTOCOMPLETE_FOCUSED = "data-te-input-focused";
const AUTOCOMPLETE_OPEN = "data-te-autocomplete-state-open";
const ATTR_CUSTOM_CONTENT_REF = "data-te-autocomplete-custom-content-ref";
const SELECTOR_DROPDOWN = "[data-te-autocomplete-dropdown-ref]";
const SELECTOR_ITEMS_LIST = "[data-te-autocomplete-items-list-ref]";
const SELECTOR_ITEM = "[data-te-autocomplete-item-ref]";
const SELECTOR_LOADER = "[data-te-autocomplete-loader-ref]";
const SELECTOR_CUSTOM_CONTENT = `[${ATTR_CUSTOM_CONTENT_REF}]`;
const SELECTOR_NOTCH = "[data-te-input-notch-ref]";
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_OPEN = `open${EVENT_KEY}`;
const EVENT_SELECT = `itemSelect${EVENT_KEY}`;
const EVENT_UPDATE = `update${EVENT_KEY}`;
const Default = {
    autoSelect: false,
    container: "body",
    customContent: "",
    debounce: 300,
    displayValue: (value) => value,
    filter: null,
    itemContent: null,
    listHeight: 190,
    loaderCloseDelay: 300,
    noResults: "No results found",
    threshold: 0,
};
const DefaultType = {
    autoSelect: "boolean",
    container: "string",
    customContent: "string",
    debounce: "number",
    displayValue: "function",
    filter: "(null|function)",
    itemContent: "(null|function)",
    listHeight: "number",
    loaderCloseDelay: "number",
    noResults: "string",
    threshold: "number",
};
const DefaultClasses = {
    autocompleteItem: "flex flex-row items-center justify-between w-full px-4 py-[0.4375rem] truncate text-gray-700 bg-transparent select-none cursor-pointer hover:[&:not([data-te-autocomplete-option-disabled])]:bg-black/5 data-[te-autocomplete-item-active]:bg-black/5 data-[data-te-autocomplete-option-disabled]:text-gray-400 data-[data-te-autocomplete-option-disabled]:cursor-default dark:text-gray-200 dark:hover:[&:not([data-te-autocomplete-option-disabled])]:bg-white/30 dark:data-[te-autocomplete-item-active]:bg-white/30",
    autocompleteList: "list-none m-0 p-0 overflow-y-auto",
    autocompleteLoader: "absolute right-1 top-2 w-[1.4rem] h-[1.4rem] border-[0.15em]",
    dropdown: "relative outline-none min-w-[100px] m-0 scale-y-[0.8] opacity-0 bg-white shadow-[0_2px_5px_0_rgba(0,0,0,0.16),_0_2px_10px_0_rgba(0,0,0,0.12)] transition duration-200 motion-reduce:transition-none data-[te-autocomplete-state-open]:scale-y-100 data-[te-autocomplete-state-open]:opacity-100 dark:bg-zinc-700",
    dropdownContainer: "z-[1070]",
    scrollbar: "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-button]:block [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-button]:bg-transparent [&::-webkit-scrollbar-track-piece]:bg-transparent [&::-webkit-scrollbar-track-piece]:rounded-none [&::-webkit-scrollbar-track-piece]: [&::-webkit-scrollbar-track-piece]:rounded-l [&::-webkit-scrollbar-thumb]:h-[50px] [&::-webkit-scrollbar-thumb]:bg-[#999] [&::-webkit-scrollbar-thumb]:rounded",
    spinnerIcon: "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
};
const DefaultClassesType = {
    autocompleteItem: "string",
    autocompleteList: "string",
    autocompleteLoader: "string",
    dropdown: "string",
    dropdownContainer: "string",
    scrollbar: "string",
    spinnerIcon: "string",
};
class Autocomplete {
    constructor(element, options, classes) {
        this._element = element;
        this._options = this._getConfig(options);
        this._classes = this._getClasses(classes);
        this._getContainer();
        this._input = selector_engine_1.default.findOne("input", element);
        this._notch = selector_engine_1.default.findOne(SELECTOR_NOTCH, element);
        this._customContent = selector_engine_1.default.findOne(SELECTOR_CUSTOM_CONTENT, element);
        this._loader = (0, templates_1.getLoaderTemplate)(this._classes);
        this._popper = null;
        this._debounceTimeoutId = null;
        this._loaderTimeout = null;
        this._activeItemIndex = -1;
        this._activeItem = null;
        this._filteredResults = null;
        this._lastQueryValue = null;
        this._canOpenOnFocus = true;
        this._isOpen = false;
        this._outsideClickHandler = this._handleOutsideClick.bind(this);
        this._inputFocusHandler = this._handleInputFocus.bind(this);
        this._userInputHandler = this._handleUserInput.bind(this);
        this._keydownHandler = this._handleKeydown.bind(this);
        if (element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
        this._init();
    }
    static get NAME() {
        return NAME;
    }
    get filter() {
        return this._options.filter;
    }
    get dropdown() {
        return selector_engine_1.default.findOne(SELECTOR_DROPDOWN, this._dropdownContainer);
    }
    get items() {
        return selector_engine_1.default.find(SELECTOR_ITEM, this._dropdownContainer);
    }
    get itemsList() {
        return selector_engine_1.default.findOne(SELECTOR_ITEMS_LIST, this._dropdownContainer);
    }
    initSearch(value) {
        this._filterResults(value);
    }
    _getContainer() {
        this._container = selector_engine_1.default.findOne(this._options.container);
    }
    _getConfig(config) {
        const dataAttributes = manipulator_1.default.getDataAttributes(this._element);
        config = Object.assign(Object.assign(Object.assign({}, Default), dataAttributes), config);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _init() {
        this._initDropdown();
        this._updateInputState();
        this._setInputAriaAttributes();
        this._listenToInputFocus();
        this._listenToUserInput();
        this._listenToKeydown();
    }
    _initDropdown() {
        this._dropdownContainerId = this._element.id
            ? `autocomplete-dropdown-${this._element.id}`
            : (0, index_1.getUID)("autocomplete-dropdown-");
        const settings = {
            id: this._dropdownContainerId,
            items: [],
            width: this._input.offsetWidth,
            options: this._options,
        };
        this._dropdownContainer = (0, templates_1.getDropdownTemplate)(settings, this._classes);
        if (this._options.customContent !== "") {
            const customContent = this._options.customContent;
            const sanitizedCustomContent = (0, sanitizer_1.sanitizeHtml)(customContent, sanitizer_1.DefaultWhitelist, null);
            this.dropdown.insertAdjacentHTML("beforeend", sanitizedCustomContent);
        }
    }
    _setInputAriaAttributes() {
        this._input.setAttribute("role", "combobox");
        this._input.setAttribute("aria-expanded", false);
        this._input.setAttribute("aria-owns", this._dropdownContainerId);
        this._input.setAttribute("aria-haspopup", true);
        this._input.setAttribute("autocomplete", "off");
    }
    _updateInputState() {
        var _a, _b;
        if (this._input.value !== "" || this._isOpen) {
            this._input.setAttribute(AUTOCOMPLETE_ACTIVE, "");
            (_a = this._notch) === null || _a === void 0 ? void 0 : _a.setAttribute(AUTOCOMPLETE_ACTIVE, "");
        }
        else {
            this._input.removeAttribute(AUTOCOMPLETE_ACTIVE);
            (_b = this._notch) === null || _b === void 0 ? void 0 : _b.removeAttribute(AUTOCOMPLETE_ACTIVE);
        }
    }
    _listenToInputFocus() {
        event_handler_1.default.on(this._input, "focus", this._inputFocusHandler);
    }
    _handleInputFocus(event) {
        const { value } = event.target;
        const threshold = this._options.threshold;
        if (!this._canOpenOnFocus) {
            this._canOpenOnFocus = true;
            return;
        }
        if (value.length < threshold) {
            return;
        }
        if (this._lastQueryValue !== value) {
            this._filterResults(value);
        }
        else {
            this.open();
        }
    }
    _listenToWindowResize() {
        event_handler_1.default.on(window, "resize", this._handleWindowResize.bind(this));
    }
    _handleWindowResize() {
        if (this._dropdownContainer) {
            this._updateDropdownWidth();
        }
    }
    _updateDropdownWidth() {
        const inputWidth = this._input.offsetWidth;
        manipulator_1.default.addStyle(this._dropdownContainer, { width: `${inputWidth}px` });
    }
    _listenToUserInput() {
        event_handler_1.default.on(this._input, "input", this._userInputHandler);
    }
    _handleUserInput(event) {
        const { value } = event.target;
        const threshold = this._options.threshold;
        const debounceTime = this._options.debounce;
        if (!this.filter) {
            return;
        }
        if (value.length < threshold) {
            if (this._isOpen) {
                this.close();
            }
            return;
        }
        this._debounceFilter(value, debounceTime);
    }
    _debounceFilter(searchTerm, debounceTime) {
        if (this._debounceTimeoutId) {
            clearTimeout(this._debounceTimeoutId);
        }
        this._debounceTimeoutId = setTimeout(() => {
            this._filterResults(searchTerm);
        }, debounceTime);
    }
    _filterResults(value) {
        this._lastQueryValue = value;
        const data = this.filter(value);
        if (this._isPromise(data)) {
            this._asyncUpdateResults(data);
        }
        else {
            this._updateResults(data);
        }
    }
    _isPromise(value) {
        return !!value && typeof value.then === "function";
    }
    _asyncUpdateResults(data) {
        this._resetActiveItem();
        this._showLoader();
        data.then((items) => {
            this._updateResults(items);
            this._loaderTimeout = setTimeout(() => {
                this._hideLoader();
                this._loaderTimeout = null;
            }, this._options.loaderCloseDelay);
        });
    }
    _resetActiveItem() {
        const currentActive = this._activeItem;
        if (currentActive) {
            currentActive.removeAttribute(ITEMS_ACTIVE);
            this._activeItem = null;
            this._activeItemIndex = -1;
        }
    }
    _showLoader() {
        this._element.appendChild(this._loader);
    }
    _hideLoader() {
        const loader = selector_engine_1.default.findOne(SELECTOR_LOADER, this._element);
        if (loader) {
            this._element.removeChild(this._loader);
        }
    }
    _updateResults(data) {
        this._resetActiveItem();
        this._filteredResults = data;
        event_handler_1.default.trigger(this._element, EVENT_UPDATE, { results: data });
        const itemsList = selector_engine_1.default.findOne(SELECTOR_ITEMS_LIST, this._dropdownContainer);
        const newTemplate = (0, templates_1.getItemsTemplate)(data, this._options, this._classes.autocompleteItem);
        const noResultsTemplate = (0, templates_1.getNoResultsTemplate)(this._options.noResults, this._classes);
        if (data.length === 0 && this._options.noResults !== "") {
            itemsList.innerHTML = noResultsTemplate;
        }
        else {
            itemsList.innerHTML = newTemplate;
        }
        if (!this._isOpen) {
            this.open();
        }
        if (this._popper) {
            this._popper.forceUpdate();
        }
    }
    _listenToKeydown() {
        event_handler_1.default.on(this._element, "keydown", this._keydownHandler);
    }
    _handleKeydown(event) {
        if (this._isOpen) {
            this._handleOpenKeydown(event);
        }
        else {
            this._handleClosedKeydown(event);
        }
    }
    _handleOpenKeydown(event) {
        const key = event.keyCode;
        if (key === keycodes_1.TAB && this._options.autoSelect) {
            this._selectActiveItem();
        }
        if (key === keycodes_1.ESCAPE || (key === keycodes_1.UP_ARROW && event.altKey)) {
            this.close();
            this._input.focus();
            return;
        }
        const isCloseKey = key === keycodes_1.ESCAPE || (key === keycodes_1.UP_ARROW && event.altKey) || key === keycodes_1.TAB;
        if (isCloseKey) {
            this.close();
            this._input.focus();
            return;
        }
        switch (key) {
            case keycodes_1.DOWN_ARROW:
                this._setActiveItem(this._activeItemIndex + 1);
                this._scrollToItem(this._activeItem);
                break;
            case keycodes_1.UP_ARROW:
                this._setActiveItem(this._activeItemIndex - 1);
                this._scrollToItem(this._activeItem);
                break;
            case keycodes_1.HOME:
                if (this._activeItemIndex > -1) {
                    this._setActiveItem(0);
                    this._scrollToItem(this._activeItem);
                }
                else {
                    this._input.setSelectionRange(0, 0);
                }
                break;
            case keycodes_1.END:
                if (this._activeItemIndex > -1) {
                    this._setActiveItem(this.items.length - 1);
                    this._scrollToItem(this._activeItem);
                }
                else {
                    const end = this._input.value.length;
                    this._input.setSelectionRange(end, end);
                }
                break;
            case keycodes_1.ENTER:
                event.preventDefault();
                if (this._activeItemIndex > -1) {
                    const item = this._filteredResults[this._activeItemIndex];
                    this._handleSelection(item);
                }
                return;
            default:
                return;
        }
        event.preventDefault();
    }
    _setActiveItem(index) {
        const items = this.items;
        if (!items[index]) {
            return;
        }
        this._updateActiveItem(items[index], index);
    }
    _updateActiveItem(newActiveItem, index) {
        const currentActiveItem = this._activeItem;
        if (currentActiveItem) {
            currentActiveItem.removeAttribute(ITEMS_ACTIVE);
        }
        newActiveItem.setAttribute(ITEMS_ACTIVE, "");
        this._activeItemIndex = index;
        this._activeItem = newActiveItem;
    }
    _scrollToItem(item) {
        if (!item) {
            return;
        }
        const list = this.itemsList;
        const listHeight = list.offsetHeight;
        const itemIndex = this.items.indexOf(item);
        const itemHeight = item.offsetHeight;
        const scrollTop = list.scrollTop;
        if (itemIndex > -1) {
            const itemOffset = itemIndex * itemHeight;
            const isBelow = itemOffset + itemHeight > scrollTop + listHeight;
            const isAbove = itemOffset < scrollTop;
            if (isAbove) {
                list.scrollTop = itemOffset;
            }
            else if (isBelow) {
                list.scrollTop = itemOffset - listHeight + itemHeight;
            }
            else {
                list.scrollTop = scrollTop;
            }
        }
    }
    _handleClosedKeydown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
        const key = event.keyCode;
        const isOpenKey = key === keycodes_1.ENTER || key === keycodes_1.DOWN_ARROW || key === keycodes_1.DOWN_ARROW;
        if (isOpenKey) {
            this.open();
        }
    }
    open() {
        if (this._lastQueryValue === null) {
            this._filterResults("");
        }
        const openEvent = event_handler_1.default.trigger(this._element, EVENT_OPEN);
        if (this._isOpen || openEvent.defaultPrevented) {
            return;
        }
        this._updateDropdownWidth();
        this._listenToWindowResize();
        this._popper = (0, core_1.createPopper)(this._element, this._dropdownContainer, {
            modifiers: [
                {
                    name: "offset",
                    options: {
                        offset: [0, 1],
                    },
                },
            ],
        });
        this._container.appendChild(this._dropdownContainer);
        this._listenToOutsideClick();
        this._listenToItemsClick();
        setTimeout(() => {
            this.dropdown.setAttribute(AUTOCOMPLETE_OPEN, "");
            this._isOpen = true;
            this._setInputActiveStyles();
            this._updateInputState();
        }, 0);
    }
    _listenToOutsideClick() {
        event_handler_1.default.on(document, "click", this._outsideClickHandler);
    }
    _handleOutsideClick(event) {
        const isInput = this._input === event.target;
        const isDropdown = event.target === this._dropdownContainer;
        const isDropdownContent = this._dropdownContainer && this._dropdownContainer.contains(event.target);
        if (!isInput && !isDropdown && !isDropdownContent) {
            this.close();
        }
    }
    _listenToItemsClick() {
        const itemsList = selector_engine_1.default.findOne(SELECTOR_ITEMS_LIST, this._dropdownContainer);
        event_handler_1.default.on(itemsList, "click", this._handleItemsClick.bind(this));
    }
    _handleItemsClick(event) {
        const target = selector_engine_1.default.closest(event.target, SELECTOR_ITEM);
        const targetIndex = manipulator_1.default.getDataAttribute(target, "index");
        const item = this._filteredResults[targetIndex];
        this._handleSelection(item);
    }
    _selectActiveItem() {
        const item = this._filteredResults[this._activeItemIndex];
        if (!item) {
            return;
        }
        const value = this._options.displayValue(item);
        const selectEvent = event_handler_1.default.trigger(this._element, EVENT_SELECT, {
            value: item,
        });
        if (selectEvent.defaultPrevented) {
            return;
        }
        setTimeout(() => {
            this._canOpenOnFocus = false;
            this._updateInputValue(value);
            this._updateInputState();
        }, 0);
    }
    _handleSelection(item) {
        const value = this._options.displayValue(item);
        const selectEvent = event_handler_1.default.trigger(this._element, EVENT_SELECT, {
            value: item,
        });
        if (item === undefined) {
            return;
        }
        if (selectEvent.defaultPrevented) {
            return;
        }
        setTimeout(() => {
            this._canOpenOnFocus = false;
            this._updateInputValue(value);
            this._updateInputState();
            this._input.focus();
            this.close();
        }, 0);
    }
    _updateInputValue(value) {
        this._input.value = value;
    }
    _setInputActiveStyles() {
        this._input.setAttribute(AUTOCOMPLETE_FOCUSED, "");
    }
    close() {
        var _a;
        const closeEvent = event_handler_1.default.trigger(this._element, EVENT_CLOSE);
        if (!this._isOpen || closeEvent.defaultPrevented) {
            return;
        }
        this._resetActiveItem();
        this._removeDropdownEvents();
        this.dropdown.removeAttribute(AUTOCOMPLETE_OPEN);
        event_handler_1.default.on(this.dropdown, "transitionend", this._handleDropdownTransitionEnd.bind(this));
        this._input.removeAttribute(AUTOCOMPLETE_FOCUSED);
        if (!this._input.value) {
            this._input.removeAttribute(AUTOCOMPLETE_ACTIVE);
            (_a = this._notch) === null || _a === void 0 ? void 0 : _a.removeAttribute(AUTOCOMPLETE_ACTIVE);
        }
    }
    _removeDropdownEvents() {
        const itemsList = selector_engine_1.default.findOne(SELECTOR_ITEMS_LIST, this._dropdownContainer);
        event_handler_1.default.off(itemsList, "click");
        event_handler_1.default.off(document, "click", this._outsideClickHandler);
        event_handler_1.default.off(window, "resize", this._handleWindowResize.bind(this));
    }
    _handleDropdownTransitionEnd(event) {
        if (this._isOpen && event && event.propertyName === "opacity") {
            this._popper.destroy();
            if (this._dropdownContainer) {
                this._container.removeChild(this._dropdownContainer);
            }
            this._isOpen = false;
            event_handler_1.default.off(this.dropdown, "transitionend");
            this._canOpenOnFocus = true;
        }
    }
    dispose() {
        if (this._isOpen) {
            this.close();
        }
        this._removeInputAndElementEvents();
        this._dropdownContainer.remove();
        data_1.default.removeData(this._element, DATA_KEY);
    }
    _removeInputAndElementEvents() {
        event_handler_1.default.off(this._input, "focus", this._inputFocusHandler);
        event_handler_1.default.off(this._input, "input", this._userInputHandler);
        event_handler_1.default.off(this._element, "keydown", this._keydownHandler);
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Autocomplete(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](options);
            }
        });
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
exports.default = Autocomplete;
//# sourceMappingURL=index.js.map