"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const index_1 = require("./index");
const Default = {
    isVisible: true,
    isAnimated: false,
    rootElement: "body",
    clickCallback: null,
    backdropClasses: null,
};
const DefaultType = {
    isVisible: "boolean",
    isAnimated: "boolean",
    rootElement: "(element|string)",
    clickCallback: "(function|null)",
    backdropClasses: "(array|string|null)",
};
const NAME = "backdrop";
const EVENT_MOUSEDOWN = `mousedown.te.${NAME}`;
class Backdrop {
    constructor(config) {
        this._config = this._getConfig(config);
        this._isAppended = false;
        this._element = null;
    }
    show(callback) {
        if (!this._config.isVisible) {
            (0, index_1.execute)(callback);
            return;
        }
        this._append();
        if (this._config.isAnimated) {
            (0, index_1.reflow)(this._getElement());
        }
        const backdropClasses = this._config.backdropClasses || [
            "opacity-50",
            "transition-all",
            "duration-300",
            "ease-in-out",
            "fixed",
            "top-0",
            "left-0",
            "z-[1040]",
            "bg-black",
            "w-screen",
            "h-screen",
        ];
        manipulator_1.default.removeClass(this._getElement(), "opacity-0");
        manipulator_1.default.addClass(this._getElement(), backdropClasses);
        this._element.setAttribute("data-te-backdrop-show", "");
        this._emulateAnimation(() => {
            (0, index_1.execute)(callback);
        });
    }
    hide(callback) {
        if (!this._config.isVisible) {
            (0, index_1.execute)(callback);
            return;
        }
        this._element.removeAttribute("data-te-backdrop-show");
        this._getElement().classList.add("opacity-0");
        this._getElement().classList.remove("opacity-50");
        this._emulateAnimation(() => {
            this.dispose();
            (0, index_1.execute)(callback);
        });
    }
    _getElement() {
        if (!this._element) {
            const backdrop = document.createElement("div");
            backdrop.className = this._config.className;
            if (this._config.isAnimated) {
                backdrop.classList.add("opacity-50");
            }
            this._element = backdrop;
        }
        return this._element;
    }
    _getConfig(config) {
        config = Object.assign(Object.assign({}, Default), (typeof config === "object" ? config : {}));
        config.rootElement = (0, index_1.getElement)(config.rootElement);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _append() {
        if (this._isAppended) {
            return;
        }
        this._config.rootElement.append(this._getElement());
        event_handler_1.default.on(this._getElement(), EVENT_MOUSEDOWN, () => {
            (0, index_1.execute)(this._config.clickCallback);
        });
        this._isAppended = true;
    }
    dispose() {
        if (!this._isAppended) {
            return;
        }
        event_handler_1.default.off(this._element, EVENT_MOUSEDOWN);
        this._element.remove();
        this._isAppended = false;
    }
    _emulateAnimation(callback) {
        (0, index_1.executeAfterTransition)(callback, this._getElement(), this._config.isAnimated);
    }
}
exports.default = Backdrop;
//# sourceMappingURL=backdrop.js.map