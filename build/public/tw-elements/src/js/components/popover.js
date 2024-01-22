"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tooltip_1 = __importDefault(require("./tooltip"));
const NAME = "popover";
const DATA_KEY = "te.popover";
const EVENT_KEY = `.${DATA_KEY}`;
const CLASS_PREFIX = "te-popover";
const Default = Object.assign(Object.assign({}, tooltip_1.default.Default), { placement: "right", offset: [0, 8], trigger: "click", content: "", template: '<div class="opacity-0 transition-opacity duration-150 ease-in-out absolute top-0 left-0 z-[1070] block max-w-[267px] break-words bg-white bg-clip-padding border border-neutral-100 rounded-lg shadow-[0_0px_3px_0_rgba(0,0,0,0.07),0_2px_2px_0_rgba(0,0,0,0.04)] text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal dark:bg-neutral-700 dark:border-0 dark:text-white data-[popper-reference-hidden]:hidden" role="tooltip">' +
        '<h3 class="popover-header py-2 px-4 mb-0 border-b-2 border-neutral-100 rounded-t-lg font-medium empty:hidden dark:border-neutral-500"></h3>' +
        '<div class="popover-body p-4 text-[#212529] dark:text-white"></div>' +
        "</div>" });
const DefaultType = Object.assign(Object.assign({}, tooltip_1.default.DefaultType), { content: "(string|element|function)" });
const Event = {
    HIDE: `hide${EVENT_KEY}`,
    HIDDEN: `hidden${EVENT_KEY}`,
    SHOW: `show${EVENT_KEY}`,
    SHOWN: `shown${EVENT_KEY}`,
    INSERTED: `inserted${EVENT_KEY}`,
    CLICK: `click${EVENT_KEY}`,
    FOCUSIN: `focusin${EVENT_KEY}`,
    FOCUSOUT: `focusout${EVENT_KEY}`,
    MOUSEENTER: `mouseenter${EVENT_KEY}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY}`,
};
const SELECTOR_TITLE = ".popover-header";
const SELECTOR_CONTENT = ".popover-body";
class Popover extends tooltip_1.default {
    static get Default() {
        return Default;
    }
    static get NAME() {
        return NAME;
    }
    static get Event() {
        return Event;
    }
    static get DefaultType() {
        return DefaultType;
    }
    isWithContent() {
        return this.getTitle() || this._getContent();
    }
    setContent(tip) {
        this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);
        this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
    }
    _getContent() {
        return this._resolvePossibleFunction(this._config.content);
    }
    _getBasicClassPrefix() {
        return CLASS_PREFIX;
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Popover.getOrCreateInstance(this, config);
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config]();
            }
        });
    }
}
exports.default = Popover;
//# sourceMappingURL=popover.js.map