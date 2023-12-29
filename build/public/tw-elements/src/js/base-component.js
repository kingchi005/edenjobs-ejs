"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("./dom/data"));
const index_1 = require("./util/index");
const event_handler_1 = __importDefault(require("./dom/event-handler"));
const VERSION = "5.1.3";
class BaseComponent {
    constructor(element) {
        element = (0, index_1.getElement)(element);
        if (!element) {
            return;
        }
        this._element = element;
        data_1.default.setData(this._element, this.constructor.DATA_KEY, this);
    }
    dispose() {
        data_1.default.removeData(this._element, this.constructor.DATA_KEY);
        event_handler_1.default.off(this._element, this.constructor.EVENT_KEY);
        Object.getOwnPropertyNames(this).forEach((propertyName) => {
            this[propertyName] = null;
        });
    }
    _queueCallback(callback, element, isAnimated = true) {
        (0, index_1.executeAfterTransition)(callback, element, isAnimated);
    }
    static getInstance(element) {
        return data_1.default.getData((0, index_1.getElement)(element), this.DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
    static get VERSION() {
        return VERSION;
    }
    static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!');
    }
    static get DATA_KEY() {
        return `te.${this.NAME}`;
    }
    static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
    }
}
exports.default = BaseComponent;
//# sourceMappingURL=base-component.js.map