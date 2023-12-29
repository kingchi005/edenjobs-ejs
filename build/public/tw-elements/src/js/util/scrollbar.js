"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const index_1 = require("./index");
const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
const SELECTOR_STICKY_CONTENT = ".sticky-top";
class ScrollBarHelper {
    constructor() {
        this._element = document.body;
    }
    getWidth() {
        const documentWidth = document.documentElement.clientWidth;
        return Math.abs(window.innerWidth - documentWidth);
    }
    hide() {
        const width = this.getWidth();
        this._disableOverFlow();
        this._setElementAttributes(this._element, "paddingRight", (calculatedValue) => calculatedValue + width);
        this._setElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight", (calculatedValue) => calculatedValue + width);
        this._setElementAttributes(SELECTOR_STICKY_CONTENT, "marginRight", (calculatedValue) => calculatedValue - width);
    }
    _disableOverFlow() {
        this._saveInitialAttribute(this._element, "overflow");
        this._element.style.overflow = "hidden";
    }
    _setElementAttributes(selector, styleProp, callback) {
        const scrollbarWidth = this.getWidth();
        const manipulationCallBack = (element) => {
            if (element !== this._element &&
                window.innerWidth > element.clientWidth + scrollbarWidth) {
                return;
            }
            this._saveInitialAttribute(element, styleProp);
            const calculatedValue = window.getComputedStyle(element)[styleProp];
            element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
        };
        this._applyManipulationCallback(selector, manipulationCallBack);
    }
    reset() {
        this._resetElementAttributes(this._element, "overflow");
        this._resetElementAttributes(this._element, "paddingRight");
        this._resetElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight");
        this._resetElementAttributes(SELECTOR_STICKY_CONTENT, "marginRight");
    }
    _saveInitialAttribute(element, styleProp) {
        const actualValue = element.style[styleProp];
        if (actualValue) {
            manipulator_1.default.setDataAttribute(element, styleProp, actualValue);
        }
    }
    _resetElementAttributes(selector, styleProp) {
        const manipulationCallBack = (element) => {
            const value = manipulator_1.default.getDataAttribute(element, styleProp);
            if (typeof value === "undefined") {
                element.style.removeProperty(styleProp);
            }
            else {
                manipulator_1.default.removeDataAttribute(element, styleProp);
                element.style[styleProp] = value;
            }
        };
        this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _applyManipulationCallback(selector, callBack) {
        if ((0, index_1.isElement)(selector)) {
            callBack(selector);
        }
        else {
            selector_engine_1.default.find(selector, this._element).forEach(callBack);
        }
    }
    isOverflowing() {
        return this.getWidth() > 0;
    }
}
exports.default = ScrollBarHelper;
//# sourceMappingURL=scrollbar.js.map