"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const base_component_1 = __importDefault(require("../base-component"));
const component_functions_1 = require("../util/component-functions");
const NAME = "toast";
const DATA_KEY = "te.toast";
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const HIDE_DATA_ATTRIBUTE = "data-te-toast-hide";
const SHOW_DATA_ATTRIBUTE = "data-te-toast-show";
const SHOWING_DATA_ATTRIBUTE = "data-te-toast-showing";
const DefaultType = {
    animation: "boolean",
    autohide: "boolean",
    delay: "number",
};
const Default = {
    animation: true,
    autohide: true,
    delay: 5000,
};
const DefaultClasses = {
    fadeIn: "animate-[fade-in_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
    fadeOut: "animate-[fade-out_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
};
const DefaultClassesType = {
    fadeIn: "string",
    fadeOut: "string",
};
class Toast extends base_component_1.default {
    constructor(element, config, classes) {
        super(element);
        this._config = this._getConfig(config);
        this._classes = this._getClasses(classes);
        this._timeout = null;
        this._hasMouseInteraction = false;
        this._hasKeyboardInteraction = false;
        this._setListeners();
        this._didInit = false;
        this._init();
    }
    static get DefaultType() {
        return DefaultType;
    }
    static get Default() {
        return Default;
    }
    static get NAME() {
        return NAME;
    }
    show() {
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW);
        if (showEvent.defaultPrevented) {
            return;
        }
        this._clearTimeout();
        if (this._config.animation) {
            manipulator_1.default.removeClass(this._element, this._classes.fadeOut);
            manipulator_1.default.addClass(this._element, this._classes.fadeIn);
        }
        const complete = () => {
            this._element.removeAttribute(SHOWING_DATA_ATTRIBUTE);
            event_handler_1.default.trigger(this._element, EVENT_SHOWN);
            this._maybeScheduleHide();
        };
        this._element.removeAttribute(HIDE_DATA_ATTRIBUTE);
        (0, index_1.reflow)(this._element);
        this._element.setAttribute(SHOW_DATA_ATTRIBUTE, "");
        this._element.setAttribute(SHOWING_DATA_ATTRIBUTE, "");
        this._queueCallback(complete, this._element, this._config.animation);
    }
    hide() {
        if (!this._element || this._element.dataset.teToastShow === undefined) {
            return;
        }
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE);
        if (hideEvent.defaultPrevented) {
            return;
        }
        const complete = () => {
            let timeout = 0;
            if (this._config.animation) {
                timeout = 300;
                manipulator_1.default.removeClass(this._element, this._classes.fadeIn);
                manipulator_1.default.addClass(this._element, this._classes.fadeOut);
            }
            setTimeout(() => {
                this._element.setAttribute(HIDE_DATA_ATTRIBUTE, "");
                this._element.removeAttribute(SHOWING_DATA_ATTRIBUTE);
                this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
                event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
            }, timeout);
        };
        this._element.setAttribute(SHOWING_DATA_ATTRIBUTE, "");
        this._queueCallback(complete, this._element, this._config.animation);
    }
    dispose() {
        this._clearTimeout();
        if (this._element.dataset.teToastShow !== undefined) {
            this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
        }
        super.dispose();
    }
    _init() {
        if (this._didInit) {
            return;
        }
        (0, component_functions_1.enableDismissTrigger)(Toast);
        this._didInit = true;
    }
    _getConfig(config) {
        config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), (typeof config === "object" && config ? config : {}));
        (0, index_1.typeCheckConfig)(NAME, config, this.constructor.DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _maybeScheduleHide() {
        if (!this._config.autohide) {
            return;
        }
        if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
            return;
        }
        this._timeout = setTimeout(() => {
            this.hide();
        }, this._config.delay);
    }
    _onInteraction(event, isInteracting) {
        switch (event.type) {
            case "mouseover":
            case "mouseout":
                this._hasMouseInteraction = isInteracting;
                break;
            case "focusin":
            case "focusout":
                this._hasKeyboardInteraction = isInteracting;
                break;
            default:
                break;
        }
        if (isInteracting) {
            this._clearTimeout();
            return;
        }
        const nextElement = event.relatedTarget;
        if (this._element === nextElement || this._element.contains(nextElement)) {
            return;
        }
        this._maybeScheduleHide();
    }
    _setListeners() {
        event_handler_1.default.on(this._element, EVENT_MOUSEOVER, (event) => this._onInteraction(event, true));
        event_handler_1.default.on(this._element, EVENT_MOUSEOUT, (event) => this._onInteraction(event, false));
        event_handler_1.default.on(this._element, EVENT_FOCUSIN, (event) => this._onInteraction(event, true));
        event_handler_1.default.on(this._element, EVENT_FOCUSOUT, (event) => this._onInteraction(event, false));
    }
    _clearTimeout() {
        clearTimeout(this._timeout);
        this._timeout = null;
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Toast.getOrCreateInstance(this, config);
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](this);
            }
        });
    }
}
exports.default = Toast;
//# sourceMappingURL=toast.js.map