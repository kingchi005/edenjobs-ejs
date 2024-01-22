"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const manipulator_2 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const base_component_1 = __importDefault(require("../base-component"));
const NAME = "scrollspy";
const DATA_KEY = "te.scrollspy";
const EVENT_KEY = `.${DATA_KEY}`;
const Default = {
    offset: 10,
    method: "auto",
    target: "",
};
const DefaultType = {
    offset: "number",
    method: "string",
    target: "(string|element)",
};
const DefaultClasses = {
    active: "!text-primary dark:!text-primary-400 font-semibold border-l-[0.125rem] border-solid border-primary dark:border-primary-400",
};
const DefaultClassesType = {
    active: "string",
};
const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
const EVENT_SCROLL = `scroll${EVENT_KEY}`;
const LINK_ACTIVE = "data-te-nav-link-active";
const SELECTOR_DROPDOWN_ITEM = "[data-te-dropdown-item-ref]";
const SELECTOR_NAV_LIST_GROUP = "[data-te-nav-list-ref]";
const SELECTOR_NAV_LINKS = "[data-te-nav-link-ref]";
const SELECTOR_NAV_ITEMS = "[data-te-nav-item-ref]";
const SELECTOR_LIST_ITEMS = "[data-te-list-group-item-ref]";
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, ${SELECTOR_DROPDOWN_ITEM}`;
const SELECTOR_DROPDOWN = "[data-te-dropdown-ref]";
const SELECTOR_DROPDOWN_TOGGLE = "[data-te-dropdown-toggle-ref]";
const METHOD_OFFSET = "maxOffset";
const METHOD_POSITION = "position";
class ScrollSpy extends base_component_1.default {
    constructor(element, config, classes) {
        super(element);
        this._scrollElement =
            this._element.tagName === "BODY" ? window : this._element;
        this._config = this._getConfig(config);
        this._classes = this._getClasses(classes);
        this._offsets = [];
        this._targets = [];
        this._activeTarget = null;
        this._scrollHeight = 0;
        event_handler_1.default.on(this._scrollElement, EVENT_SCROLL, () => this._process());
        this.refresh();
        this._process();
    }
    static get Default() {
        return Default;
    }
    static get NAME() {
        return NAME;
    }
    refresh() {
        const autoMethod = this._scrollElement === this._scrollElement.window
            ? METHOD_OFFSET
            : METHOD_POSITION;
        const offsetMethod = this._config.method === "auto" ? autoMethod : this._config.method;
        const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
        this._offsets = [];
        this._targets = [];
        this._scrollHeight = this._getScrollHeight();
        const targets = selector_engine_1.default.find(SELECTOR_LINK_ITEMS, this._config.target);
        targets
            .map((element) => {
            const targetSelector = (0, index_1.getSelectorFromElement)(element);
            const target = targetSelector
                ? selector_engine_1.default.findOne(targetSelector)
                : null;
            if (target) {
                const targetBCR = target.getBoundingClientRect();
                if (targetBCR.width || targetBCR.height) {
                    return [
                        manipulator_1.default[offsetMethod](target).top + offsetBase,
                        targetSelector,
                    ];
                }
            }
            return null;
        })
            .filter((item) => item)
            .sort((a, b) => a[0] - b[0])
            .forEach((item) => {
            this._offsets.push(item[0]);
            this._targets.push(item[1]);
        });
    }
    dispose() {
        event_handler_1.default.off(this._scrollElement, EVENT_KEY);
        super.dispose();
    }
    _getConfig(config) {
        config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), (typeof config === "object" && config ? config : {}));
        config.target = (0, index_1.getElement)(config.target) || document.documentElement;
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_2.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _getScrollTop() {
        return this._scrollElement === window
            ? this._scrollElement.pageYOffset
            : this._scrollElement.scrollTop;
    }
    _getScrollHeight() {
        return (this._scrollElement.scrollHeight ||
            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    }
    _getOffsetHeight() {
        return this._scrollElement === window
            ? window.innerHeight
            : this._scrollElement.getBoundingClientRect().height;
    }
    _process() {
        const scrollTop = this._getScrollTop() + this._config.offset;
        const scrollHeight = this._getScrollHeight();
        const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();
        if (this._scrollHeight !== scrollHeight) {
            this.refresh();
        }
        if (scrollTop >= maxScroll) {
            const target = this._targets[this._targets.length - 1];
            if (this._activeTarget !== target) {
                this._activate(target);
            }
            return;
        }
        if (this._activeTarget &&
            scrollTop < this._offsets[0] &&
            this._offsets[0] > 0) {
            this._activeTarget = null;
            this._clear();
            return;
        }
        for (let i = this._offsets.length; i--;) {
            const isActiveTarget = this._activeTarget !== this._targets[i] &&
                scrollTop >= this._offsets[i] &&
                (typeof this._offsets[i + 1] === "undefined" ||
                    scrollTop < this._offsets[i + 1]);
            if (isActiveTarget) {
                this._activate(this._targets[i]);
            }
        }
    }
    _activate(target) {
        this._activeTarget = target;
        this._clear();
        const queries = SELECTOR_LINK_ITEMS.split(",").map((selector) => `${selector}[data-te-target="${target}"],${selector}[href="${target}"]`);
        const link = selector_engine_1.default.findOne(queries.join(","), this._config.target);
        link.classList.add(...this._classes.active.split(" "));
        link.setAttribute(LINK_ACTIVE, "");
        if (link.getAttribute(SELECTOR_DROPDOWN_ITEM)) {
            selector_engine_1.default.findOne(SELECTOR_DROPDOWN_TOGGLE, link.closest(SELECTOR_DROPDOWN)).classList.add(...this._classes.active.split(" "));
        }
        else {
            selector_engine_1.default.parents(link, SELECTOR_NAV_LIST_GROUP).forEach((listGroup) => {
                selector_engine_1.default.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach((item) => {
                    item.classList.add(...this._classes.active.split(" "));
                    item.setAttribute(LINK_ACTIVE, "");
                });
                selector_engine_1.default.prev(listGroup, SELECTOR_NAV_ITEMS).forEach((navItem) => {
                    selector_engine_1.default.children(navItem, SELECTOR_NAV_LINKS).forEach((item) => item.classList.add(...this._classes.active.split(" ")));
                });
            });
        }
        event_handler_1.default.trigger(this._scrollElement, EVENT_ACTIVATE, {
            relatedTarget: target,
        });
    }
    _clear() {
        selector_engine_1.default.find(SELECTOR_LINK_ITEMS, this._config.target)
            .filter((node) => node.classList.contains(...this._classes.active.split(" ")))
            .forEach((node) => {
            node.classList.remove(...this._classes.active.split(" "));
            node.removeAttribute(LINK_ACTIVE);
        });
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = ScrollSpy.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
                return;
            }
            if (typeof data[config] === "undefined") {
                throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
        });
    }
}
exports.default = ScrollSpy;
//# sourceMappingURL=scrollspy.js.map