"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const tooltip_1 = __importDefault(require("./tooltip"));
const NAME = "rating";
const DATA_KEY = "te.rating";
const DATA_INIT = "data-te-rating-init";
const SELECTOR_ICON = "[data-te-rating-icon-ref]";
const EVENT_KEY = `.${DATA_KEY}`;
const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";
const DefaultType = {
    tooltip: "string",
    value: "(string|number)",
    readonly: "boolean",
    after: "string",
    before: "string",
    dynamic: "boolean",
    active: "string",
};
const Default = {
    tooltip: "top",
    value: "",
    readonly: false,
    after: "",
    before: "",
    dynamic: false,
    active: "fill-current",
};
const EVENT_SELECT = `onSelect${EVENT_KEY}`;
const EVENT_HOVER = `onHover${EVENT_KEY}`;
const EVENT_KEYUP = `keyup${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;
class Rating {
    constructor(element, options) {
        this._element = element;
        this._icons = selector_engine_1.default.find(SELECTOR_ICON, this._element);
        this._options = this._getConfig(options);
        this._index = -1;
        this._savedIndex = null;
        this._originalClassList = [];
        this._originalIcons = [];
        this._fn = {};
        this._tooltips = [];
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this._init();
        }
    }
    static get NAME() {
        return NAME;
    }
    dispose() {
        data_1.default.removeData(this._element, DATA_KEY);
        if (!this._options.readonly) {
            event_handler_1.default.off(this._element, EVENT_KEYUP);
            event_handler_1.default.off(this._element, EVENT_FOCUSOUT);
            event_handler_1.default.off(this._element, EVENT_KEYDOWN);
            this._element.removeEventListener("mouseleave", this._fn.mouseleave);
            this._icons.forEach((el, i) => {
                event_handler_1.default.off(el, EVENT_MOUSEDOWN);
                el.removeEventListener("mouseenter", this._fn.mouseenter[i]);
                manipulator_1.default.removeClass(el, "cursor-pointer");
            });
            this._tooltips.forEach((el) => {
                el._element.removeAttribute(DATA_INIT);
                el.dispose();
            });
            this._icons.forEach((el) => el.removeAttribute("tabIndex"));
        }
        this._element = null;
    }
    _init() {
        if (!this._options.readonly) {
            this._bindMouseEnter();
            this._bindMouseLeave();
            this._bindMouseDown();
            this._bindKeyDown();
            this._bindKeyUp();
            this._bindFocusLost();
            this._icons.forEach((el) => {
                manipulator_1.default.addClass(el, "cursor-pointer");
            });
        }
        if (this._options.dynamic) {
            this._saveOriginalClassList();
            this._saveOriginalIcons();
        }
        this._setCustomText();
        this._setToolTips();
        if (this._options.value) {
            this._index = this._options.value - 1;
            this._updateRating(this._index);
        }
    }
    _getConfig(config) {
        const dataAttributes = manipulator_1.default.getDataAttributes(this._element);
        config = Object.assign(Object.assign(Object.assign({}, Default), dataAttributes), config);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _bindMouseEnter() {
        this._fn.mouseenter = [];
        this._icons.forEach((el, i) => {
            el.addEventListener("mouseenter", this._fn.mouseenter[i] = (e) => {
                this._index = this._icons.indexOf(e.target);
                this._updateRating(this._index);
                this._triggerEvents(el, EVENT_HOVER);
            });
        });
    }
    _bindMouseLeave() {
        this._element.addEventListener("mouseleave", this._fn.mouseleave = () => {
            if (this._savedIndex !== null) {
                this._updateRating(this._savedIndex);
                this._index = this._savedIndex;
            }
            else if (this._options.value) {
                this._updateRating(this._options.value - 1);
                this._index = this._options.value - 1;
            }
            else {
                this._index = -1;
                this._clearRating();
            }
        });
    }
    _bindMouseDown() {
        this._icons.forEach((el) => {
            event_handler_1.default.on(el, EVENT_MOUSEDOWN, () => {
                this._setElementOutline("none");
                this._savedIndex = this._index;
                this._triggerEvents(el, EVENT_SELECT);
            });
        });
    }
    _bindKeyDown() {
        this._element.tabIndex = 0;
        event_handler_1.default.on(this._element, EVENT_KEYDOWN, (e) => this._updateAfterKeyDown(e));
    }
    _bindKeyUp() {
        event_handler_1.default.on(this._element, EVENT_KEYUP, () => this._setElementOutline("auto"));
    }
    _bindFocusLost() {
        event_handler_1.default.on(this._element, EVENT_FOCUSOUT, () => this._setElementOutline("none"));
    }
    _setElementOutline(value) {
        this._element.style.outline = value;
    }
    _triggerEvents(el, event) {
        event_handler_1.default.trigger(el, event, {
            value: this._index + 1,
        });
    }
    _updateAfterKeyDown(e) {
        const maxIndex = this._icons.length - 1;
        const indexBeforeChange = this._index;
        if (e.key === ARROW_RIGHT_KEY && this._index < maxIndex) {
            this._index += 1;
        }
        if (e.key === ARROW_LEFT_KEY && this._index > -1) {
            this._index -= 1;
        }
        if (indexBeforeChange !== this._index) {
            this._savedIndex = this._index;
            this._updateRating(this._savedIndex);
            this._triggerEvents(this._icons[this._savedIndex], EVENT_SELECT);
        }
    }
    _updateRating(index) {
        this._clearRating();
        if (this._options.dynamic) {
            this._restoreOriginalIcon(index);
        }
        this._icons.forEach((el, i) => {
            if (i <= index) {
                manipulator_1.default.addClass(el.querySelector("svg"), this._options.active);
            }
        });
    }
    _clearRating() {
        this._icons.forEach((el, i) => {
            const element = el.querySelector("svg");
            if (this._options.dynamic) {
                el.classList = this._originalClassList[i];
                element.innerHTML = this._originalIcons[i];
            }
            manipulator_1.default.removeClass(element, this._options.active);
        });
    }
    _setToolTips() {
        this._icons.forEach((el, i) => {
            const hasOwnTooltips = manipulator_1.default.getDataAttribute(el, "toggle");
            if (el.title && !hasOwnTooltips) {
                manipulator_1.default.setDataAttribute(el, "toggle", "tooltip");
                this._tooltips[i] = new tooltip_1.default(el, {
                    placement: this._options.tooltip,
                });
            }
        });
    }
    _setCustomText() {
        this._icons.forEach((el) => {
            const after = manipulator_1.default.getDataAttribute(el, "after");
            const before = manipulator_1.default.getDataAttribute(el, "before");
            if (after) {
                el.insertAdjacentHTML("afterEnd", after);
            }
            if (before) {
                el.insertAdjacentHTML("beforeBegin", before);
            }
        });
    }
    _saveOriginalClassList() {
        this._icons.forEach((el) => {
            const classList = el.classList.value;
            this._originalClassList.push(classList);
        });
    }
    _saveOriginalIcons() {
        this._icons.forEach((el) => {
            const svgHtml = el.querySelector("svg").innerHTML;
            this._originalIcons.push(svgHtml);
        });
    }
    _restoreOriginalIcon(index) {
        const classList = this._originalClassList[index];
        const icon = this._originalIcons[index];
        this._icons.forEach((el, i) => {
            if (i <= index) {
                const element = el.querySelector("svg");
                element.innerHTML = icon;
                el.classList = classList;
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
exports.default = Rating;
//# sourceMappingURL=rating.js.map