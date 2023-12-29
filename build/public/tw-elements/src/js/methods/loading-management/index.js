"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../util/index");
const data_1 = __importDefault(require("../../dom/data"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const templates_1 = require("./templates");
const NAME = "loadingManagement";
const DATA_KEY = `te.${NAME}`;
const ATTR_SELECTOR_LOADING_ICON = "[data-te-loading-icon-ref]";
const ATTR_SELECTOR_LOADING_TEXT = "[data-te-loading-text-ref]";
const SHOW_EVENT = `show.te.${NAME}`;
const DefaultType = {
    backdrop: "(null|boolean)",
    backdropID: "(null|string|number)",
    delay: "(null|number)",
    loader: "(null|string|number)",
    parentSelector: "(null|string)",
    loadingIcon: "boolean",
    loadingText: "boolean",
    scroll: "boolean",
};
const Default = {
    backdrop: true,
    backdropID: null,
    delay: 0,
    loader: "",
    parentSelector: null,
    scroll: true,
    loadingText: true,
    loadingIcon: true,
};
const DefaultClasses = {
    loadingSpinner: "absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center z-40",
    spinnerColor: "text-primary dark:text-primary-400",
    backdrop: "w-full h-full fixed top-0 left-0 bottom-0 right-0 z-30",
    backdropColor: "bg-[rgba(0,0,0,0.4)]",
};
const DefaultClassesType = {
    loadingSpinner: "string",
    spinnerColor: "string",
    backdrop: "string",
    backdropColor: "string",
};
class Loading {
    constructor(element, options = {}, classes) {
        this._element = element;
        this._options = this._getConfig(options);
        this._classes = this._getClasses(classes);
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
        this._backdropElement = null;
        this._parentElement = selector_engine_1.default.findOne(this._options.parentSelector);
        this._loadingIcon = selector_engine_1.default.findOne(ATTR_SELECTOR_LOADING_ICON, this._element);
        this._loadingText = selector_engine_1.default.findOne(ATTR_SELECTOR_LOADING_TEXT, this._element);
        this.init();
    }
    static get NAME() {
        return NAME;
    }
    init() {
        const spinnerCloned = this._loadingIcon.cloneNode(true);
        const loadingCloned = this._loadingText.cloneNode(true);
        this._removeElementsOnStart();
        setTimeout(() => {
            manipulator_1.default.addClass(this._element, `${this._classes.loadingSpinner} ${this._classes.spinnerColor}`);
            this._setBackdrop();
            this._setLoadingIcon(spinnerCloned);
            this._setLoadingText(loadingCloned);
            this._setScrollOption();
            event_handler_1.default.trigger(this._element, SHOW_EVENT);
        }, this._options.delay);
    }
    dispose() {
        data_1.default.removeData(this._element, DATA_KEY);
        manipulator_1.default.removeClass(this._element, `${this._classes.loadingSpinner} ${this._classes.spinnerColor}`);
        const delay = this._options.delay;
        setTimeout(() => {
            this._removeBackdrop();
            this._backdropElement = null;
            this._element = null;
            this._options = null;
        }, delay);
    }
    _setBackdrop() {
        const { backdrop } = this._options;
        if (!backdrop)
            return;
        this._backdropElement = (0, templates_1.getBackdropTemplate)(this._options, this._classes);
        if (this._parentElement !== null) {
            manipulator_1.default.addClass(this._element, "absolute");
            manipulator_1.default.addClass(this._parentElement, "relative");
            manipulator_1.default.addClass(this._backdropElement, "absolute");
            this._parentElement.appendChild(this._backdropElement);
        }
        else {
            manipulator_1.default.addClass(this._element, "!fixed");
            document.body.appendChild(this._backdropElement);
            document.body.appendChild(this._element);
        }
    }
    _removeBackdrop() {
        const { backdrop } = this._options;
        if (!backdrop)
            return;
        if (this._parentElement !== null) {
            manipulator_1.default.removeClass(this._element, "absolute");
            manipulator_1.default.removeClass(this._parentElement, "relative");
            this._backdropElement.remove();
        }
        else {
            this._backdropElement.remove();
            this._element.remove();
        }
    }
    _setLoadingIcon(spinner) {
        if (!this._options.loadingIcon) {
            spinner.remove();
            return;
        }
        this._element.appendChild(spinner);
        spinner.id = this._options.loader;
    }
    _setLoadingText(text) {
        if (!this._options.loadingText) {
            text.remove();
            return;
        }
        this._element.appendChild(text);
    }
    _removeElementsOnStart() {
        if (this._element === null)
            return;
        this._loadingIcon.remove();
        this._loadingText.remove();
    }
    _setScrollOption() {
        if (!this._options.scroll) {
            if (this._parentElement === null) {
                manipulator_1.default.addClass(document.body, "overflow-hidden");
                return;
            }
            manipulator_1.default.addClass(this._parentElement, "overflow-hidden");
        }
        else {
            if (this._parentElement === null) {
                manipulator_1.default.addClass(document.body, "overflow-auto");
                return;
            }
            manipulator_1.default.addClass(this._parentElement, "overflow-auto");
        }
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
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data) {
                data = new Loading(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](this);
            }
        });
    }
}
exports.default = Loading;
//# sourceMappingURL=index.js.map