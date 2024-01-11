"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lightboxCallback = exports.popoverCallback = exports.tooltipsCallback = exports.collapseCallback = exports.rippleCallback = exports.modalCallback = exports.buttonCallback = exports.offcanvasCallback = exports.tabCallback = exports.dropdownCallback = void 0;
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const util_1 = require("../util");
const dropdownCallback = (component, initSelector) => {
    event_handler_1.default.on(document, `click.te.${component.NAME}`, initSelector, function (event) {
        event.preventDefault();
        component.getOrCreateInstance(this).toggle();
    });
};
exports.dropdownCallback = dropdownCallback;
const tabCallback = (component, initSelector) => {
    event_handler_1.default.on(document, `click.te.${component.NAME}.data-api`, initSelector, function (event) {
        if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
        }
        if ((0, util_1.isDisabled)(this)) {
            return;
        }
        const data = component.getOrCreateInstance(this);
        data.show();
    });
};
exports.tabCallback = tabCallback;
const offcanvasCallback = (component, initSelector) => {
    event_handler_1.default.on(document, `click.te.${component.NAME}.data-api`, initSelector, function (event) {
        const target = (0, util_1.getElementFromSelector)(this);
        if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
        }
        if ((0, util_1.isDisabled)(this)) {
            return;
        }
        event_handler_1.default.one(target, component.EVENT_HIDDEN, () => {
            if ((0, util_1.isVisible)(this)) {
                this.focus();
            }
        });
        const allReadyOpen = selector_engine_1.default.findOne(component.OPEN_SELECTOR);
        if (allReadyOpen && allReadyOpen !== target) {
            component.getInstance(allReadyOpen).hide();
        }
        const data = component.getOrCreateInstance(target);
        data.toggle(this);
    });
};
exports.offcanvasCallback = offcanvasCallback;
const buttonCallback = (component, initSelector) => {
    event_handler_1.default.on(document, `click.te.${component.NAME}`, initSelector, (event) => {
        event.preventDefault();
        const button = event.target.closest(initSelector);
        const data = component.getOrCreateInstance(button);
        data.toggle();
    });
};
exports.buttonCallback = buttonCallback;
const modalCallback = (component, initSelector) => {
    event_handler_1.default.on(document, `click.te.${component.NAME}`, initSelector, function (event) {
        const target = (0, util_1.getElementFromSelector)(this);
        if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
        }
        event_handler_1.default.one(target, component.EVENT_SHOW, (showEvent) => {
            if (showEvent.defaultPrevented) {
                return;
            }
            event_handler_1.default.one(target, component.EVENT_HIDDEN, () => {
                if ((0, util_1.isVisible)(this)) {
                    this.focus();
                }
            });
        });
        const allReadyOpen = selector_engine_1.default.findOne(`[${component.OPEN_SELECTOR}="true"]`);
        if (allReadyOpen) {
            component.getInstance(allReadyOpen).hide();
        }
        const data = component.getOrCreateInstance(target);
        data.toggle(this);
    });
};
exports.modalCallback = modalCallback;
const rippleCallback = (component, initSelector) => {
    event_handler_1.default.one(document, "mousedown", initSelector, component.autoInitial(new component()));
};
exports.rippleCallback = rippleCallback;
const collapseCallback = (component, initSelector) => {
    event_handler_1.default.on(document, `click.te.${component.NAME}.data-api`, initSelector, function (event) {
        if (event.target.tagName === "A" ||
            (event.delegateTarget && event.delegateTarget.tagName === "A")) {
            event.preventDefault();
        }
        const selector = (0, util_1.getSelectorFromElement)(this);
        const selectorElements = selector_engine_1.default.find(selector);
        selectorElements.forEach((element) => {
            component.getOrCreateInstance(element, { toggle: false }).toggle();
        });
    });
};
exports.collapseCallback = collapseCallback;
const tooltipsCallback = (component, initSelector) => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll(initSelector));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new component(tooltipTriggerEl);
    });
};
exports.tooltipsCallback = tooltipsCallback;
const popoverCallback = (component, initSelector) => {
    const popoverTriggerList = [].slice.call(document.querySelectorAll(initSelector));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new component(popoverTriggerEl);
    });
};
exports.popoverCallback = popoverCallback;
const lightboxCallback = (component, initSelector) => {
    selector_engine_1.default.find(initSelector).forEach((element) => {
        new component(element);
    });
    event_handler_1.default.on(document, `click.te.${component.NAME}.data-api`, `${initSelector} img:not([data-te-lightbox-disabled])`, component.toggle());
};
exports.lightboxCallback = lightboxCallback;
//# sourceMappingURL=autoinitCallbacks.js.map