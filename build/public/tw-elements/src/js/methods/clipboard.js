"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const NAME = "clipboard";
const DATA_KEY = "te.clipboard";
const EVENT_KEY = `.${DATA_KEY}`;
const DEFAULT_OPTIONS = {
    clipboardTarget: null,
};
const OPTIONS_TYPE = {
    clipboardTarget: "null|string",
};
const EVENT_COPY = `copy${EVENT_KEY}`;
class Clipboard {
    constructor(element, options = {}) {
        this._element = element;
        this._options = options;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this._initCopy = this._initCopy.bind(this);
            this._setup();
        }
    }
    static get NAME() {
        return NAME;
    }
    get options() {
        const config = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), manipulator_1.default.getDataAttributes(this._element)), this._options);
        (0, index_1.typeCheckConfig)(NAME, config, OPTIONS_TYPE);
        return config;
    }
    get clipboardTarget() {
        return selector_engine_1.default.findOne(this.options.clipboardTarget);
    }
    get copyText() {
        const clipboardTextExist = this.clipboardTarget.hasAttribute("data-te-clipboard-text");
        const inputValue = this.clipboardTarget.value;
        const targetText = this.clipboardTarget.textContent;
        if (clipboardTextExist) {
            return this.clipboardTarget.getAttribute("data-te-clipboard-text");
        }
        if (inputValue) {
            return inputValue;
        }
        return targetText;
    }
    dispose() {
        event_handler_1.default.off(this._element, "click", this._initCopy);
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    _setup() {
        event_handler_1.default.on(this._element, "click", this._initCopy);
    }
    _initCopy() {
        const inputToCopy = this._createNewInput();
        document.body.appendChild(inputToCopy);
        this._selectInput(inputToCopy);
        event_handler_1.default.trigger(this._element, EVENT_COPY, {
            copyText: this.copyText,
        });
        inputToCopy.remove();
    }
    _createNewInput() {
        const tag = this.clipboardTarget.tagName === "TEXTAREA" ? "textarea" : "input";
        const newInput = (0, index_1.element)(tag);
        newInput.value = this.copyText;
        manipulator_1.default.addClass(newInput, `-left-[9999px] absolute`);
        return newInput;
    }
    _selectInput(input) {
        input.select();
        input.focus();
        input.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data) {
                data = new Clipboard(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](this);
            }
        });
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
exports.default = Clipboard;
//# sourceMappingURL=clipboard.js.map