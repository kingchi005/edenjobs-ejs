"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultClasses = void 0;
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
require("detect-autofill");
const NAME = "input";
const DATA_KEY = "te.input";
const DATA_WRAPPER = "data-te-input-wrapper-init";
const DATA_NOTCH = "data-te-input-notch-ref";
const DATA_NOTCH_LEADING = "data-te-input-notch-leading-ref";
const DATA_NOTCH_MIDDLE = "data-te-input-notch-middle-ref";
const DATA_NOTCH_TRAILING = "data-te-input-notch-trailing-ref";
const DATA_HELPER = "data-te-input-helper-ref";
const DATA_PLACEHOLDER_ACTIVE = "data-te-input-placeholder-active";
const DATA_ACTIVE = "data-te-input-state-active";
const DATA_FOCUSED = "data-te-input-focused";
const DATA_FORM_COUNTER = "data-te-input-form-counter";
const SELECTOR_OUTLINE_INPUT = `[${DATA_WRAPPER}] input`;
const SELECTOR_OUTLINE_TEXTAREA = `[${DATA_WRAPPER}] textarea`;
const SELECTOR_NOTCH = `[${DATA_NOTCH}]`;
const SELECTOR_NOTCH_LEADING = `[${DATA_NOTCH_LEADING}]`;
const SELECTOR_NOTCH_MIDDLE = `[${DATA_NOTCH_MIDDLE}]`;
const SELECTOR_HELPER = `[${DATA_HELPER}]`;
const Default = {
    inputFormWhite: false,
};
const DefaultType = {
    inputFormWhite: "(boolean)",
};
exports.DefaultClasses = {
    notch: "group flex absolute left-0 top-0 w-full max-w-full h-full text-left pointer-events-none",
    notchLeading: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none left-0 top-0 h-full w-2 border-r-0 rounded-l-[0.25rem] group-data-[te-input-focused]:border-r-0 group-data-[te-input-state-active]:border-r-0",
    notchLeadingNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
    notchLeadingWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[-1px_0_0_#ffffff,_0_1px_0_0_#ffffff,_0_-1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
    notchMiddle: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow-0 shrink-0 basis-auto w-auto max-w-[calc(100%-1rem)] h-full border-r-0 border-l-0 group-data-[te-input-focused]:border-x-0 group-data-[te-input-state-active]:border-x-0 group-data-[te-input-focused]:border-t group-data-[te-input-state-active]:border-t group-data-[te-input-focused]:border-solid group-data-[te-input-state-active]:border-solid group-data-[te-input-focused]:border-t-transparent group-data-[te-input-state-active]:border-t-transparent",
    notchMiddleNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
    notchMiddleWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
    notchTrailing: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow h-full border-l-0 rounded-r-[0.25rem] group-data-[te-input-focused]:border-l-0 group-data-[te-input-state-active]:border-l-0",
    notchTrailingNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
    notchTrailingWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[1px_0_0_#ffffff,_0_-1px_0_0_#ffffff,_0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
    counter: "text-right leading-[1.6]",
};
const DefaultClassesType = {
    notch: "string",
    notchLeading: "string",
    notchLeadingNormal: "string",
    notchLeadingWhite: "string",
    notchMiddle: "string",
    notchMiddleNormal: "string",
    notchMiddleWhite: "string",
    notchTrailing: "string",
    notchTrailingNormal: "string",
    notchTrailingWhite: "string",
    counter: "string",
};
class Input {
    constructor(element, config, classes) {
        this._config = this._getConfig(config, element);
        this._element = element;
        this._classes = this._getClasses(classes);
        this._label = null;
        this._labelWidth = 0;
        this._labelMarginLeft = 0;
        this._notchLeading = null;
        this._notchMiddle = null;
        this._notchTrailing = null;
        this._initiated = false;
        this._helper = null;
        this._counter = false;
        this._counterElement = null;
        this._maxLength = 0;
        this._leadingIcon = null;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this.init();
        }
    }
    static get NAME() {
        return NAME;
    }
    get input() {
        const inputElement = selector_engine_1.default.findOne("input", this._element) ||
            selector_engine_1.default.findOne("textarea", this._element);
        return inputElement;
    }
    init() {
        if (this._initiated) {
            return;
        }
        this._getLabelData();
        this._applyDivs();
        this._applyNotch();
        this._activate();
        this._getHelper();
        this._getCounter();
        this._getEvents();
        this._initiated = true;
    }
    update() {
        this._getLabelData();
        this._getNotchData();
        this._applyNotch();
        this._activate();
        this._getHelper();
        this._getCounter();
    }
    forceActive() {
        this.input.setAttribute(DATA_ACTIVE, "");
        selector_engine_1.default.findOne(SELECTOR_NOTCH, this.input.parentNode).setAttribute(DATA_ACTIVE, "");
    }
    forceInactive() {
        this.input.removeAttribute(DATA_ACTIVE);
        selector_engine_1.default.findOne(SELECTOR_NOTCH, this.input.parentNode).removeAttribute(DATA_ACTIVE);
    }
    dispose() {
        this._removeBorder();
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    _getConfig(config, element) {
        config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(element)), (typeof config === "object" ? config : {}));
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, exports.DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _getLabelData() {
        this._label = selector_engine_1.default.findOne("label", this._element);
        if (this._label === null) {
            this._showPlaceholder();
        }
        else {
            this._getLabelWidth();
            this._getLabelPositionInInputGroup();
            this._toggleDefaultDatePlaceholder();
        }
    }
    _getHelper() {
        this._helper = selector_engine_1.default.findOne(SELECTOR_HELPER, this._element);
    }
    _getCounter() {
        this._counter = manipulator_1.default.getDataAttribute(this.input, "inputShowcounter");
        if (this._counter) {
            this._maxLength = this.input.maxLength;
            this._showCounter();
        }
    }
    _getEvents() {
        event_handler_1.default.on(this._element, "focus", "input", Input.activate(new Input()));
        event_handler_1.default.on(this._element, "input", "input", Input.activate(new Input()));
        event_handler_1.default.on(this._element, "blur", "input", Input.deactivate(new Input()));
        event_handler_1.default.on(this._element, "focus", "textarea", Input.activate(new Input()));
        event_handler_1.default.on(this._element, "input", "textarea", Input.activate(new Input()));
        event_handler_1.default.on(this._element, "blur", "textarea", Input.deactivate(new Input()));
        event_handler_1.default.on(window, "shown.te.modal", (e) => {
            selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, e.target).forEach((element) => {
                const instance = Input.getInstance(element.parentNode);
                if (!instance) {
                    return;
                }
                instance.update();
            });
            selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, e.target).forEach((element) => {
                const instance = Input.getInstance(element.parentNode);
                if (!instance) {
                    return;
                }
                instance.update();
            });
        });
        event_handler_1.default.on(window, "shown.te.dropdown", (e) => {
            const target = e.target.parentNode.querySelector("[data-te-dropdown-menu-ref]");
            if (target) {
                selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, target).forEach((element) => {
                    const instance = Input.getInstance(element.parentNode);
                    if (!instance) {
                        return;
                    }
                    instance.update();
                });
                selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, target).forEach((element) => {
                    const instance = Input.getInstance(element.parentNode);
                    if (!instance) {
                        return;
                    }
                    instance.update();
                });
            }
        });
        event_handler_1.default.on(window, "shown.te.tab", (e) => {
            let targetId;
            if (e.target.href) {
                targetId = e.target.href.split("#")[1];
            }
            else {
                targetId = manipulator_1.default.getDataAttribute(e.target, "target").split("#")[1];
            }
            const target = selector_engine_1.default.findOne(`#${targetId}`);
            selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, target).forEach((element) => {
                const instance = Input.getInstance(element.parentNode);
                if (!instance) {
                    return;
                }
                instance.update();
            });
            selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, target).forEach((element) => {
                const instance = Input.getInstance(element.parentNode);
                if (!instance) {
                    return;
                }
                instance.update();
            });
        });
        event_handler_1.default.on(window, "reset", (e) => {
            selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, e.target).forEach((element) => {
                const instance = Input.getInstance(element.parentNode);
                if (!instance) {
                    return;
                }
                instance.forceInactive();
            });
            selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, e.target).forEach((element) => {
                const instance = Input.getInstance(element.parentNode);
                if (!instance) {
                    return;
                }
                instance.forceInactive();
            });
        });
        event_handler_1.default.on(window, "onautocomplete", (e) => {
            const instance = Input.getInstance(e.target.parentNode);
            if (!instance || !e.cancelable) {
                return;
            }
            instance.forceActive();
        });
    }
    _showCounter() {
        const counters = selector_engine_1.default.find(`[${DATA_FORM_COUNTER}]`, this._element);
        if (counters.length > 0) {
            return;
        }
        this._counterElement = document.createElement("div");
        manipulator_1.default.addClass(this._counterElement, this._classes.counter);
        this._counterElement.setAttribute(DATA_FORM_COUNTER, "");
        const actualLength = this.input.value.length;
        this._counterElement.innerHTML = `${actualLength} / ${this._maxLength}`;
        this._helper.appendChild(this._counterElement);
        this._bindCounter();
    }
    _bindCounter() {
        event_handler_1.default.on(this.input, "input", () => {
            const actualLength = this.input.value.length;
            this._counterElement.innerHTML = `${actualLength} / ${this._maxLength}`;
        });
    }
    _toggleDefaultDatePlaceholder(input = this.input) {
        const isTypeDate = input.getAttribute("type") === "date";
        if (!isTypeDate) {
            return;
        }
        const isInputFocused = document.activeElement === input;
        if (!isInputFocused && !input.value) {
            input.style.opacity = 0;
        }
        else {
            input.style.opacity = 1;
        }
    }
    _showPlaceholder() {
        this.input.setAttribute(DATA_PLACEHOLDER_ACTIVE, "");
    }
    _getNotchData() {
        this._notchMiddle = selector_engine_1.default.findOne(SELECTOR_NOTCH_MIDDLE, this._element);
        this._notchLeading = selector_engine_1.default.findOne(SELECTOR_NOTCH_LEADING, this._element);
    }
    _getLabelWidth() {
        this._labelWidth = this._label.clientWidth * 0.8 + 8;
    }
    _getLabelPositionInInputGroup() {
        this._labelMarginLeft = 0;
        if (!this._element.hasAttribute("data-te-input-group-ref"))
            return;
        const input = this.input;
        const prefix = selector_engine_1.default.prev(input, "[data-te-input-group-text-ref]")[0];
        if (prefix === undefined) {
            this._labelMarginLeft = 0;
        }
        else {
            this._labelMarginLeft = prefix.offsetWidth - 1;
        }
    }
    _applyDivs() {
        const shadowLeading = this._config.inputFormWhite
            ? this._classes.notchLeadingWhite
            : this._classes.notchLeadingNormal;
        const shadowMiddle = this._config.inputFormWhite
            ? this._classes.notchMiddleWhite
            : this._classes.notchMiddleNormal;
        const shadowTrailing = this._config.inputFormWhite
            ? this._classes.notchTrailingWhite
            : this._classes.notchTrailingNormal;
        const allNotchWrappers = selector_engine_1.default.find(SELECTOR_NOTCH, this._element);
        const notchWrapper = (0, index_1.element)("div");
        manipulator_1.default.addClass(notchWrapper, this._classes.notch);
        notchWrapper.setAttribute(DATA_NOTCH, "");
        this._notchLeading = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._notchLeading, `${this._classes.notchLeading} ${shadowLeading}`);
        this._notchLeading.setAttribute(DATA_NOTCH_LEADING, "");
        this._notchMiddle = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._notchMiddle, `${this._classes.notchMiddle} ${shadowMiddle}`);
        this._notchMiddle.setAttribute(DATA_NOTCH_MIDDLE, "");
        this._notchTrailing = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._notchTrailing, `${this._classes.notchTrailing} ${shadowTrailing}`);
        this._notchTrailing.setAttribute(DATA_NOTCH_TRAILING, "");
        if (allNotchWrappers.length >= 1) {
            return;
        }
        notchWrapper.append(this._notchLeading);
        notchWrapper.append(this._notchMiddle);
        notchWrapper.append(this._notchTrailing);
        this._element.append(notchWrapper);
    }
    _applyNotch() {
        this._notchMiddle.style.width = `${this._labelWidth}px`;
        this._notchLeading.style.width = `${this._labelMarginLeft + 9}px`;
        if (this._label === null)
            return;
        this._label.style.marginLeft = `${this._labelMarginLeft}px`;
    }
    _removeBorder() {
        const border = selector_engine_1.default.findOne(SELECTOR_NOTCH, this._element);
        if (border)
            border.remove();
    }
    _activate(event) {
        (0, index_1.onDOMContentLoaded)(() => {
            this._getElements(event);
            const input = event ? event.target : this.input;
            const notchWrapper = selector_engine_1.default.findOne(SELECTOR_NOTCH, this._element);
            if (event && event.type === "focus") {
                notchWrapper && notchWrapper.setAttribute(DATA_FOCUSED, "");
            }
            if (input.value !== "") {
                input.setAttribute(DATA_ACTIVE, "");
                notchWrapper && notchWrapper.setAttribute(DATA_ACTIVE, "");
            }
            this._toggleDefaultDatePlaceholder(input);
        });
    }
    _getElements(event) {
        if (event) {
            this._element = event.target.parentNode;
            this._label = selector_engine_1.default.findOne("label", this._element);
        }
        if (event && this._label) {
            const prevLabelWidth = this._labelWidth;
            this._getLabelData();
            if (prevLabelWidth !== this._labelWidth) {
                this._notchMiddle = selector_engine_1.default.findOne(SELECTOR_NOTCH_MIDDLE, event.target.parentNode);
                this._notchLeading = selector_engine_1.default.findOne(SELECTOR_NOTCH_LEADING, event.target.parentNode);
                this._applyNotch();
            }
        }
    }
    _deactivate(event) {
        const input = event ? event.target : this.input;
        const notchWrapper = selector_engine_1.default.findOne(SELECTOR_NOTCH, input.parentNode);
        notchWrapper.removeAttribute(DATA_FOCUSED);
        if (input.value === "") {
            input.removeAttribute(DATA_ACTIVE);
            notchWrapper.removeAttribute(DATA_ACTIVE);
        }
        this._toggleDefaultDatePlaceholder(input);
    }
    static activate(instance) {
        return function (event) {
            instance._activate(event);
        };
    }
    static deactivate(instance) {
        return function (event) {
            instance._deactivate(event);
        };
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Input(this, _config);
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
exports.default = Input;
//# sourceMappingURL=input.js.map