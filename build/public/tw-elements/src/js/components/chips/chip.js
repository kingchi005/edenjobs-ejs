"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../util/index");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const data_1 = __importDefault(require("../../dom/data"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const templates_1 = require("./templates");
const NAME = "chip";
const DATA_KEY = `te.${NAME}`;
const ATTR_CHIP_CLOSE = "data-te-chip-close";
const ATTR_SELECTOR_CHIP_CLOSE = `[${ATTR_CHIP_CLOSE}]`;
const EVENT_DELETE = "delete.te.chips";
const EVENT_SELECT = "select.te.chip";
const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
const DefaultType = {
    text: "string",
    closeIcon: "boolean",
    img: "object",
    iconSVG: "string",
};
const Default = {
    text: "",
    closeIcon: false,
    img: { path: "", alt: "" },
    iconSVG: defaultIcon,
};
const DefaultClasses = {
    icon: "float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:text-[#8b8b8b] transition-all duration-200 ease-in-out",
    chipElement: "flex justify-between items-center h-[32px] leading-loose py-[5px] px-[12px] mr-4 my-[5px] text-[13px] font-normal text-[#4f4f4f] cursor-pointer bg-[#eceff1] dark:text-white dark:bg-neutral-600 rounded-[16px] transition-[opacity] duration-300 ease-linear [word-wrap: break-word] shadow-none normal-case hover:!shadow-none active:bg-[#cacfd1] inline-block font-medium leading-normal text-[#4f4f4f] text-center no-underline align-middle cursor-pointer select-none border-[.125rem] border-solid border-transparent py-1.5 px-3 text-xs rounded",
    chipCloseIcon: "w-4 float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:fill-[#8b8b8b] dark:fill-gray-400 dark:hover:fill-gray-100 transition-all duration-200 ease-in-out",
};
const DefaultClassesType = {
    icon: "string",
    chipElement: "string",
    chipCloseIcon: "string",
};
class Chip {
    constructor(element, data = {}, classes) {
        this._element = element;
        this._options = this._getConfig(data);
        this._classes = this._getClasses(classes);
    }
    static get NAME() {
        return NAME;
    }
    init() {
        this._appendCloseIcon();
        this._handleDelete();
        this._handleTextChip();
        this._handleClickOnChip();
    }
    dispose() {
        this._element = null;
        this._options = null;
        event_handler_1.default.off(this._element, "click");
    }
    appendChip() {
        const { text, closeIcon, iconSVG } = this._options;
        const chip = (0, templates_1.getChip)({ text, closeIcon, iconSVG }, this._classes);
        return chip;
    }
    _appendCloseIcon(el = this._element) {
        if (selector_engine_1.default.find(ATTR_SELECTOR_CHIP_CLOSE, this._element).length > 0)
            return;
        if (this._options.closeIcon) {
            const createIcon = (0, index_1.element)("span");
            createIcon.classList = this._classes.icon;
            createIcon.setAttribute(ATTR_CHIP_CLOSE);
            createIcon.innerHTML = this._options.iconSVG;
            el.insertAdjacentElement("beforeend", createIcon);
        }
    }
    _handleClickOnChip() {
        event_handler_1.default.on(this._element, "click", (event) => {
            const { textContent } = event.target;
            const obj = {};
            obj.tag = textContent.trim();
            event_handler_1.default.trigger(EVENT_SELECT, { event, obj });
        });
    }
    _handleDelete() {
        const deleteElement = selector_engine_1.default.find(ATTR_SELECTOR_CHIP_CLOSE, this._element);
        if (deleteElement.length === 0)
            return;
        event_handler_1.default.on(this._element, "click", ATTR_SELECTOR_CHIP_CLOSE, () => {
            event_handler_1.default.trigger(this._element, EVENT_DELETE);
            this._element.remove();
        });
    }
    _handleTextChip() {
        if (this._element.innerText !== "")
            return;
        this._element.innerText = this._options.text;
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
exports.default = Chip;
//# sourceMappingURL=chip.js.map