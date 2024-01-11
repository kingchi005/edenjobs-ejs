"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_component_1 = __importDefault(require("../base-component"));
const NAME = "button";
const CLASS_NAME_ACTIVE = "active";
class Button extends base_component_1.default {
    static get NAME() {
        return NAME;
    }
    toggle() {
        this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE));
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Button.getOrCreateInstance(this);
            if (config === "toggle") {
                data[config]();
            }
        });
    }
}
exports.default = Button;
//# sourceMappingURL=button.js.map