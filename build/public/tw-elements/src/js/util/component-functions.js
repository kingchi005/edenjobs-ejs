"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableDismissTrigger = void 0;
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const index_1 = require("./index");
let addedEventsList = [];
const enableDismissTrigger = (component, method = "hide") => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    if (addedEventsList.includes(name)) {
        return;
    }
    addedEventsList.push(name);
    event_handler_1.default.on(document, clickEvent, `[data-te-${name}-dismiss]`, function (event) {
        if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
        }
        if ((0, index_1.isDisabled)(this)) {
            return;
        }
        const target = (0, index_1.getElementFromSelector)(this) ||
            this.closest(`.${name}`) ||
            this.closest(`[data-te-${name}-init]`);
        if (!target) {
            return;
        }
        const instance = component.getOrCreateInstance(target);
        instance[method]();
    });
};
exports.enableDismissTrigger = enableDismissTrigger;
//# sourceMappingURL=component-functions.js.map