"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const NAME = "infiniteScroll";
const DATA_KEY = `te.${NAME}`;
const Default = {
    infiniteDirection: "y",
};
const DefaultType = {
    infiniteDirection: "string",
};
class InfiniteScroll {
    constructor(element, data) {
        this._element = element;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
        this._options = this._getConfig(data);
        this.scrollHandler = this._scrollHandler.bind(this);
        this._init();
    }
    static get NAME() {
        return NAME;
    }
    get rect() {
        return this._element.getBoundingClientRect();
    }
    get condition() {
        if (this._element === window) {
            return (Math.abs(window.scrollY +
                window.innerHeight -
                document.documentElement.scrollHeight) < 1);
        }
        if (this._options.infiniteDirection === "x") {
            return (this.rect.width + this._element.scrollLeft + 10 >=
                this._element.scrollWidth);
        }
        return (Math.ceil(this.rect.height + this._element.scrollTop) >=
            this._element.scrollHeight);
    }
    dispose() {
        event_handler_1.default.off(this._element, "scroll", this.scrollHandler);
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    _init() {
        event_handler_1.default.on(this._element, "scroll", () => this._scrollHandler());
    }
    _scrollHandler() {
        if (this.condition) {
            event_handler_1.default.trigger(this._element, "complete.te.infiniteScroll");
        }
        event_handler_1.default.off(this._element, "scroll", this.scrollHandler);
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), (this._element !== window
            ? manipulator_1.default.getDataAttributes(this._element)
            : {})), options);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data) {
                data = new InfiniteScroll(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](this);
            }
        });
    }
}
exports.default = InfiniteScroll;
//# sourceMappingURL=infinite-scroll.js.map