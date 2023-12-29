"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Popper = __importStar(require("@popperjs/core"));
const index_1 = require("../util/index");
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const base_component_1 = __importDefault(require("../base-component"));
const NAME = "dropdown";
const DATA_KEY = "te.dropdown";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const ESCAPE_KEY = "Escape";
const SPACE_KEY = "Space";
const TAB_KEY = "Tab";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_DOWN_KEY = "ArrowDown";
const RIGHT_MOUSE_BUTTON = 2;
const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`);
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_SHOW = "show";
const CLASS_NAME_DROPUP = "dropup";
const CLASS_NAME_DROPEND = "dropend";
const CLASS_NAME_DROPSTART = "dropstart";
const SELECTOR_NAVBAR = "[data-te-navbar-ref]";
const SELECTOR_DATA_TOGGLE = "[data-te-dropdown-toggle-ref]";
const SELECTOR_MENU = "[data-te-dropdown-menu-ref]";
const SELECTOR_NAVBAR_NAV = "[data-te-navbar-nav-ref]";
const SELECTOR_VISIBLE_ITEMS = "[data-te-dropdown-menu-ref] [data-te-dropdown-item-ref]:not(.disabled):not(:disabled)";
const PLACEMENT_TOP = (0, index_1.isRTL)() ? "top-end" : "top-start";
const PLACEMENT_TOPEND = (0, index_1.isRTL)() ? "top-start" : "top-end";
const PLACEMENT_BOTTOM = (0, index_1.isRTL)() ? "bottom-end" : "bottom-start";
const PLACEMENT_BOTTOMEND = (0, index_1.isRTL)() ? "bottom-start" : "bottom-end";
const PLACEMENT_RIGHT = (0, index_1.isRTL)() ? "left-start" : "right-start";
const PLACEMENT_LEFT = (0, index_1.isRTL)() ? "right-start" : "left-start";
const ANIMATION_FADE_IN = [{ opacity: "0" }, { opacity: "1" }];
const ANIMATION_FADE_OUT = [{ opacity: "1" }, { opacity: "0" }];
const ANIMATION_TIMING = {
    iterations: 1,
    easing: "ease",
    fill: "both",
};
const Default = {
    offset: [0, 2],
    boundary: "clippingParents",
    reference: "toggle",
    display: "dynamic",
    popperConfig: null,
    autoClose: true,
    dropdownAnimation: "on",
    animationDuration: 550,
};
const DefaultType = {
    offset: "(array|string|function)",
    boundary: "(string|element)",
    reference: "(string|element|object)",
    display: "string",
    popperConfig: "(null|object|function)",
    autoClose: "(boolean|string)",
    dropdownAnimation: "string",
    animationDuration: "number",
};
class Dropdown extends base_component_1.default {
    constructor(element, config) {
        super(element);
        this._popper = null;
        this._config = this._getConfig(config);
        this._menu = this._getMenuElement();
        this._inNavbar = this._detectNavbar();
        this._fadeOutAnimate = null;
        const isPrefersReducedMotionSet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this._animationCanPlay =
            this._config.dropdownAnimation === "on" && !isPrefersReducedMotionSet;
        this._didInit = false;
        this._init();
    }
    static get Default() {
        return Default;
    }
    static get DefaultType() {
        return DefaultType;
    }
    static get NAME() {
        return NAME;
    }
    toggle() {
        return this._isShown() ? this.hide() : this.show();
    }
    show() {
        if ((0, index_1.isDisabled)(this._element) || this._isShown(this._menu)) {
            return;
        }
        const relatedTarget = {
            relatedTarget: this._element,
        };
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW, relatedTarget);
        if (showEvent.defaultPrevented) {
            return;
        }
        const parent = Dropdown.getParentFromElement(this._element);
        if (this._inNavbar) {
            manipulator_1.default.setDataAttribute(this._menu, "popper", "none");
        }
        else {
            this._createPopper(parent);
        }
        if ("ontouchstart" in document.documentElement &&
            !parent.closest(SELECTOR_NAVBAR_NAV)) {
            []
                .concat(...document.body.children)
                .forEach((elem) => event_handler_1.default.on(elem, "mouseover", index_1.noop));
        }
        this._element.focus();
        this._element.setAttribute("aria-expanded", true);
        this._menu.setAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`, "");
        this._animationCanPlay &&
            this._menu.animate(ANIMATION_FADE_IN, Object.assign(Object.assign({}, ANIMATION_TIMING), { duration: this._config.animationDuration }));
        this._element.setAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`, "");
        setTimeout(() => {
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, relatedTarget);
        }, this._animationCanPlay ? this._config.animationDuration : 0);
    }
    hide() {
        if ((0, index_1.isDisabled)(this._element) || !this._isShown(this._menu)) {
            return;
        }
        const relatedTarget = {
            relatedTarget: this._element,
        };
        this._completeHide(relatedTarget);
    }
    dispose() {
        if (this._popper) {
            this._popper.destroy();
        }
        super.dispose();
    }
    update() {
        this._inNavbar = this._detectNavbar();
        if (this._popper) {
            this._popper.update();
        }
    }
    _init() {
        if (this._didInit) {
            return;
        }
        event_handler_1.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler);
        event_handler_1.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
        event_handler_1.default.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
        event_handler_1.default.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
        this._didInit = true;
    }
    _completeHide(relatedTarget) {
        if (this._fadeOutAnimate && this._fadeOutAnimate.playState === "running") {
            return;
        }
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE, relatedTarget);
        if (hideEvent.defaultPrevented) {
            return;
        }
        if ("ontouchstart" in document.documentElement) {
            []
                .concat(...document.body.children)
                .forEach((elem) => event_handler_1.default.off(elem, "mouseover", index_1.noop));
        }
        if (this._animationCanPlay) {
            this._fadeOutAnimate = this._menu.animate(ANIMATION_FADE_OUT, Object.assign(Object.assign({}, ANIMATION_TIMING), { duration: this._config.animationDuration }));
        }
        setTimeout(() => {
            if (this._popper) {
                this._popper.destroy();
            }
            this._menu.removeAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`);
            this._element.removeAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`);
            this._element.setAttribute("aria-expanded", "false");
            manipulator_1.default.removeDataAttribute(this._menu, "popper");
            event_handler_1.default.trigger(this._element, EVENT_HIDDEN, relatedTarget);
        }, this._animationCanPlay ? this._config.animationDuration : 0);
    }
    _getConfig(config) {
        config = Object.assign(Object.assign(Object.assign({}, this.constructor.Default), manipulator_1.default.getDataAttributes(this._element)), config);
        (0, index_1.typeCheckConfig)(NAME, config, this.constructor.DefaultType);
        if (typeof config.reference === "object" &&
            !(0, index_1.isElement)(config.reference) &&
            typeof config.reference.getBoundingClientRect !== "function") {
            throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
        }
        return config;
    }
    _createPopper(parent) {
        if (typeof Popper === "undefined") {
            throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
        }
        let referenceElement = this._element;
        if (this._config.reference === "parent") {
            referenceElement = parent;
        }
        else if ((0, index_1.isElement)(this._config.reference)) {
            referenceElement = (0, index_1.getElement)(this._config.reference);
        }
        else if (typeof this._config.reference === "object") {
            referenceElement = this._config.reference;
        }
        const popperConfig = this._getPopperConfig();
        const isDisplayStatic = popperConfig.modifiers.find((modifier) => modifier.name === "applyStyles" && modifier.enabled === false);
        this._popper = Popper.createPopper(referenceElement, this._menu, popperConfig);
        if (isDisplayStatic) {
            manipulator_1.default.setDataAttribute(this._menu, "popper", "static");
        }
    }
    _isShown(element = this._element) {
        return (element.dataset[`teDropdown${CLASS_NAME_SHOW.charAt(0).toUpperCase() + CLASS_NAME_SHOW.slice(1)}`] === "");
    }
    _getMenuElement() {
        return selector_engine_1.default.next(this._element, SELECTOR_MENU)[0];
    }
    _getPlacement() {
        const parentDropdown = this._element.parentNode;
        if (parentDropdown.dataset.teDropdownPosition === CLASS_NAME_DROPEND) {
            return PLACEMENT_RIGHT;
        }
        if (parentDropdown.dataset.teDropdownPosition === CLASS_NAME_DROPSTART) {
            return PLACEMENT_LEFT;
        }
        const isEnd = parentDropdown.dataset.teDropdownAlignment === "end";
        if (parentDropdown.dataset.teDropdownPosition === CLASS_NAME_DROPUP) {
            return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
        }
        return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }
    _detectNavbar() {
        return this._element.closest(SELECTOR_NAVBAR) !== null;
    }
    _getOffset() {
        const { offset } = this._config;
        if (typeof offset === "string") {
            return offset.split(",").map((val) => Number.parseInt(val, 10));
        }
        if (typeof offset === "function") {
            return (popperData) => offset(popperData, this._element);
        }
        return offset;
    }
    _getPopperConfig() {
        const defaultBsPopperConfig = {
            placement: this._getPlacement(),
            modifiers: [
                {
                    name: "preventOverflow",
                    options: {
                        boundary: this._config.boundary,
                    },
                },
                {
                    name: "offset",
                    options: {
                        offset: this._getOffset(),
                    },
                },
            ],
        };
        if (this._config.display === "static") {
            defaultBsPopperConfig.modifiers = [
                {
                    name: "applyStyles",
                    enabled: false,
                },
            ];
        }
        return Object.assign(Object.assign({}, defaultBsPopperConfig), (typeof this._config.popperConfig === "function"
            ? this._config.popperConfig(defaultBsPopperConfig)
            : this._config.popperConfig));
    }
    _selectMenuItem({ key, target }) {
        const items = selector_engine_1.default.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(index_1.isVisible);
        if (!items.length) {
            return;
        }
        (0, index_1.getNextActiveElement)(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Dropdown.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
                return;
            }
            if (typeof data[config] === "undefined") {
                throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
        });
    }
    static clearMenus(event) {
        if (event &&
            (event.button === RIGHT_MOUSE_BUTTON ||
                (event.type === "keyup" && event.key !== TAB_KEY))) {
            return;
        }
        const toggles = selector_engine_1.default.find(SELECTOR_DATA_TOGGLE);
        for (let i = 0, len = toggles.length; i < len; i++) {
            const context = Dropdown.getInstance(toggles[i]);
            if (!context || context._config.autoClose === false) {
                continue;
            }
            if (!context._isShown()) {
                continue;
            }
            const relatedTarget = {
                relatedTarget: context._element,
            };
            if (event) {
                const composedPath = event.composedPath();
                const isMenuTarget = composedPath.includes(context._menu);
                if (composedPath.includes(context._element) ||
                    (context._config.autoClose === "inside" && !isMenuTarget) ||
                    (context._config.autoClose === "outside" && isMenuTarget)) {
                    continue;
                }
                if (context._menu.contains(event.target) &&
                    ((event.type === "keyup" && event.key === TAB_KEY) ||
                        /input|select|option|textarea|form/i.test(event.target.tagName))) {
                    continue;
                }
                if (event.type === "click") {
                    relatedTarget.clickEvent = event;
                }
            }
            context._completeHide(relatedTarget);
        }
    }
    static getParentFromElement(element) {
        return (0, index_1.getElementFromSelector)(element) || element.parentNode;
    }
    static dataApiKeydownHandler(event) {
        if (/input|textarea/i.test(event.target.tagName)
            ? event.key === SPACE_KEY ||
                (event.key !== ESCAPE_KEY &&
                    ((event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY) ||
                        event.target.closest(SELECTOR_MENU)))
            : !REGEXP_KEYDOWN.test(event.key)) {
            return;
        }
        const isActive = this.dataset[`teDropdown${CLASS_NAME_SHOW.charAt(0).toUpperCase() + CLASS_NAME_SHOW.slice(1)}`] === "";
        if (!isActive && event.key === ESCAPE_KEY) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if ((0, index_1.isDisabled)(this)) {
            return;
        }
        const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE)
            ? this
            : selector_engine_1.default.prev(this, SELECTOR_DATA_TOGGLE)[0];
        const instance = Dropdown.getOrCreateInstance(getToggleButton);
        if (event.key === ESCAPE_KEY) {
            instance.hide();
            return;
        }
        if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
            if (!isActive) {
                instance.show();
            }
            instance._selectMenuItem(event);
            return;
        }
        if (!isActive || event.key === SPACE_KEY) {
            Dropdown.clearMenus();
        }
    }
}
exports.default = Dropdown;
//# sourceMappingURL=dropdown.js.map