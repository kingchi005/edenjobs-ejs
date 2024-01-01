"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../../dom/data"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const press_1 = __importDefault(require("./press"));
const swipe_1 = __importDefault(require("./swipe"));
const pan_1 = __importDefault(require("./pan"));
const pinch_1 = __importDefault(require("./pinch"));
const tap_1 = __importDefault(require("./tap"));
const rotate_1 = __importDefault(require("./rotate"));
const util_1 = require("../../util");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const NAME = "touch";
const DATA_KEY = `te.${NAME}`;
const DefaultType = {
    event: "string",
};
const Default = {
    event: "swipe",
};
class Touch {
    constructor(element, options = {}) {
        this._element = element;
        this._options = this._getConfig(options);
        this._event = this._options.event;
        this.swipe = this._event === "swipe" ? new swipe_1.default(element, options) : null;
        this.press = this._event === "press" ? new press_1.default(element, options) : null;
        this.pan = this._event === "pan" ? new pan_1.default(element, options) : null;
        this.pinch = this._event === "pinch" ? new pinch_1.default(element, options) : null;
        this.tap = this._event === "tap" ? new tap_1.default(element, options) : null;
        this.rotate =
            this._event === "rotate" ? new rotate_1.default(element, options) : null;
        this._touchStartHandler = (e) => this._handleTouchStart(e);
        this._touchMoveHandler = (e) => this._handleTouchMove(e);
        this._touchEndHandler = (e) => this._handleTouchEnd(e);
        event_handler_1.default.on(this._element, "touchstart", this._touchStartHandler);
        event_handler_1.default.on(this._element, "touchmove", this._touchMoveHandler);
        event_handler_1.default.on(this._element, "touchend", this._touchEndHandler);
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
    }
    static get NAME() {
        return NAME;
    }
    dispose() {
        event_handler_1.default.off(this._element, "touchstart", this._touchStartHandler);
        event_handler_1.default.off(this._element, "touchmove", this._touchMoveHandler);
        event_handler_1.default.off(this._element, "touchend", this._touchEndHandler);
        this.swipe = null;
        this.press = null;
        this.pan = null;
        this.pinch = null;
        this.tap = null;
        this.rotate = null;
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, util_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _handleTouchStart(e) {
        this[this._event].handleTouchStart(e);
    }
    _handleTouchMove(e) {
        if (this[this._event].handleTouchMove) {
            this[this._event].handleTouchMove(e);
        }
    }
    _handleTouchEnd(e) {
        this[this._event].handleTouchEnd(e);
    }
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Touch(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                return data[config];
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
exports.default = Touch;
//# sourceMappingURL=index.js.map