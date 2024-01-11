"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const touchUtil_1 = __importDefault(require("./touchUtil"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const util_1 = require("../../util");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const NAME = "pan";
const EVENT_START = `${NAME}start`;
const EVENT_END = `${NAME}end`;
const EVENT_MOVE = `${NAME}move`;
const LEFT = "left";
const RIGHT = "right";
const DefaultType = {
    threshold: "number",
    direction: "string",
    pointers: "number",
};
const Default = {
    threshold: 20,
    direction: "all",
    pointers: 1,
};
class Pan extends touchUtil_1.default {
    constructor(element, options = {}) {
        super();
        this._element = element;
        this._options = this._getConfig(options);
        this._startTouch = null;
    }
    static get NAME() {
        return NAME;
    }
    handleTouchStart(e) {
        this._startTouch = this._getCoordinates(e);
        this._movedTouch = e;
        event_handler_1.default.trigger(this._element, EVENT_START, { touch: e });
    }
    handleTouchMove(e) {
        e.type === "touchmove" && e.preventDefault();
        const { threshold, direction } = this._options;
        const postion = this._getCoordinates(e);
        const movedPosition = this._getCoordinates(this._movedTouch);
        const displacement = this._getOrigin(postion, this._startTouch);
        const displacementMoved = this._getOrigin(postion, movedPosition);
        const pan = this._getDirection(displacement);
        const movedDirection = this._getDirection(displacementMoved);
        const { x, y } = pan;
        if (direction === "all" && (y.value > threshold || x.value > threshold)) {
            const direction = y.value > x.value ? y.direction : x.direction;
            event_handler_1.default.trigger(this._element, `${NAME}${direction}`, { touch: e });
            event_handler_1.default.trigger(this._element, NAME, Object.assign(Object.assign({}, displacementMoved), { touch: e }));
        }
        const axis = direction === LEFT || direction === RIGHT ? "x" : "y";
        if (movedDirection[axis].direction === direction &&
            pan[axis].value > threshold) {
            event_handler_1.default.trigger(this._element, `${NAME}${direction}`, {
                touch: e,
                [axis]: postion[axis] - movedPosition[axis],
            });
        }
        this._movedTouch = e;
        event_handler_1.default.trigger(this._element, EVENT_MOVE, { touch: e });
    }
    handleTouchEnd(e) {
        e.type === "touchend" && e.preventDefault();
        this._movedTouch = null;
        this._startTouch = null;
        event_handler_1.default.trigger(this._element, EVENT_END, { touch: e });
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, util_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
}
exports.default = Pan;
//# sourceMappingURL=pan.js.map