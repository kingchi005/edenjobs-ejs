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
const sanitizer_1 = require("../util/sanitizer");
const data_1 = __importDefault(require("../dom/data"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const base_component_1 = __importDefault(require("../base-component"));
const NAME = "tooltip";
const DATA_KEY = "te.tooltip";
const EVENT_KEY = `.${DATA_KEY}`;
const CLASS_PREFIX = "te-tooltip";
const DISALLOWED_ATTRIBUTES = new Set(["sanitize", "allowList", "sanitizeFn"]);
const DefaultType = {
    animation: "boolean",
    template: "string",
    title: "(string|element|function)",
    trigger: "string",
    delay: "(number|object)",
    html: "boolean",
    selector: "(string|boolean)",
    placement: "(string|function)",
    offset: "(array|string|function)",
    container: "(string|element|boolean)",
    fallbackPlacements: "array",
    boundary: "(string|element)",
    customClass: "(string|function)",
    sanitize: "boolean",
    sanitizeFn: "(null|function)",
    allowList: "object",
    popperConfig: "(null|object|function)",
};
const AttachmentMap = {
    AUTO: "auto",
    TOP: "top",
    RIGHT: (0, index_1.isRTL)() ? "left" : "right",
    BOTTOM: "bottom",
    LEFT: (0, index_1.isRTL)() ? "right" : "left",
};
const Default = {
    animation: true,
    template: '<div class="opacity-0 transition-opacity duration-300 ease-in-out absolute z-[1080] block m-0 text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal" role="tooltip">' +
        '<div data-te-tooltip-inner-ref class="tooltip-inner max-w-[200px] text-sm py-1.5 px-4 text-white text-center bg-[#6d6d6d] rounded"></div>' +
        "</div>",
    trigger: "hover focus",
    title: "",
    delay: 0,
    html: false,
    selector: false,
    placement: "top",
    offset: [0, 0],
    container: false,
    fallbackPlacements: ["top", "right", "bottom", "left"],
    boundary: "clippingParents",
    customClass: "",
    sanitize: true,
    sanitizeFn: null,
    allowList: sanitizer_1.DefaultAllowlist,
    popperConfig: { hide: true },
};
const Event = {
    HIDE: `hide${EVENT_KEY}`,
    HIDDEN: `hidden${EVENT_KEY}`,
    SHOW: `show${EVENT_KEY}`,
    SHOWN: `shown${EVENT_KEY}`,
    INSERTED: `inserted${EVENT_KEY}`,
    CLICK: `click${EVENT_KEY}`,
    FOCUSIN: `focusin${EVENT_KEY}`,
    FOCUSOUT: `focusout${EVENT_KEY}`,
    MOUSEENTER: `mouseenter${EVENT_KEY}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY}`,
};
const CLASS_NAME_FADE = "fade";
const CLASS_NAME_MODAL = "modal";
const CLASS_NAME_SHOW = "show";
const HOVER_STATE_SHOW = "show";
const HOVER_STATE_OUT = "out";
const SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const EVENT_MODAL_HIDE = "hide.te.modal";
const TRIGGER_HOVER = "hover";
const TRIGGER_FOCUS = "focus";
const TRIGGER_CLICK = "click";
const TRIGGER_MANUAL = "manual";
class Tooltip extends base_component_1.default {
    constructor(element, config) {
        if (typeof Popper === "undefined") {
            throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
        }
        super(element);
        this._isEnabled = true;
        this._timeout = 0;
        this._hoverState = "";
        this._activeTrigger = {};
        this._popper = null;
        this._config = this._getConfig(config);
        this.tip = null;
        this._setListeners();
    }
    static get Default() {
        return Default;
    }
    static get NAME() {
        return NAME;
    }
    static get Event() {
        return Event;
    }
    static get DefaultType() {
        return DefaultType;
    }
    enable() {
        this._isEnabled = true;
    }
    disable() {
        this._isEnabled = false;
    }
    toggleEnabled() {
        this._isEnabled = !this._isEnabled;
    }
    toggle(event) {
        if (!this._isEnabled) {
            return;
        }
        if (event) {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger.click = !context._activeTrigger.click;
            if (context._isWithActiveTrigger()) {
                context._enter(null, context);
            }
            else {
                context._leave(null, context);
            }
        }
        else {
            if (this.getTipElement().classList.contains(CLASS_NAME_SHOW)) {
                this._leave(null, this);
                return;
            }
            this._enter(null, this);
        }
    }
    dispose() {
        clearTimeout(this._timeout);
        event_handler_1.default.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
        if (this.tip) {
            this.tip.remove();
        }
        this._disposePopper();
        super.dispose();
    }
    show() {
        if (this._element.style.display === "none") {
            throw new Error("Please use show on visible elements");
        }
        if (!(this.isWithContent() && this._isEnabled)) {
            return;
        }
        const showEvent = event_handler_1.default.trigger(this._element, this.constructor.Event.SHOW);
        const shadowRoot = (0, index_1.findShadowRoot)(this._element);
        const isInTheDom = shadowRoot === null
            ? this._element.ownerDocument.documentElement.contains(this._element)
            : shadowRoot.contains(this._element);
        if (showEvent.defaultPrevented || !isInTheDom) {
            return;
        }
        if (this.constructor.NAME === "tooltip" &&
            this.tip &&
            this.getTitle() !==
                this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
            this._disposePopper();
            this.tip.remove();
            this.tip = null;
        }
        const tip = this.getTipElement();
        const tipId = (0, index_1.getUID)(this.constructor.NAME);
        tip.setAttribute("id", tipId);
        this._element.setAttribute("aria-describedby", tipId);
        if (this._config.animation) {
            setTimeout(() => {
                this.tip.classList.add("opacity-100");
                this.tip.classList.remove("opacity-0");
            }, 100);
        }
        const placement = typeof this._config.placement === "function"
            ? this._config.placement.call(this, tip, this._element)
            : this._config.placement;
        const attachment = this._getAttachment(placement);
        this._addAttachmentClass(attachment);
        const { container } = this._config;
        data_1.default.setData(tip, this.constructor.DATA_KEY, this);
        if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
            container.append(tip);
            event_handler_1.default.trigger(this._element, this.constructor.Event.INSERTED);
        }
        if (this._popper) {
            this._popper.update();
        }
        else {
            this._popper = Popper.createPopper(this._element, tip, this._getPopperConfig(attachment));
        }
        const notPopover = tip.getAttribute("id").includes("tooltip");
        if (notPopover) {
            switch (placement) {
                case "bottom":
                    tip.classList.add("py-[0.4rem]");
                    break;
                case "left":
                    tip.classList.add("px-[0.4rem]");
                    break;
                case "right":
                    tip.classList.add("px-[0.4rem]");
                    break;
                default:
                    tip.classList.add("py-[0.4rem]");
                    break;
            }
        }
        const customClass = this._resolvePossibleFunction(this._config.customClass);
        if (customClass) {
            tip.classList.add(...customClass.split(" "));
        }
        if ("ontouchstart" in document.documentElement) {
            [].concat(...document.body.children).forEach((element) => {
                event_handler_1.default.on(element, "mouseover", index_1.noop);
            });
        }
        const complete = () => {
            const prevHoverState = this._hoverState;
            this._hoverState = null;
            event_handler_1.default.trigger(this._element, this.constructor.Event.SHOWN);
            if (prevHoverState === HOVER_STATE_OUT) {
                this._leave(null, this);
            }
        };
        const isAnimated = this.tip.classList.contains("transition-opacity");
        this._queueCallback(complete, this.tip, isAnimated);
    }
    hide() {
        if (!this._popper) {
            return;
        }
        const tip = this.getTipElement();
        const complete = () => {
            if (this._isWithActiveTrigger()) {
                return;
            }
            if (this._hoverState !== HOVER_STATE_SHOW) {
                tip.remove();
            }
            this._cleanTipClass();
            this._element.removeAttribute("aria-describedby");
            event_handler_1.default.trigger(this._element, this.constructor.Event.HIDDEN);
            this._disposePopper();
        };
        const hideEvent = event_handler_1.default.trigger(this._element, this.constructor.Event.HIDE);
        if (hideEvent.defaultPrevented) {
            return;
        }
        tip.classList.add("opacity-0");
        tip.classList.remove("opacity-100");
        if ("ontouchstart" in document.documentElement) {
            []
                .concat(...document.body.children)
                .forEach((element) => event_handler_1.default.off(element, "mouseover", index_1.noop));
        }
        this._activeTrigger[TRIGGER_CLICK] = false;
        this._activeTrigger[TRIGGER_FOCUS] = false;
        this._activeTrigger[TRIGGER_HOVER] = false;
        const isAnimated = this.tip.classList.contains("opacity-0");
        this._queueCallback(complete, this.tip, isAnimated);
        this._hoverState = "";
    }
    update() {
        if (this._popper !== null) {
            this._popper.update();
        }
    }
    isWithContent() {
        return Boolean(this.getTitle());
    }
    getTipElement() {
        if (this.tip) {
            return this.tip;
        }
        const element = document.createElement("div");
        element.innerHTML = this._config.template;
        const tip = element.children[0];
        this.setContent(tip);
        tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);
        this.tip = tip;
        return this.tip;
    }
    setContent(tip) {
        this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
    }
    _sanitizeAndSetContent(template, content, selector) {
        const templateElement = selector_engine_1.default.findOne(selector, template);
        if (!content && templateElement) {
            templateElement.remove();
            return;
        }
        this.setElementContent(templateElement, content);
    }
    setElementContent(element, content) {
        if (element === null) {
            return;
        }
        if ((0, index_1.isElement)(content)) {
            content = (0, index_1.getElement)(content);
            if (this._config.html) {
                if (content.parentNode !== element) {
                    element.innerHTML = "";
                    element.append(content);
                }
            }
            else {
                element.textContent = content.textContent;
            }
            return;
        }
        if (this._config.html) {
            if (this._config.sanitize) {
                content = (0, sanitizer_1.sanitizeHtml)(content, this._config.allowList, this._config.sanitizeFn);
            }
            element.innerHTML = content;
        }
        else {
            element.textContent = content;
        }
    }
    getTitle() {
        const title = this._element.getAttribute("data-te-original-title") ||
            this._config.title;
        return this._resolvePossibleFunction(title);
    }
    updateAttachment(attachment) {
        if (attachment === "right") {
            return "end";
        }
        if (attachment === "left") {
            return "start";
        }
        return attachment;
    }
    _initializeOnDelegatedTarget(event, context) {
        return (context ||
            this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig()));
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
    _resolvePossibleFunction(content) {
        return typeof content === "function"
            ? content.call(this._element)
            : content;
    }
    _getPopperConfig(attachment) {
        const defaultBsPopperConfig = {
            placement: attachment,
            modifiers: [
                {
                    name: "flip",
                    options: {
                        fallbackPlacements: this._config.fallbackPlacements,
                    },
                },
                {
                    name: "offset",
                    options: {
                        offset: this._getOffset(),
                    },
                },
                {
                    name: "preventOverflow",
                    options: {
                        boundary: this._config.boundary,
                    },
                },
                {
                    name: "arrow",
                    options: {
                        element: `.${this.constructor.NAME}-arrow`,
                    },
                },
                {
                    name: "onChange",
                    enabled: true,
                    phase: "afterWrite",
                    fn: (data) => this._handlePopperPlacementChange(data),
                },
            ],
            onFirstUpdate: (data) => {
                if (data.options.placement !== data.placement) {
                    this._handlePopperPlacementChange(data);
                }
            },
        };
        return Object.assign(Object.assign({}, defaultBsPopperConfig), (typeof this._config.popperConfig === "function"
            ? this._config.popperConfig(defaultBsPopperConfig)
            : this._config.popperConfig));
    }
    _addAttachmentClass(attachment) {
        this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
    }
    _getAttachment(placement) {
        return AttachmentMap[placement.toUpperCase()];
    }
    _setListeners() {
        const triggers = this._config.trigger.split(" ");
        triggers.forEach((trigger) => {
            if (trigger === "click") {
                event_handler_1.default.on(this._element, this.constructor.Event.CLICK, this._config.selector, (event) => this.toggle(event));
            }
            else if (trigger !== TRIGGER_MANUAL) {
                const eventIn = trigger === TRIGGER_HOVER
                    ? this.constructor.Event.MOUSEENTER
                    : this.constructor.Event.FOCUSIN;
                const eventOut = trigger === TRIGGER_HOVER
                    ? this.constructor.Event.MOUSELEAVE
                    : this.constructor.Event.FOCUSOUT;
                event_handler_1.default.on(this._element, eventIn, this._config.selector, (event) => this._enter(event));
                event_handler_1.default.on(this._element, eventOut, this._config.selector, (event) => this._leave(event));
            }
        });
        this._hideModalHandler = () => {
            if (this._element) {
                this.hide();
            }
        };
        event_handler_1.default.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
        if (this._config.selector) {
            this._config = Object.assign(Object.assign({}, this._config), { trigger: "manual", selector: "" });
        }
        else {
            this._fixTitle();
        }
    }
    _fixTitle() {
        const title = this._element.getAttribute("title");
        const originalTitleType = typeof this._element.getAttribute("data-te-original-title");
        if (title || originalTitleType !== "string") {
            this._element.setAttribute("data-te-original-title", title || "");
            if (title &&
                !this._element.getAttribute("aria-label") &&
                !this._element.textContent) {
                this._element.setAttribute("aria-label", title);
            }
            this._element.setAttribute("title", "");
        }
    }
    _enter(event, context) {
        context = this._initializeOnDelegatedTarget(event, context);
        if (event) {
            context._activeTrigger[event.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
        }
        if (context.getTipElement().classList.contains(CLASS_NAME_SHOW) ||
            context._hoverState === HOVER_STATE_SHOW) {
            context._hoverState = HOVER_STATE_SHOW;
            return;
        }
        clearTimeout(context._timeout);
        context._hoverState = HOVER_STATE_SHOW;
        if (!context._config.delay || !context._config.delay.show) {
            context.show();
            return;
        }
        context._timeout = setTimeout(() => {
            if (context._hoverState === HOVER_STATE_SHOW) {
                context.show();
            }
        }, context._config.delay.show);
    }
    _leave(event, context) {
        context = this._initializeOnDelegatedTarget(event, context);
        if (event) {
            context._activeTrigger[event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
        }
        if (context._isWithActiveTrigger()) {
            return;
        }
        clearTimeout(context._timeout);
        context._hoverState = HOVER_STATE_OUT;
        if (!context._config.delay || !context._config.delay.hide) {
            context.hide();
            return;
        }
        context._timeout = setTimeout(() => {
            if (context._hoverState === HOVER_STATE_OUT) {
                context.hide();
            }
        }, context._config.delay.hide);
    }
    _isWithActiveTrigger() {
        for (const trigger in this._activeTrigger) {
            if (this._activeTrigger[trigger]) {
                return true;
            }
        }
        return false;
    }
    _getConfig(config) {
        const dataAttributes = manipulator_1.default.getDataAttributes(this._element);
        Object.keys(dataAttributes).forEach((dataAttr) => {
            if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
                delete dataAttributes[dataAttr];
            }
        });
        config = Object.assign(Object.assign(Object.assign({}, this.constructor.Default), dataAttributes), (typeof config === "object" && config ? config : {}));
        config.container =
            config.container === false ? document.body : (0, index_1.getElement)(config.container);
        if (typeof config.delay === "number") {
            config.delay = {
                show: config.delay,
                hide: config.delay,
            };
        }
        if (typeof config.title === "number") {
            config.title = config.title.toString();
        }
        if (typeof config.content === "number") {
            config.content = config.content.toString();
        }
        (0, index_1.typeCheckConfig)(NAME, config, this.constructor.DefaultType);
        if (config.sanitize) {
            config.template = (0, sanitizer_1.sanitizeHtml)(config.template, config.allowList, config.sanitizeFn);
        }
        return config;
    }
    _getDelegateConfig() {
        const config = {};
        for (const key in this._config) {
            if (this.constructor.Default[key] !== this._config[key]) {
                config[key] = this._config[key];
            }
        }
        return config;
    }
    _cleanTipClass() {
        const tip = this.getTipElement();
        const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, "g");
        const tabClass = tip.getAttribute("class").match(basicClassPrefixRegex);
        if (tabClass !== null && tabClass.length > 0) {
            tabClass
                .map((token) => token.trim())
                .forEach((tClass) => tip.classList.remove(tClass));
        }
    }
    _getBasicClassPrefix() {
        return CLASS_PREFIX;
    }
    _handlePopperPlacementChange(popperData) {
        const { state } = popperData;
        if (!state) {
            return;
        }
        this.tip = state.elements.popper;
        this._cleanTipClass();
        this._addAttachmentClass(this._getAttachment(state.placement));
    }
    _disposePopper() {
        if (this._popper) {
            this._popper.destroy();
            this._popper = null;
        }
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Tooltip.getOrCreateInstance(this, config);
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config]();
            }
        });
    }
}
exports.default = Tooltip;
//# sourceMappingURL=tooltip.js.map