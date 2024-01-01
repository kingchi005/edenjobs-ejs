"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const index_1 = require("./index");
class FocusTrap {
    constructor(element, options = {}, toggler) {
        this._element = element;
        this._toggler = toggler;
        this._event = options.event || "blur";
        this._condition = options.condition || (() => true);
        this._selector =
            options.selector ||
                'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this._onlyVisible = options.onlyVisible || false;
        this._focusableElements = [];
        this._firstElement = null;
        this._lastElement = null;
        this.handler = (e) => {
            if (this._condition(e) && !e.shiftKey && e.target === this._lastElement) {
                e.preventDefault();
                this._firstElement.focus();
            }
            else if (this._condition(e) &&
                e.shiftKey &&
                e.target === this._firstElement) {
                e.preventDefault();
                this._lastElement.focus();
            }
        };
    }
    trap() {
        this._setElements();
        this._init();
        this._setFocusTrap();
    }
    disable() {
        this._focusableElements.forEach((element) => {
            element.removeEventListener(this._event, this.handler);
        });
        if (this._toggler) {
            this._toggler.focus();
        }
    }
    update() {
        this._setElements();
        this._setFocusTrap();
    }
    _init() {
        const handler = (e) => {
            if (!this._firstElement ||
                e.key !== "Tab" ||
                this._focusableElements.includes(e.target)) {
                return;
            }
            e.preventDefault();
            this._firstElement.focus();
            window.removeEventListener("keydown", handler);
        };
        window.addEventListener("keydown", handler);
    }
    _filterVisible(elements) {
        return elements.filter((el) => {
            if (!(0, index_1.isVisible)(el))
                return false;
            const ancestors = selector_engine_1.default.parents(el, "*");
            for (let i = 0; i < ancestors.length; i++) {
                const style = window.getComputedStyle(ancestors[i]);
                if (style &&
                    (style.display === "none" || style.visibility === "hidden"))
                    return false;
            }
            return true;
        });
    }
    _setElements() {
        this._focusableElements = selector_engine_1.default.focusableChildren(this._element);
        if (this._onlyVisible) {
            this._focusableElements = this._filterVisible(this._focusableElements);
        }
        this._firstElement = this._focusableElements[0];
        this._lastElement =
            this._focusableElements[this._focusableElements.length - 1];
    }
    _setFocusTrap() {
        this._focusableElements.forEach((element, i) => {
            if (i === this._focusableElements.length - 1 || i === 0) {
                element.addEventListener(this._event, this.handler);
            }
            else {
                element.removeEventListener(this._event, this.handler);
            }
        });
    }
}
exports.default = FocusTrap;
//# sourceMappingURL=focusTrap.js.map