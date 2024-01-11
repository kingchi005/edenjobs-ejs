"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perfect_scrollbar_1 = __importDefault(require("perfect-scrollbar"));
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const NAME = "perfectScrollbar";
const CLASSNAME_PS = "perfect-scrollbar";
const DATA_KEY = "te.perfectScrollbar";
const TE_NAME = "te";
const PS_NAME = "ps";
const EVENTS = [
    { te: `scrollX.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-x" },
    { te: `scrollY.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-y" },
    { te: `scrollUp.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-up" },
    { te: `scrollDown.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-down" },
    { te: `scrollLeft.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-left" },
    { te: `scrollRight.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-right" },
    { te: `scrollXEnd.${TE_NAME}.${PS_NAME}`, ps: "ps-x-reach-end" },
    { te: `scrollYEnd.${TE_NAME}.${PS_NAME}`, ps: "ps-y-reach-end" },
    { te: `scrollXStart.${TE_NAME}.${PS_NAME}`, ps: "ps-x-reach-start" },
    { te: `scrollYStart.${TE_NAME}.${PS_NAME}`, ps: "ps-y-reach-start" },
];
const Default = {
    handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
    wheelSpeed: 1,
    wheelPropagation: true,
    swipeEasing: true,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    scrollingThreshold: 1000,
    useBothWheelAxes: false,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    positionRight: true,
};
const DefaultType = {
    handlers: "(string|array)",
    wheelSpeed: "number",
    wheelPropagation: "boolean",
    swipeEasing: "boolean",
    minScrollbarLength: "(number|null)",
    maxScrollbarLength: "(number|null)",
    scrollingThreshold: "number",
    useBothWheelAxes: "boolean",
    suppressScrollX: "boolean",
    suppressScrollY: "boolean",
    scrollXMarginOffset: "number",
    scrollYMarginOffset: "number",
    positionRight: "boolean",
};
const DefaultClasses = {
    ps: "group/ps overflow-hidden [overflow-anchor:none] touch-none",
    railX: "group/x absolute bottom-0 h-[0.9375rem] hidden opacity-0 transition-[background-color,_opacity] duration-200 ease-linear motion-reduce:transition-none z-[1035] group-[&.ps--active-x]/ps:block group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-x]/ps:opacity-60 hover:!opacity-90 focus:!opacity-90 [&.ps--clicking]:!opacity-90 outline-none",
    railXColors: "group-[&.ps--active-x]/ps:bg-transparent hover:!bg-[#eee] focus:!bg-[#eee] [&.ps--clicking]:!bg-[#eee] dark:hover:!bg-[#555] dark:focus:!bg-[#555] dark:[&.ps--clicking]:!bg-[#555]",
    railXThumb: "absolute bottom-0.5 rounded-md h-1.5 group-focus/ps:opacity-100 group-active/ps:opacity-100 [transition:background-color_.2s_linear,_height_.2s_ease-in-out] group-hover/x:h-[11px] group-focus/x:h-[0.6875rem] group-[&.ps--clicking]/x:bg-[#999] group-[&.ps--clicking]/x:h-[11px] outline-none",
    railXThumbColors: "bg-[#aaa] group-hover/x:bg-[#999] group-focus/x:bg-[#999]",
    railY: "group/y absolute right-0 w-[0.9375rem] hidden opacity-0 transition-[background-color,_opacity] duration-200 ease-linear motion-reduce:transition-none z-[1035] group-[&.ps--active-y]/ps:block group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-y]/ps:opacity-60 hover:!opacity-90 focus:!opacity-90 [&.ps--clicking]:!opacity-90 outline-none",
    railYColors: "group-[&.ps--active-y]/ps:bg-transparent hover:!bg-[#eee] focus:!bg-[#eee] [&.ps--clicking]:!bg-[#eee] dark:hover:!bg-[#555] dark:focus:!bg-[#555] dark:[&.ps--clicking]:!bg-[#555]",
    railYThumb: "absolute right-0.5 rounded-md w-1.5 group-focus/ps:opacity-100 group-active/ps:opacity-100 [transition:background-color_.2s_linear,_width_.2s_ease-in-out,_opacity] group-hover/y:w-[11px] group-focus/y:w-[0.6875rem] group-[&.ps--clicking]/y:w-[11px] outline-none",
    railYThumbColors: "bg-[#aaa] group-hover/y:bg-[#999] group-focus/y:bg-[#999] group-[&.ps--clicking]/y:bg-[#999]",
};
const DefaultClassesType = {
    ps: "string",
    railX: "string",
    railXColors: "string",
    railXThumb: "string",
    railXThumbColors: "string",
    railY: "string",
    railYColors: "string",
    railYThumb: "string",
    railYThumbColors: "string",
};
class PerfectScrollbars {
    constructor(element, options = {}, classes = {}) {
        this._element = element;
        this._options = this._getConfig(options);
        this._classes = this._getClasses(classes);
        this.perfectScrollbar = null;
        this._observer = null;
        this._psClasses = [
            {
                ps: "ps__rail-x",
                te: this._classes.railX,
                teColor: this._classes.railXColors,
            },
            {
                ps: "ps__rail-y",
                te: this._classes.railY,
                teColor: this._classes.railYColors,
            },
            {
                ps: "ps__thumb-x",
                te: this._classes.railXThumb,
                teColor: this._classes.railXThumbColors,
            },
            {
                ps: "ps__thumb-y",
                te: this._classes.railYThumb,
                teColor: this._classes.railYThumbColors,
            },
        ];
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            manipulator_1.default.addClass(this._element, CLASSNAME_PS);
        }
        this.init();
    }
    static get NAME() {
        return NAME;
    }
    get railX() {
        return selector_engine_1.default.findOne(".ps__rail-x", this._element);
    }
    get railY() {
        return selector_engine_1.default.findOne(".ps__rail-y", this._element);
    }
    _getConfig(config) {
        const dataAttributes = manipulator_1.default.getDataAttributes(this._element);
        if (dataAttributes.handlers !== undefined) {
            dataAttributes.handlers = dataAttributes.handlers.split(" ");
        }
        config = Object.assign(Object.assign(Object.assign({}, Default), dataAttributes), config);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    dispose() {
        this._options.positionRight && this._observer.disconnect();
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
        this._dataAttrOptions = null;
        this._options = null;
        this.perfectScrollbar.destroy();
        this.removeEvent(EVENTS);
        this.perfectScrollbar = null;
    }
    init() {
        this.perfectScrollbar = new perfect_scrollbar_1.default(this._element, this._options);
        this._addPerfectScrollbarStyles();
        this._updateScrollPosition();
        this.perfectScrollbar.update();
        this._initEvents(EVENTS);
        if (this._options.positionRight) {
            this._observer = new ResizeObserver(() => {
                setTimeout(() => {
                    this._updateScrollPosition();
                }, 100);
            });
            const observerOptions = {
                attributes: true,
                attributeFilter: ["class", "className"],
            };
            this._observer.observe(this._element, observerOptions);
        }
    }
    _updateScrollPosition() {
        const height = getComputedStyle(this._element).getPropertyValue("height");
        const width = getComputedStyle(this._element).getPropertyValue("width");
        if (this.railX) {
            this.railX.style.transform = `translateY(calc(-100% + ${this._canTransform(height) ? height : "0px"}))`;
        }
        if (this.railY) {
            this.railY.style.transform = `translateX(calc(-100% + ${this._canTransform(width) ? width : "0px"}))`;
        }
    }
    _canTransform(value) {
        return value && value.includes("px");
    }
    update() {
        return this.perfectScrollbar.update();
    }
    _initEvents(events = []) {
        events.forEach(({ ps, te }) => event_handler_1.default.on(this._element, ps, (e) => event_handler_1.default.trigger(this._element, te, { e })));
    }
    _addPerfectScrollbarStyles() {
        this._psClasses.forEach((item) => {
            const container = selector_engine_1.default.findOne(`.${item.ps}`, this._element);
            manipulator_1.default.addClass(container, item.te);
            manipulator_1.default.addClass(container, item.teColor);
        });
        manipulator_1.default.addClass(this._element, this._classes.ps);
        manipulator_1.default.removeClass(this._element, "ps");
    }
    removeEvent(event) {
        let filter = [];
        if (typeof event === "string") {
            filter = EVENTS.filter(({ te }) => te === event);
        }
        filter.forEach(({ ps, te }) => {
            event_handler_1.default.off(this._element, ps);
            event_handler_1.default.off(this._element, te);
        });
    }
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose|hide/.test(config)) {
                return;
            }
            if (!data) {
                data = new PerfectScrollbars(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config]();
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
exports.default = PerfectScrollbars;
//# sourceMappingURL=perfect-scrollbar.js.map