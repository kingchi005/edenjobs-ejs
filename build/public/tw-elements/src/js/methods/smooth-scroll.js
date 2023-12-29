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
const NAME = "smoothScroll";
const DATA_KEY = `te.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const DefaultType = {
    container: "string",
    offset: "number",
    easing: "string",
    duration: "number",
};
const Default = {
    container: "body",
    offset: 0,
    easing: "linear",
    duration: 500,
};
const EVENT_SCROLL_START = `scrollStart${EVENT_KEY}`;
const EVENT_SCROLL_END = `scrollEnd${EVENT_KEY}`;
const EVENT_SCROLL_CANCEL = `scrollCancel${EVENT_KEY}`;
class SmoothScroll {
    constructor(element, options = {}) {
        this._element = element;
        this._options = this._getConfig(options);
        this._href = this._element.getAttribute("href");
        this.isCancel = false;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this._setup();
        }
    }
    static get NAME() {
        return NAME;
    }
    get isWindow() {
        return this._options.container === "body";
    }
    get containerToScroll() {
        return this.isWindow
            ? document.documentElement
            : selector_engine_1.default.findOne(this._options.container, document.documentElement);
    }
    get elFromHrefExist() {
        return !!selector_engine_1.default.findOne(this._href, this.containerToScroll);
    }
    get offsetFromEl() {
        const heightFromTop = this.containerToScroll.scrollTop;
        const el = selector_engine_1.default.findOne(this._href, this.containerToScroll);
        if (this.isWindow) {
            return manipulator_1.default.offset(el).top - this._options.offset + heightFromTop;
        }
        const elY = el.getBoundingClientRect().y;
        const containerY = this.containerToScroll.getBoundingClientRect().y;
        const offsetFromContainer = elY - containerY;
        return offsetFromContainer - this._options.offset + heightFromTop;
    }
    get easingFunction() {
        const easing = this._options.easing;
        const motionName = `_motion${easing[0].toUpperCase()}${easing.slice(1)}`;
        return this[motionName] ? this[motionName] : this._motionLinear;
    }
    dispose() {
        event_handler_1.default.off(this._element, "click", this._handleClick);
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    cancelScroll() {
        this.isCancel = true;
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _inViewport() {
        if (this.isWindow) {
            return true;
        }
        const rect = this.containerToScroll.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight));
    }
    _setup() {
        const linkExist = typeof this._href !== "undefined";
        const isHashInLink = this._href.includes("#");
        if (linkExist && isHashInLink && this.elFromHrefExist) {
            this._scrollOnClickEvent();
            this._preventNativeScroll();
        }
    }
    _scrollOnClickEvent() {
        event_handler_1.default.on(this._element, "click", (e) => {
            this._handleClick(e);
        });
    }
    _handleClick(e) {
        e.preventDefault();
        this.isCancel = false;
        event_handler_1.default.trigger(this._element, EVENT_SCROLL_START);
        const scrollingContainer = this.containerToScroll;
        const positionFrom = this.containerToScroll.scrollTop;
        const positionTo = this.offsetFromEl;
        const scrollProgress = 0;
        const speed = 1 / this._options.duration;
        const step = 4.25;
        const easing = this.easingFunction;
        if (!this._inViewport()) {
            this._scrollOnNextTick(document.documentElement, document.documentElement.scrollTop, this.containerToScroll.offsetTop, scrollProgress, speed, step, easing);
            setTimeout(() => {
                this._scrollOnNextTick(scrollingContainer, positionFrom, positionTo, scrollProgress, speed, step, easing);
                this.isCancel = false;
            }, this._options.duration);
        }
        else {
            this._scrollOnNextTick(scrollingContainer, positionFrom, positionTo, scrollProgress, speed, step, easing);
        }
    }
    _scrollOnNextTick(scrollingContainer, positionFrom, positionTo, scrollProgress, speed, step, easing) {
        const progressWrongValue = scrollProgress < 0;
        const scrollEnd = scrollProgress > 1;
        const speedWrongValue = speed <= 0;
        if (progressWrongValue || scrollEnd || speedWrongValue || this.isCancel) {
            if (this.isCancel) {
                if (this.isInViewport) {
                    this.isCancel = false;
                }
                event_handler_1.default.trigger(this._element, EVENT_SCROLL_CANCEL);
                return;
            }
            event_handler_1.default.trigger(this._element, EVENT_SCROLL_END);
            scrollingContainer.scrollTop = positionTo;
            return;
        }
        scrollingContainer.scrollTo({
            top: positionFrom - (positionFrom - positionTo) * easing(scrollProgress),
        });
        scrollProgress += speed * step;
        setTimeout(() => {
            this._scrollOnNextTick(scrollingContainer, positionFrom, positionTo, scrollProgress, speed, step, easing);
        });
    }
    _preventDefault(e) {
        e.preventDefault();
    }
    _preventNativeScroll() {
        let supportsPassive = false;
        try {
            window.addEventListener("test", null, Object.defineProperty({}, "passive", {
                get: () => (supportsPassive = true),
            }));
        }
        catch (e) {
            this._scrollError = e;
        }
        const wheelOpt = supportsPassive ? { passive: false } : false;
        const wheelEvent = "onwheel" in (0, index_1.element)("div") ? "wheel" : "mousewheel";
        if (this.isWindow) {
            this._deleteScrollOnStart(wheelOpt, wheelEvent);
            this._addScrollOnEnd(wheelOpt, wheelEvent);
            this._addScrollOnCancel(wheelOpt, wheelEvent);
        }
    }
    _deleteScrollOnStart(wheelOpt, wheelEvent) {
        event_handler_1.default.on(this._element, "scrollStart.te.smoothScroll", () => {
            window.addEventListener(wheelEvent, this._preventDefault, wheelOpt);
            window.addEventListener("touchmove", this._preventDefault, wheelOpt);
        });
    }
    _addScrollOnEnd(wheelOpt, wheelEvent) {
        event_handler_1.default.on(this._element, "scrollEnd.te.smoothScroll", () => {
            window.removeEventListener(wheelEvent, this._preventDefault, wheelOpt);
            window.removeEventListener("touchmove", this._preventDefault, wheelOpt);
        });
    }
    _addScrollOnCancel(wheelOpt, wheelEvent) {
        event_handler_1.default.on(this._element, "scrollCancel.te.smoothScroll", () => {
            window.removeEventListener(wheelEvent, this._preventDefault, wheelOpt);
            window.removeEventListener("touchmove", this._preventDefault, wheelOpt);
        });
    }
    _motionLinear(t) {
        return t;
    }
    _motionEaseInQuad(t) {
        return t * t;
    }
    _motionEaseInCubic(t) {
        return t * t * t;
    }
    _motionEaseInQuart(t) {
        return t * t * t * t;
    }
    _motionEaseInQuint(t) {
        return t * t * t * t * t;
    }
    _motionEaseInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    _motionEaseInOutCubic(t) {
        t /= 0.5;
        if (t < 1)
            return (t * t * t) / 2;
        t -= 2;
        return (t * t * t + 2) / 2;
    }
    _motionEaseInOutQuart(t) {
        t /= 0.5;
        if (t < 1)
            return 0.5 * t * t * t * t;
        t -= 2;
        return -(t * t * t * t - 2) / 2;
    }
    _motionEaseInOutQuint(t) {
        t /= 0.5;
        if (t < 1)
            return (t * t * t * t * t) / 2;
        t -= 2;
        return (t * t * t * t * t + 2) / 2;
    }
    _motionEaseOutQuad(t) {
        return -t * (t - 2);
    }
    _motionEaseOutCubic(t) {
        t--;
        return t * t * t + 1;
    }
    _motionEaseOutQuart(t) {
        t--;
        return -(t * t * t * t - 1);
    }
    _motionEaseOutQuint(t) {
        t--;
        return t * t * t * t * t + 1;
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
                data = new SmoothScroll(this, _config);
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
exports.default = SmoothScroll;
//# sourceMappingURL=smooth-scroll.js.map