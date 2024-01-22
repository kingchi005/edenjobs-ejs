"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const util_1 = require("../../util");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const NAME = "swipe";
const DefaultType = {
    threshold: "number",
    direction: "string",
};
const Default = {
    threshold: 10,
    direction: "all",
};
class Swipe {
    constructor(element, options) {
        this._element = element;
        this._startPosition = null;
        this._options = this._getConfig(options);
    }
    handleTouchStart(e) {
        this._startPosition = this._getCoordinates(e);
    }
    handleTouchMove(e) {
        if (!this._startPosition)
            return;
        const position = this._getCoordinates(e);
        const displacement = {
            x: position.x - this._startPosition.x,
            y: position.y - this._startPosition.y,
        };
        const swipe = this._getDirection(displacement);
        if (this._options.direction === "all") {
            if (swipe.y.value < this._options.threshold &&
                swipe.x.value < this._options.threshold) {
                return;
            }
            const direction = swipe.y.value > swipe.x.value ? swipe.y.direction : swipe.x.direction;
            event_handler_1.default.trigger(this._element, `swipe${direction}`, { touch: e });
            event_handler_1.default.trigger(this._element, "swipe", { touch: e, direction });
            this._startPosition = null;
            return;
        }
        const axis = this._options.direction === "left" || this._options === "right"
            ? "x"
            : "y";
        if (swipe[axis].direction === this._options.direction &&
            swipe[axis].value > this._options.threshold) {
            event_handler_1.default.trigger(this._element, `swipe${swipe[axis].direction}`, {
                touch: e,
            });
            this._startPosition = null;
        }
    }
    handleTouchEnd() {
        this._startPosition = null;
    }
    _getCoordinates(e) {
        const [touch] = e.touches;
        return {
            x: touch.clientX,
            y: touch.clientY,
        };
    }
    _getDirection(displacement) {
        return {
            x: {
                direction: displacement.x < 0 ? "left" : "right",
                value: Math.abs(displacement.x),
            },
            y: {
                direction: displacement.y < 0 ? "up" : "down",
                value: Math.abs(displacement.y),
            },
        };
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, util_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
}
exports.default = Swipe;
//# sourceMappingURL=swipe.js.map