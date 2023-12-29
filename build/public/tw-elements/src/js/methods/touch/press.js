"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const touchUtil_1 = __importDefault(require("./touchUtil"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const util_1 = require("../../util");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const NAME = "press";
const EVENT_UP = "pressup";
const DefaultType = {
    time: "number",
    pointers: "number",
};
const Default = {
    time: 250,
    pointers: 1,
};
class Press extends touchUtil_1.default {
    constructor(element, options = {}) {
        super();
        this._element = element;
        this._options = this._getConfig(options);
        this._timer = null;
    }
    static get NAME() {
        return NAME;
    }
    handleTouchStart(e) {
        const { time, pointers } = this._options;
        if (e.touches.length === pointers) {
            this._timer = setTimeout(() => {
                event_handler_1.default.trigger(this._element, NAME, { touch: e, time });
                event_handler_1.default.trigger(this._element, EVENT_UP, { touch: e });
            }, time);
        }
    }
    handleTouchEnd() {
        clearTimeout(this._timer);
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, util_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
}
exports.default = Press;
//# sourceMappingURL=press.js.map