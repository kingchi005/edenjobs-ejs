"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const scrollbar_1 = __importDefault(require("../util/scrollbar"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const base_component_1 = __importDefault(require("../base-component"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const backdrop_1 = __importDefault(require("../util/backdrop"));
const focusTrap_1 = __importDefault(require("../util/focusTrap"));
const component_functions_1 = require("../util/component-functions");
const NAME = "offcanvas";
const DATA_KEY = "te.offcanvas";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const ESCAPE_KEY = "Escape";
const Default = {
    backdrop: true,
    keyboard: true,
    scroll: false,
};
const DefaultType = {
    backdrop: "boolean",
    keyboard: "boolean",
    scroll: "boolean",
};
const CLASS_NAME_SHOW = "show";
const OPEN_SELECTOR = "[data-te-offcanvas-init][data-te-offcanvas-show]";
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
class Offcanvas extends base_component_1.default {
    constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._isShown = false;
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._addEventListeners();
        this._didInit = false;
        this._init();
    }
    static get NAME() {
        return NAME;
    }
    static get Default() {
        return Default;
    }
    toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
        if (this._isShown) {
            return;
        }
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW, {
            relatedTarget,
        });
        if (showEvent.defaultPrevented) {
            return;
        }
        this._isShown = true;
        this._element.style.visibility = "visible";
        this._backdrop.show();
        if (!this._config.scroll) {
            new scrollbar_1.default().hide();
        }
        this._element.removeAttribute("aria-hidden");
        this._element.setAttribute("aria-modal", true);
        this._element.setAttribute("role", "dialog");
        this._element.setAttribute(`data-te-offcanvas-${CLASS_NAME_SHOW}`, "");
        const completeCallBack = () => {
            if (!this._config.scroll) {
                this._focustrap.trap();
            }
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, { relatedTarget });
        };
        this._queueCallback(completeCallBack, this._element, true);
    }
    hide() {
        if (!this._isShown) {
            return;
        }
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE);
        if (hideEvent.defaultPrevented) {
            return;
        }
        this._focustrap.disable();
        this._element.blur();
        this._isShown = false;
        this._element.removeAttribute(`data-te-offcanvas-${CLASS_NAME_SHOW}`);
        this._backdrop.hide();
        const completeCallback = () => {
            this._element.setAttribute("aria-hidden", true);
            this._element.removeAttribute("aria-modal");
            this._element.removeAttribute("role");
            this._element.style.visibility = "hidden";
            if (!this._config.scroll) {
                new scrollbar_1.default().reset();
            }
            event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
        };
        this._queueCallback(completeCallback, this._element, true);
    }
    dispose() {
        this._backdrop.dispose();
        this._focustrap.disable();
        super.dispose();
    }
    _init() {
        if (this._didInit) {
            return;
        }
        event_handler_1.default.on(window, EVENT_LOAD_DATA_API, () => selector_engine_1.default.find(OPEN_SELECTOR).forEach((el) => Offcanvas.getOrCreateInstance(el).show()));
        this._didInit = true;
        (0, component_functions_1.enableDismissTrigger)(Offcanvas);
    }
    _getConfig(config) {
        config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), (typeof config === "object" ? config : {}));
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _initializeBackDrop() {
        return new backdrop_1.default({
            isVisible: this._config.backdrop,
            isAnimated: true,
            rootElement: this._element.parentNode,
            clickCallback: () => this.hide(),
        });
    }
    _initializeFocusTrap() {
        return new focusTrap_1.default(this._element, {
            event: "keydown",
            condition: (event) => event.key === "Tab",
        });
    }
    _addEventListeners() {
        event_handler_1.default.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
            if (this._config.keyboard && event.key === ESCAPE_KEY) {
                this.hide();
            }
        });
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Offcanvas.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
                return;
            }
            if (data[config] === undefined ||
                config.startsWith("_") ||
                config === "constructor") {
                throw new TypeError(`No method named "${config}"`);
            }
            data[config](this);
        });
    }
}
exports.default = Offcanvas;
//# sourceMappingURL=offcanvas.js.map