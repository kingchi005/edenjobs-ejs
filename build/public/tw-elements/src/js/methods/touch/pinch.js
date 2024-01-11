"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const touchUtil_1 = __importDefault(require("./touchUtil"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const util_1 = require("../../util");
const NAME = "pinch";
const EVENT_END = `${NAME}end`;
const EVENT_START = `${NAME}start`;
const EVENT_MOVE = `${NAME}move`;
const DefaultType = {
    threshold: "number",
    pointers: "number",
};
const Default = {
    threshold: 10,
    pointers: 2,
};
class Pinch extends touchUtil_1.default {
    constructor(element, options = {}) {
        super();
        this._element = element;
        this._options = this._getConfig(options);
        this._startTouch = null;
        this._origin = null;
        this._touch = null;
        this._math = null;
        this._ratio = null;
    }
    static get NAME() {
        return NAME;
    }
    get isNumber() {
        return (typeof this._startTouch === "number" &&
            typeof this._touch === "number" &&
            !isNaN(this._startTouch) &&
            !isNaN(this._touch));
    }
    handleTouchStart(e) {
        if (e.touches.length !== this._options.pointers)
            return;
        e.type === "touchstart" && e.preventDefault();
        const [touch, origin] = this._getPinchTouchOrigin(e.touches);
        this._touch = touch;
        this._origin = origin;
        this._startTouch = this._touch;
        event_handler_1.default.trigger(this._element, EVENT_START, {
            touch: e,
            ratio: this._ratio,
            origin: this._origin,
        });
    }
    handleTouchMove(e) {
        const { threshold, pointers } = this._options;
        if (e.touches.length !== pointers)
            return;
        e.type === "touchmove" && e.preventDefault();
        this._touch = this._getPinchTouchOrigin(e.touches)[0];
        this._ratio = this._touch / this._startTouch;
        if (this.isNumber) {
            if (this._origin.x > threshold || this._origin.y > threshold) {
                this._startTouch = this._touch;
                event_handler_1.default.trigger(this._element, NAME, {
                    touch: e,
                    ratio: this._ratio,
                    origin: this._origin,
                });
                event_handler_1.default.trigger(this._element, EVENT_MOVE, {
                    touch: e,
                    ratio: this._ratio,
                    origin: this._origin,
                });
            }
        }
    }
    handleTouchEnd(e) {
        if (this.isNumber) {
            this._startTouch = null;
            event_handler_1.default.trigger(this._element, EVENT_END, {
                touch: e,
                ratio: this._ratio,
                origin: this._origin,
            });
        }
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, util_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
}
exports.default = Pinch;
//# sourceMappingURL=pinch.js.map