"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const NAME = "animation";
const DATA_KEY = "te.animation";
const DefaultType = {
    animation: "string",
    animationStart: "string",
    animationShowOnLoad: "boolean",
    onStart: "(null|function)",
    onEnd: "(null|function)",
    onHide: "(null|function)",
    onShow: "(null|function)",
    animationOnScroll: "(string)",
    animationWindowHeight: "number",
    animationOffset: "(number|string)",
    animationDelay: "(number|string)",
    animationReverse: "boolean",
    animationInterval: "(number|string)",
    animationRepeat: "(number|boolean)",
    animationReset: "boolean",
};
const Default = {
    animation: "fade",
    animationStart: "onClick",
    animationShowOnLoad: true,
    onStart: null,
    onEnd: null,
    onHide: null,
    onShow: null,
    animationOnScroll: "once",
    animationWindowHeight: 0,
    animationOffset: 0,
    animationDelay: 0,
    animationReverse: false,
    animationInterval: 0,
    animationRepeat: false,
    animationReset: false,
};
class Animate {
    constructor(element, options) {
        this._element = element;
        this._animateElement = this._getAnimateElement();
        this._isFirstScroll = true;
        this._repeatAnimateOnScroll = true;
        this._options = this._getConfig(options);
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this._init();
        }
    }
    static get NAME() {
        return NAME;
    }
    init() {
        this._init();
    }
    startAnimation() {
        this._startAnimation();
    }
    stopAnimation() {
        this._clearAnimationClass();
    }
    changeAnimationType(animation) {
        this._options.animation = animation;
    }
    dispose() {
        event_handler_1.default.off(this._element, "mousedown");
        event_handler_1.default.off(this._animateElement, "animationend");
        event_handler_1.default.off(window, "scroll");
        event_handler_1.default.off(this._element, "mouseover");
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
        this._animateElement = null;
        this._isFirstScroll = null;
        this._repeatAnimateOnScroll = null;
        this._options = null;
    }
    _init() {
        switch (this._options.animationStart) {
            case "onHover":
                this._bindHoverEvents();
                break;
            case "onLoad":
                this._startAnimation();
                break;
            case "onScroll":
                this._bindScrollEvents();
                break;
            case "onClick":
                this._bindClickEvents();
                break;
            default:
                break;
        }
        this._bindTriggerOnEndCallback();
        if (this._options.animationReset) {
            this._bindResetAnimationAfterFinish();
        }
    }
    _getAnimateElement() {
        const targetId = manipulator_1.default.getDataAttribute(this._element, "animation-target");
        return targetId ? selector_engine_1.default.find(targetId)[0] : this._element;
    }
    _getConfig(config) {
        const dataAttributes = manipulator_1.default.getDataAttributes(this._animateElement);
        config = Object.assign(Object.assign(Object.assign({}, Default), dataAttributes), config);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _animateOnScroll() {
        const elementOffsetTop = manipulator_1.default.offset(this._animateElement).top;
        const elementHeight = this._animateElement.offsetHeight;
        const windowHeight = window.innerHeight;
        const shouldBeVisible = elementOffsetTop + this._options.animationOffset <= windowHeight &&
            elementOffsetTop + this._options.animationOffset + elementHeight >= 0;
        const isElementVisible = this._animateElement.style.visibility === "visible";
        switch (true) {
            case shouldBeVisible && this._isFirstScroll:
                this._isFirstScroll = false;
                this._startAnimation();
                break;
            case !shouldBeVisible && this._isFirstScroll:
                this._isFirstScroll = false;
                this._hideAnimateElement();
                break;
            case shouldBeVisible && !isElementVisible && this._repeatAnimateOnScroll:
                if (this._options.animationOnScroll !== "repeat") {
                    this._repeatAnimateOnScroll = false;
                }
                this._callback(this._options.onShow);
                this._showAnimateElement();
                this._startAnimation();
                break;
            case !shouldBeVisible && isElementVisible && this._repeatAnimateOnScroll:
                this._hideAnimateElement();
                this._clearAnimationClass();
                this._callback(this._options.onHide);
                break;
            default:
                break;
        }
    }
    _addAnimatedClass() {
        manipulator_1.default.addClass(this._animateElement, `animate-${this._options.animation}`);
    }
    _clearAnimationClass() {
        this._animateElement.classList.remove(`animate-${this._options.animation}`);
    }
    _startAnimation() {
        this._callback(this._options.onStart);
        this._addAnimatedClass();
        if (this._options.animationRepeat && !this._options.animationInterval) {
            this._setAnimationRepeat();
        }
        if (this._options.animationReverse) {
            this._setAnimationReverse();
        }
        if (this._options.animationDelay) {
            this._setAnimationDelay();
        }
        if (this._options.animationDuration) {
            this._setAnimationDuration();
        }
        if (this._options.animationInterval) {
            this._setAnimationInterval();
        }
    }
    _setAnimationReverse() {
        manipulator_1.default.style(this._animateElement, {
            animationIterationCount: this._options.animationRepeat === true ? "infinite" : "2",
            animationDirection: "alternate",
        });
    }
    _setAnimationDuration() {
        manipulator_1.default.style(this._animateElement, {
            animationDuration: `${this._options.animationDuration}ms`,
        });
    }
    _setAnimationDelay() {
        manipulator_1.default.style(this._animateElement, {
            animationDelay: `${this._options.animationDelay}ms`,
        });
    }
    _setAnimationRepeat() {
        manipulator_1.default.style(this._animateElement, {
            animationIterationCount: this._options.animationRepeat === true
                ? "infinite"
                : this._options.animationRepeat,
        });
    }
    _setAnimationInterval() {
        event_handler_1.default.on(this._animateElement, "animationend", () => {
            this._clearAnimationClass();
            setTimeout(() => {
                this._addAnimatedClass();
            }, this._options.animationInterval);
        });
    }
    _hideAnimateElement() {
        manipulator_1.default.style(this._animateElement, { visibility: "hidden" });
    }
    _showAnimateElement() {
        manipulator_1.default.style(this._animateElement, { visibility: "visible" });
    }
    _bindResetAnimationAfterFinish() {
        event_handler_1.default.on(this._animateElement, "animationend", () => {
            this._clearAnimationClass();
        });
    }
    _bindTriggerOnEndCallback() {
        event_handler_1.default.on(this._animateElement, "animationend", () => {
            this._callback(this._options.onEnd);
        });
    }
    _bindScrollEvents() {
        if (!this._options.animationShowOnLoad) {
            this._animateOnScroll();
        }
        event_handler_1.default.on(window, "scroll", () => {
            this._animateOnScroll();
        });
    }
    _bindClickEvents() {
        event_handler_1.default.on(this._element, "mousedown", () => {
            this._startAnimation();
        });
    }
    _bindHoverEvents() {
        event_handler_1.default.one(this._element, "mouseover", () => {
            this._startAnimation();
        });
        event_handler_1.default.one(this._animateElement, "animationend", () => {
            setTimeout(() => {
                this._bindHoverEvents();
            }, 100);
        });
    }
    _callback(fn) {
        if (fn instanceof Function) {
            fn();
        }
    }
    static autoInit(instance) {
        instance._init();
    }
    static jQueryInterface(options) {
        const animate = new Animate(this[0], options);
        animate.init();
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
exports.default = Animate;
//# sourceMappingURL=animate.js.map