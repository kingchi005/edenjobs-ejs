"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const scrollbar_1 = __importDefault(require("../util/scrollbar"));
const base_component_1 = __importDefault(require("../base-component"));
const backdrop_1 = __importDefault(require("../util/backdrop"));
const focusTrap_1 = __importDefault(require("../util/focusTrap"));
const component_functions_1 = require("../util/component-functions");
const index_2 = require("../util/index");
const NAME = "modal";
const DATA_KEY = "te.modal";
const EVENT_KEY = `.${DATA_KEY}`;
const ESCAPE_KEY = "Escape";
const Default = {
    backdrop: true,
    keyboard: true,
    focus: true,
    modalNonInvasive: false,
};
const DefaultType = {
    backdrop: "(boolean|string)",
    keyboard: "boolean",
    focus: "boolean",
    modalNonInvasive: "boolean",
};
const DefaultClasses = {
    show: "transform-none",
    static: "scale-[1.02]",
    staticProperties: "transition-scale duration-300 ease-in-out",
    backdrop: "opacity-50 transition-all duration-300 ease-in-out fixed top-0 left-0 z-[1040] bg-black w-screen h-screen",
};
const DefaultClassesType = {
    show: "string",
    static: "string",
    staticProperties: "string",
    backdrop: "string",
};
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
const OPEN_SELECTOR_BODY = "data-te-modal-open";
const OPEN_SELECTOR = "data-te-open";
const SELECTOR_DIALOG = "[data-te-modal-dialog-ref]";
const SELECTOR_MODAL_BODY = "[data-te-modal-body-ref]";
class Modal extends base_component_1.default {
    constructor(element, config, classes) {
        super(element);
        this._config = this._getConfig(config);
        this._classes = this._getClasses(classes);
        this._dialog = selector_engine_1.default.findOne(SELECTOR_DIALOG, this._element);
        this._backdrop = this._config.modalNonInvasive
            ? null
            : this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._isShown = false;
        this._ignoreBackdropClick = false;
        this._isTransitioning = false;
        this._scrollBar = new scrollbar_1.default();
        this._didInit = false;
        this._init();
    }
    static get Default() {
        return Default;
    }
    static get NAME() {
        return NAME;
    }
    toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
        if (this._isShown || this._isTransitioning) {
            return;
        }
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW, {
            relatedTarget,
        });
        if (showEvent.defaultPrevented) {
            return;
        }
        this._isShown = true;
        if (this._isAnimated()) {
            this._isTransitioning = true;
        }
        !this._config.modalNonInvasive && this._scrollBar.hide();
        document.body.setAttribute(OPEN_SELECTOR_BODY, "true");
        this._adjustDialog();
        this._setEscapeEvent();
        this._setResizeEvent();
        event_handler_1.default.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
            event_handler_1.default.one(this._element, EVENT_MOUSEUP_DISMISS, (event) => {
                if (event.target === this._element) {
                    this._ignoreBackdropClick = true;
                }
            });
        });
        this._showElement(relatedTarget);
        !this._config.modalNonInvasive && this._showBackdrop();
    }
    hide() {
        if (!this._isShown || this._isTransitioning) {
            return;
        }
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE);
        if (hideEvent.defaultPrevented) {
            return;
        }
        this._isShown = false;
        const isAnimated = this._isAnimated();
        if (isAnimated) {
            this._isTransitioning = true;
        }
        this._setEscapeEvent();
        this._setResizeEvent();
        this._focustrap.disable();
        const modalDialog = selector_engine_1.default.findOne(SELECTOR_DIALOG, this._element);
        modalDialog.classList.remove(this._classes.show);
        event_handler_1.default.off(this._element, EVENT_CLICK_DISMISS);
        event_handler_1.default.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);
        this._queueCallback(() => this._hideModal(), this._element, isAnimated);
        this._element.removeAttribute(OPEN_SELECTOR);
    }
    dispose() {
        [window, document, this._dialog].forEach((htmlElement) => event_handler_1.default.off(htmlElement, EVENT_KEY));
        this._backdrop && this._backdrop.dispose();
        this._focustrap.disable();
        super.dispose();
    }
    handleUpdate() {
        this._adjustDialog();
    }
    _init() {
        if (this._didInit) {
            return;
        }
        (0, component_functions_1.enableDismissTrigger)(Modal);
        this._didInit = true;
    }
    _initializeBackDrop() {
        return new backdrop_1.default({
            isVisible: Boolean(this._config.backdrop),
            isAnimated: this._isAnimated(),
            backdropClasses: this._classes.backdrop,
        });
    }
    _initializeFocusTrap() {
        return new focusTrap_1.default(this._element, {
            event: "keydown",
            condition: (event) => event.key === "Tab",
        });
    }
    _getConfig(config) {
        config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), (typeof config === "object" ? config : {}));
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _showElement(relatedTarget) {
        const isAnimated = this._isAnimated();
        const modalBody = selector_engine_1.default.findOne(SELECTOR_MODAL_BODY, this._dialog);
        if (!this._element.parentNode ||
            this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
            document.body.append(this._element);
        }
        this._element.style.display = "block";
        this._element.classList.remove("hidden");
        this._element.removeAttribute("aria-hidden");
        this._element.setAttribute("aria-modal", true);
        this._element.setAttribute("role", "dialog");
        this._element.setAttribute(`${OPEN_SELECTOR}`, "true");
        this._element.scrollTop = 0;
        const modalDialog = selector_engine_1.default.findOne(SELECTOR_DIALOG, this._element);
        modalDialog.classList.add(this._classes.show);
        modalDialog.classList.remove("opacity-0");
        modalDialog.classList.add("opacity-100");
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        if (isAnimated) {
            (0, index_1.reflow)(this._element);
        }
        const transitionComplete = () => {
            if (this._config.focus) {
                this._focustrap.trap();
            }
            this._isTransitioning = false;
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, {
                relatedTarget,
            });
        };
        this._queueCallback(transitionComplete, this._dialog, isAnimated);
    }
    _setEscapeEvent() {
        if (this._isShown) {
            event_handler_1.default.on(document, EVENT_KEYDOWN_DISMISS, (event) => {
                if (this._config.keyboard && event.key === ESCAPE_KEY) {
                    event.preventDefault();
                    this.hide();
                }
                else if (!this._config.keyboard && event.key === ESCAPE_KEY) {
                    this._triggerBackdropTransition();
                }
            });
        }
        else {
            event_handler_1.default.off(this._element, EVENT_KEYDOWN_DISMISS);
        }
    }
    _setResizeEvent() {
        if (this._isShown) {
            event_handler_1.default.on(window, EVENT_RESIZE, () => this._adjustDialog());
        }
        else {
            event_handler_1.default.off(window, EVENT_RESIZE);
        }
    }
    _hideModal() {
        const modalDialog = selector_engine_1.default.findOne(SELECTOR_DIALOG, this._element);
        modalDialog.classList.remove(this._classes.show);
        modalDialog.classList.remove("opacity-100");
        modalDialog.classList.add("opacity-0");
        const transitionTime = (0, index_2.getTransitionDurationFromElement)(modalDialog);
        setTimeout(() => {
            this._element.style.display = "none";
        }, transitionTime);
        this._element.setAttribute("aria-hidden", true);
        this._element.removeAttribute("aria-modal");
        this._element.removeAttribute("role");
        this._isTransitioning = false;
        this._backdrop &&
            this._backdrop.hide(() => {
                document.body.removeAttribute(OPEN_SELECTOR_BODY);
                this._resetAdjustments();
                !this._config.modalNonInvasive && this._scrollBar.reset();
                event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
            });
    }
    _showBackdrop(callback) {
        event_handler_1.default.on(this._element, EVENT_CLICK_DISMISS, (event) => {
            if (this._ignoreBackdropClick) {
                this._ignoreBackdropClick = false;
                return;
            }
            if (event.target !== event.currentTarget) {
                return;
            }
            if (this._config.backdrop === true) {
                this.hide();
            }
            else if (this._config.backdrop === "static") {
                this._triggerBackdropTransition();
            }
        });
        this._backdrop && this._backdrop.show(callback);
    }
    _isAnimated() {
        const animate = selector_engine_1.default.findOne(SELECTOR_DIALOG, this._element);
        return !!animate;
    }
    _triggerBackdropTransition() {
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE_PREVENTED);
        if (hideEvent.defaultPrevented) {
            return;
        }
        const { classList, scrollHeight, style } = this._element;
        const isModalOverflowing = scrollHeight > document.documentElement.clientHeight;
        if ((!isModalOverflowing && style.overflowY === "hidden") ||
            classList.contains(this._classes.static)) {
            return;
        }
        if (!isModalOverflowing) {
            style.overflowY = "hidden";
        }
        classList.add(...this._classes.static.split(" "));
        classList.add(...this._classes.staticProperties.split(" "));
        const transisitionTime = (0, index_2.getTransitionDurationFromElement)(this._element);
        this._queueCallback(() => {
            classList.remove(this._classes.static);
            setTimeout(() => {
                classList.remove(...this._classes.staticProperties.split(" "));
            }, transisitionTime);
            if (!isModalOverflowing) {
                this._queueCallback(() => {
                    style.overflowY = "";
                }, this._dialog);
            }
        }, this._dialog);
        this._element.focus();
    }
    _adjustDialog() {
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
        const scrollbarWidth = this._scrollBar.getWidth();
        const isBodyOverflowing = scrollbarWidth > 0;
        if ((!isBodyOverflowing && isModalOverflowing && !(0, index_1.isRTL)()) ||
            (isBodyOverflowing && !isModalOverflowing && (0, index_1.isRTL)())) {
            this._element.style.paddingLeft = `${scrollbarWidth}px`;
        }
        if ((isBodyOverflowing && !isModalOverflowing && !(0, index_1.isRTL)()) ||
            (!isBodyOverflowing && isModalOverflowing && (0, index_1.isRTL)())) {
            this._element.style.paddingRight = `${scrollbarWidth}px`;
        }
    }
    _resetAdjustments() {
        this._element.style.paddingLeft = "";
        this._element.style.paddingRight = "";
    }
    static jQueryInterface(config, relatedTarget) {
        return this.each(function () {
            const data = Modal.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
                return;
            }
            if (typeof data[config] === "undefined") {
                throw new TypeError(`No method named "${config}"`);
            }
            data[config](relatedTarget);
        });
    }
}
exports.default = Modal;
//# sourceMappingURL=modal.js.map