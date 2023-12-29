"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const touchUtil_1 = __importDefault(require("./touchUtil"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const util_1 = require("../../util");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const NAME = "rotate";
const EVENT_END = `${NAME}end`;
const EVENT_START = `${NAME}start`;
const DefaultType = {
    angle: "number",
    pointers: "number",
};
const Default = {
    angle: 0,
    pointers: 2,
};
class Rotate extends touchUtil_1.default {
    constructor(element, options) {
        super();
        this._element = element;
        this._options = this._getConfig(options);
        this._origin = {};
    }
    static get NAME() {
        return NAME;
    }
    handleTouchStart(e) {
        e.type === "touchstart" && e.preventDefault();
        if (e.touches.length < 2)
            return;
        this._startTouch = e;
        this._origin = {};
        event_handler_1.default.trigger(this._element, EVENT_START, { touch: e });
        return;
    }
    handleTouchMove(e) {
        e.type === "touchmove" && e.preventDefault();
        let origin;
        let input;
        const touches = e.touches;
        if (touches.length === 1 && this._options.pointers === 1) {
            const { left, top, width, height } = this._element.getBoundingClientRect();
            origin = {
                x: left + width / 2,
                y: top + height / 2,
            };
            input = touches[0];
        }
        else if (e.touches.length === 2 && this._options.pointers === 2) {
            const [t2, t1] = e.touches;
            const _position = {
                x1: t1.clientX,
                x2: t2.clientX,
                y1: t1.clientY,
                y2: t2.clientY,
            };
            origin = this._getMidPoint(_position);
            input = this._getRightMostTouch(e.touches);
        }
        else {
            return;
        }
        this.currentAngle = this._getAngle(origin.x, origin.y, input.clientX, input.clientY);
        if (!this._origin.initialAngle) {
            this._origin.initialAngle = this._origin.previousAngle =
                this.currentAngle;
            this._origin.distance = this._origin.change = 0;
        }
        else {
            this._origin.change = this._getAngularDistance(this._origin.previousAngle, this.currentAngle);
            this._origin.distance += this._origin.change;
        }
        this._origin.previousAngle = this.currentAngle;
        this.rotate = {
            currentAngle: this.currentAngle,
            distance: this._origin.distance,
            change: this._origin.change,
        };
        event_handler_1.default.trigger(this._element, NAME, Object.assign(Object.assign({}, this.rotate), { touch: e }));
    }
    handleTouchEnd(e) {
        e.type === "touchend" && e.preventDefault();
        this._origin = {};
        event_handler_1.default.trigger(this._element, EVENT_END, { touch: e });
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, util_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
}
exports.default = Rotate;
//# sourceMappingURL=rotate.js.map