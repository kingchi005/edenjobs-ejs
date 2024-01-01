"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const base_component_1 = __importDefault(require("../base-component"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const component_functions_1 = require("../util/component-functions");
const NAME = "alert";
const DATA_KEY = "te.alert";
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_CLOSED = `closed${EVENT_KEY}`;
const SHOW_DATA_ATTRIBUTE = "data-te-alert-show";
const DefaultType = {
    animation: "boolean",
    autohide: "boolean",
    autoclose: "boolean",
    delay: "number",
};
const Default = {
    animation: true,
    autohide: true,
    autoclose: false,
    delay: 1000,
};
const DefaultClasses = {
    fadeIn: "animate-[fade-in_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
    fadeOut: "animate-[fade-out_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
};
const DefaultClassesType = {
    fadeIn: "string",
    fadeOut: "string",
};
class Alert extends base_component_1.default {
    constructor(element, config, classes) {
        super(element);
        this._element = element;
        this._config = this._getConfig(config);
        this._classes = this._getClasses(classes);
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
    close() {
        const closeEvent = event_handler_1.default.trigger(this._element, EVENT_CLOSE);
        if (closeEvent.defaultPrevented) {
            return;
        }
        let timeout = 0;
        if (this._config.animation) {
            timeout = 300;
            manipulator_1.default.addClass(this._element, this._classes.fadeOut);
        }
        this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
        setTimeout(() => {
            this._queueCallback(() => this._destroyElement(), this._element, this._config.animation);
        }, timeout);
    }
    show() {
        if (!this._element) {
            return;
        }
        if (this._config.autohide) {
            this._setupAutohide();
        }
        if (this._config.autoclose ||
            (this._config.autoclose && this._config.autohide)) {
            this._setupAutoclose();
        }
        if (!this._element.hasAttribute(SHOW_DATA_ATTRIBUTE)) {
            manipulator_1.default.removeClass(this._element, "hidden");
            manipulator_1.default.addClass(this._element, "block");
            if ((0, index_1.isVisible)(this._element)) {
                const handler = (e) => {
                    manipulator_1.default.removeClass(this._element, "hidden");
                    manipulator_1.default.addClass(this._element, "block");
                    event_handler_1.default.off(e.target, "animationend", handler);
                };
                this._element.setAttribute(SHOW_DATA_ATTRIBUTE, "");
                event_handler_1.default.on(this._element, "animationend", handler);
            }
        }
        if (this._config.animation) {
            manipulator_1.default.removeClass(this._element, this._classes.fadeOut);
            manipulator_1.default.addClass(this._element, this._classes.fadeIn);
        }
    }
    hide() {
        if (!this._element) {
            return;
        }
        if (this._element.hasAttribute(SHOW_DATA_ATTRIBUTE)) {
            this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
            const handler = (e) => {
                manipulator_1.default.addClass(this._element, "hidden");
                manipulator_1.default.removeClass(this._element, "block");
                if (this._timeout !== null) {
                    clearTimeout(this._timeout);
                    this._timeout = null;
                }
                event_handler_1.default.off(e.target, "animationend", handler);
            };
            event_handler_1.default.on(this._element, "animationend", handler);
            manipulator_1.default.removeClass(this._element, this._classes.fadeIn);
            manipulator_1.default.addClass(this._element, this._classes.fadeOut);
        }
    }
    _init() {
        if (this._didInit) {
            return;
        }
        (0, component_functions_1.enableDismissTrigger)(Alert, "close");
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
    _setupAutohide() {
        this._timeout = setTimeout(() => {
            this.hide();
        }, this._config.delay);
    }
    _setupAutoclose() {
        this._timeout = setTimeout(() => {
            this.close();
        }, this._config.delay);
    }
    _destroyElement() {
        this._element.remove();
        event_handler_1.default.trigger(this._element, EVENT_CLOSED);
        this.dispose();
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Alert.getOrCreateInstance(this);
            if (typeof config !== "string") {
                return;
            }
            if (data[config] === undefined ||
                config.startsWith("_") ||
                config === "constructor") {
                throw new TypeError(`No method named "${config}"`);
            }
            data[config](this);
        });
    }
}
exports.default = Alert;
//# sourceMappingURL=alert.js.map