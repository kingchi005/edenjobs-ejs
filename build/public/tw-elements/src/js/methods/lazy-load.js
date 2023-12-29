"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const animate_1 = __importDefault(require("../content-styles/animate"));
const NAME = "lazyLoad";
const DATA_KEY = "te.lazyLoad";
const SELECTOR_ATTR_LAZYLOAD = "[data-te-lazy-load-init]";
const ATTR_LAZYLOAD = "data-te-lazy-load";
const EVENT_LOAD = "onLoad.te.lazy";
const EVENT_ERROR = "onError.te.lazy";
const SELECTOR_ELEMENTS = ["img", "video"];
const DefaultType = {
    lazySrc: "(string|null)",
    lazyDelay: "number",
    lazyAnimation: "string",
    lazyOffset: "number",
    lazyPlaceholder: "(string|undefined)",
    lazyError: "(string|undefined)",
};
const Default = {
    lazySrc: null,
    lazyDelay: 500,
    lazyAnimation: "[fade-in_1s_ease-in-out]",
    lazyOffset: 0,
};
class LazyLoad {
    constructor(element, data) {
        this._element = element;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
        this._options = this._getConfig(data);
        this.scrollHandler = this._scrollHandler.bind(this);
        this.errorHandler = this._setElementError.bind(this);
        this._childrenInstances = null;
        this._init();
    }
    static get NAME() {
        return NAME;
    }
    get offsetValues() {
        return this._element.getBoundingClientRect();
    }
    get inViewport() {
        if (this.parent) {
            const parentRect = this.parent.getBoundingClientRect();
            return (parentRect.y > 0 &&
                parentRect.y < window.innerHeight &&
                this.offsetValues.y >= parentRect.y &&
                this.offsetValues.y <= parentRect.y + parentRect.height &&
                this.offsetValues.y <= window.innerHeight);
        }
        return (this.offsetValues.top + this._options.lazyOffset <= window.innerHeight &&
            this.offsetValues.bottom >= 0);
    }
    get parent() {
        const [container] = selector_engine_1.default.parents(this._element, SELECTOR_ATTR_LAZYLOAD);
        return container;
    }
    get node() {
        return this._element.nodeName;
    }
    get isContainer() {
        return !selector_engine_1.default.matches(this._element, SELECTOR_ELEMENTS);
    }
    dispose() {
        data_1.default.removeData(this._element, DATA_KEY);
        if (this._animation) {
            this._animation.dispose();
            this._animation = null;
        }
        this._element = null;
        if (this._childrenInstances) {
            this._childrenInstances.forEach((child) => child.dispose());
        }
    }
    _init() {
        this._element.setAttribute(ATTR_LAZYLOAD, "");
        if (this.isContainer) {
            this._setupContainer();
            return;
        }
        this._setupElement();
    }
    _setupElement() {
        event_handler_1.default.one(this._element, "error", this.errorHandler);
        if (this._options.lazyPlaceholder) {
            this._setPlaceholder();
        }
        this._animation = new animate_1.default(this._element, {
            animation: `${this._options.lazyAnimation}`,
            animationStart: "onLoad",
        });
        event_handler_1.default.one(this._element, "load", () => this._scrollHandler());
        if (this.parent) {
            event_handler_1.default.on(this.parent, "scroll", this.scrollHandler);
        }
        event_handler_1.default.on(window, "scroll", this.scrollHandler);
    }
    _scrollHandler() {
        if (this.inViewport) {
            this._timeout = setTimeout(() => {
                this._setSrc();
                this._element.removeAttribute(ATTR_LAZYLOAD);
                this._removeAttrs();
                this._animation.init();
            }, this._options.lazyDelay);
            if (this.parent) {
                event_handler_1.default.off(this.parent, "scroll", this.scrollHandler);
            }
            event_handler_1.default.off(window, "scroll", this.scrollHandler);
        }
    }
    _setElementError() {
        if (!this._options.lazyError ||
            this._element.src === this._options.lazyError) {
            this._element.alt = "404 not found";
        }
        else {
            this._element.setAttribute("src", this._options.lazyError);
        }
        event_handler_1.default.trigger(this._element, EVENT_ERROR);
    }
    _setSrc() {
        this._element.setAttribute("src", this._options.lazySrc);
        event_handler_1.default.trigger(this._element, EVENT_LOAD);
    }
    _setPlaceholder() {
        if (this.node === "IMG") {
            this._element.setAttribute("src", this._options.lazyPlaceholder);
        }
        else if (this.node === "VIDEO") {
            this._element.setAttribute("poster", this._options.lazyPlaceholder);
        }
    }
    _removeAttrs() {
        ["src", "delay", "animation", "placeholder", "offset", "error"].forEach((attr) => {
            manipulator_1.default.removeDataAttribute(this._element, `lazy-${attr}`);
        });
    }
    _setupContainer() {
        this._childrenInstances = selector_engine_1.default.children(this._element, SELECTOR_ELEMENTS).map((child) => new LazyLoad(child, this._options));
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), options), manipulator_1.default.getDataAttributes(this._element));
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
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
                data = new LazyLoad(this, _config);
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
exports.default = LazyLoad;
//# sourceMappingURL=lazy-load.js.map