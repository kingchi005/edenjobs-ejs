"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const touchUtil_1 = __importDefault(require("./touchUtil"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const util_1 = require("../../util");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const NAME = "tap";
const DefaultType = {
    interval: "number",
    time: "number",
    taps: "number",
    pointers: "number",
};
const Default = {
    interval: 500,
    time: 250,
    taps: 1,
    pointers: 1,
};
class Tap extends touchUtil_1.default {
    constructor(element, options) {
        super();
        this._element = element;
        this._options = this._getConfig(options);
        this._timer = null;
        this._tapCount = 0;
    }
    static get NAME() {
        return NAME;
    }
    handleTouchStart(e) {
        const { x, y } = this._getCoordinates(e);
        const { interval, taps, pointers } = this._options;
        if (e.touches.length === pointers) {
            this._tapCount += 1;
            if (this._tapCount === 1) {
                this._timer = setTimeout(() => {
                    this._tapCount = 0;
                }, interval);
            }
            if (this._tapCount === taps) {
                clearTimeout(this._timer);
                this._tapCount = 0;
                event_handler_1.default.trigger(this._element, NAME, {
                    touch: e,
                    origin: {
                        x,
                        y,
                    },
                });
            }
        }
        return e;
    }
    handleTouchEnd() {
        return;
    }
    handleTouchMove() {
        return;
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, util_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
}
exports.default = Tap;
//# sourceMappingURL=tap.js.map