"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../util/index");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const chip_1 = __importDefault(require("./chip"));
const data_1 = __importDefault(require("../../dom/data"));
const templates_1 = require("./templates");
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const keycodes_1 = require("../../util/keycodes");
const input_1 = __importDefault(require("../../forms/input"));
const NAME = "chips";
const ATTR_NAME = `data-te-${NAME}`;
const DATA_KEY = `te.${NAME}`;
const ATTR_CHIPS_INIT = `${ATTR_NAME}-input-init`;
const ATTR_CHIPS_ACTIVE = `${ATTR_NAME}-active`;
const ATTR_CHIPS_INITIAL = `${ATTR_NAME}-initial`;
const ATTR_CHIPS_PLACEHOLDER = `${ATTR_NAME}-placeholder`;
const ATTR_CHIPS_WRAPPER = `${ATTR_NAME}-input-wrapper`;
const ATTR_CHIP_INIT = "data-te-chip-init";
const ATTR_CHIP_CLOSE = "data-te-chip-close";
const ATTR_CHIP_TEXT = "data-te-chip-text";
const ATTR_SELECTOR_CHIPS_ACTIVE = `[${ATTR_CHIPS_ACTIVE}]`;
const ATTR_SELECTOR_CHIP_INIT = `[${ATTR_CHIP_INIT}]`;
const ATTR_SELECTOR_CHIP_ACTIVE = `${ATTR_SELECTOR_CHIP_INIT}${ATTR_SELECTOR_CHIPS_ACTIVE}`;
const ATTR_SELECTOR_CLOSE = `[${ATTR_CHIP_CLOSE}]`;
const ATTR_SELECTOR_CHIPS_WRAPPER = `[${ATTR_CHIPS_WRAPPER}]`;
const ATTR_SELECTOR_CHIP_TEXT = `[${ATTR_CHIP_TEXT}]`;
const ATTR_SELECTOR_CHIPS_PLACEHOLDER = `[${ATTR_CHIPS_PLACEHOLDER}]`;
const DATA_NOTCH_LEADING = "data-te-input-notch-leading-ref";
const DATA_NOTCH_MIDDLE = "data-te-input-notch-middle-ref";
const SELECTOR_NOTCH_LEADING = `[${DATA_NOTCH_LEADING}]`;
const SELECTOR_NOTCH_MIDDLE = `[${DATA_NOTCH_MIDDLE}]`;
const ATTR_INPUT_STATE_ACTIVE = "data-te-input-state-active";
const ATTR_SELECTOR_INPUT_NOTCH_REF = "[data-te-input-notch-ref]";
const EVENT_ADD = "add.te.chips";
const EVENT_ARROW_DOWN = "arrowDown.te.chips";
const EVENT_ARROW_LEFT = "arrowLeft.te.chips";
const EVENT_ARROW_RIGHT = "arrowRight.te.chips";
const EVENT_ARROW_UP = "arrowUp.te.chips";
const EVENT_DELETE = "delete.te.chips";
const EVENT_SELECT = "select.te.chips";
const DefaultType = {
    inputID: "string",
    parentSelector: "string",
    initialValues: "array",
    editable: "boolean",
    labelText: "string",
    inputClasses: "object",
    inputOptions: "object",
};
const Default = {
    inputID: (0, index_1.getUID)("chips-input-"),
    parentSelector: "",
    initialValues: [{ tag: "init1" }, { tag: "init2" }],
    editable: false,
    labelText: "Example label",
    inputClasses: {},
    inputOptions: {},
};
const DefaultClasses = {
    opacity: "opacity-0",
    inputWrapperPadding: "p-[5px]",
    transition: "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
    contentEditable: "outline-none !border-[3px] !border-solid !border-[#b2b3b4]",
    chipsInputWrapper: "relative flex items-center flex-wrap transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
    chipsInput: "peer block min-h-[auto] w-[150px] rounded border-0 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-gray-200 dark:placeholder:text-gray-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0",
    chipsLabel: "pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-gray-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-200 dark:peer-focus:text-gray-200",
};
const DefaultClassesType = {
    opacity: "string",
    inputWrapperPadding: "string",
    transition: "string",
    contentEditable: "string",
    chipsInputWrapper: "string",
    chipsInput: "string",
    chipsLabel: "string",
};
class ChipsInput extends chip_1.default {
    constructor(element, data = {}, classes) {
        super(element, data);
        this._handleBlurInput = ({ target }) => {
            if (target.value.length > 0) {
                this._handleCreateChip(target, target.value);
            }
            if (this.allChips.length > 0) {
                target.setAttribute(ATTR_CHIPS_ACTIVE, "");
                this.input.setAttribute(ATTR_INPUT_STATE_ACTIVE, "");
                selector_engine_1.default.findOne(ATTR_SELECTOR_INPUT_NOTCH_REF, this.input.parentNode).setAttribute(ATTR_INPUT_STATE_ACTIVE, "");
                this.chipsInputWrapper.classList.add(...this._classes.inputWrapperPadding.split(" "));
            }
            else {
                target.removeAttribute(ATTR_CHIPS_ACTIVE);
                this.input.removeAttribute(ATTR_INPUT_STATE_ACTIVE);
                selector_engine_1.default.findOne(ATTR_SELECTOR_INPUT_NOTCH_REF, this.input.parentNode).removeAttribute(ATTR_INPUT_STATE_ACTIVE);
                this.chipsInputWrapper.classList.remove(...this._classes.inputWrapperPadding.split(" "));
            }
            this.allChips.forEach((chip) => chip.removeAttribute(ATTR_CHIPS_ACTIVE));
        };
        this._element = element;
        this._inputInstance = null;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
        this._options = this._getConfig(data);
        this._classes = this._getClasses(classes);
        this.numberClicks = 0;
        this.init();
    }
    static get NAME() {
        return NAME;
    }
    get activeChip() {
        return selector_engine_1.default.findOne(ATTR_SELECTOR_CHIP_ACTIVE, this._element);
    }
    get input() {
        return selector_engine_1.default.findOne("input", this._element);
    }
    get allChips() {
        return selector_engine_1.default.find(ATTR_SELECTOR_CHIP_INIT, this._element);
    }
    get chipsInputWrapper() {
        return selector_engine_1.default.findOne(ATTR_SELECTOR_CHIPS_WRAPPER, this._element);
    }
    init() {
        this._setChipsClass();
        this._appendInputToElement(ATTR_CHIPS_PLACEHOLDER);
        this._handleInitialValue();
        this._handleInputText();
        this._handleKeyboard();
        this._handleChipsOnSelect();
        this._handleEditable();
        this._handleChipsFocus();
        this._handleClicksOnChips();
        this._inputInstance._getLabelWidth();
        this._inputInstance._applyNotch();
    }
    dispose() {
        this._element = null;
        this._options = null;
    }
    _getNotchData() {
        this._notchMiddle = selector_engine_1.default.findOne(SELECTOR_NOTCH_MIDDLE, this._element);
        this._notchLeading = selector_engine_1.default.findOne(SELECTOR_NOTCH_LEADING, this._element);
    }
    _setChipsClass() {
        this._element.setAttribute(ATTR_CHIPS_INIT, "");
    }
    _handleDeleteEvents(event) {
        const [last] = this.allChips.slice(-1);
        if (this.activeChip === null) {
            last.remove();
            this._handleEvents(event, EVENT_DELETE);
        }
        else {
            const index = this.allChips.findIndex((chip) => chip === this.activeChip);
            const activeChipAfter = this._handleActiveChipAfterRemove(index);
            const arr = [];
            if (this.activeChip === null)
                return;
            this.activeChip.remove();
            this._handleEvents(event, EVENT_DELETE);
            this.numberClicks = index;
            activeChipAfter.setAttribute(ATTR_CHIPS_ACTIVE, "");
            this.allChips.forEach((chip) => {
                if (chip.hasAttribute(ATTR_CHIPS_ACTIVE)) {
                    arr.push(chip);
                    if (arr.length > 1) {
                        this.allChips.forEach((chip) => chip.remove());
                    }
                }
            });
        }
    }
    _handleUpEvents(event) {
        this.numberClicks += 1;
        if (this.numberClicks === this.allChips.length + 1)
            this.numberClicks = 0;
        this._handleRightKeyboardArrow(this.numberClicks);
        this._handleEvents(event, EVENT_ARROW_RIGHT);
        this._handleEvents(event, EVENT_ARROW_UP);
    }
    _handleDownEvents(event) {
        this.numberClicks -= 1;
        if (this.numberClicks <= 0)
            this.numberClicks = this.allChips.length;
        this._handleLeftKeyboardArrow(this.numberClicks);
        this._handleEvents(event, EVENT_ARROW_LEFT);
        this._handleEvents(event, EVENT_ARROW_DOWN);
    }
    _keyboardEvents(event) {
        const { target, keyCode, ctrlKey } = event;
        if (target.value.length > 0 || this.allChips.length === 0)
            return;
        if (keyCode === keycodes_1.BACKSPACE || keyCode === keycodes_1.DELETE) {
            this._handleDeleteEvents(event);
        }
        else if (keyCode === keycodes_1.RIGHT_ARROW || keyCode === keycodes_1.UP_ARROW) {
            this._handleUpEvents(event);
        }
        else if (keyCode === keycodes_1.LEFT_ARROW || keyCode === keycodes_1.DOWN_ARROW) {
            this._handleDownEvents(event);
        }
        else if (keyCode === 65 && ctrlKey) {
            this._handleAddActiveClass();
        }
    }
    _handleKeyboard() {
        event_handler_1.default.on(this.input, "keydown", (event) => this._keyboardEvents(event));
    }
    _handleEditable() {
        const { editable } = this._options;
        if (!editable)
            return;
        this.allChips.forEach((chip) => {
            event_handler_1.default.on(chip, "dblclick", (e) => {
                const close = selector_engine_1.default.findOne(ATTR_SELECTOR_CLOSE, chip);
                chip.classList.add(...this._classes.contentEditable.split(" "));
                chip.contentEditable = true;
                chip.focus();
                setTimeout(() => {
                    manipulator_1.default.addStyle(close, { display: "none" });
                }, 200);
                close.classList.add(...this._classes.opacity.split(" "));
                const obj = {};
                obj.tag = e.target.textContent;
                event_handler_1.default.trigger(chip, EVENT_SELECT, {
                    event: e,
                    allChips: this.allChips,
                });
            });
            event_handler_1.default.on(document, "click", ({ target }) => {
                const close = selector_engine_1.default.findOne(ATTR_SELECTOR_CLOSE, chip);
                const chipText = selector_engine_1.default.findOne(ATTR_SELECTOR_CHIP_TEXT, chip);
                const isContainer = target === chip;
                const isContainerContent = chip && chip.contains(target);
                if (!isContainer && !isContainerContent) {
                    chip.contentEditable = false;
                    chip.classList.remove(...this._classes.contentEditable.split(" "));
                    if (chipText.textContent !== "") {
                        setTimeout(() => {
                            manipulator_1.default.addStyle(close, { display: "block" });
                            close.classList.remove(...this._classes.opacity.split(" "));
                        }, 160);
                    }
                }
                if (chipText.textContent === "") {
                    setTimeout(() => {
                        chip.classList.add(...this._classes.opacity.split(" "));
                    }, 200);
                    setTimeout(() => {
                        chip.remove();
                    }, 300);
                }
            });
        });
    }
    _handleRemoveActiveClass() {
        this.allChips.forEach((chip) => chip.removeAttribute(ATTR_CHIPS_ACTIVE));
    }
    _handleAddActiveClass() {
        this.allChips.forEach((chip) => chip.setAttribute(ATTR_CHIPS_ACTIVE, ""));
    }
    _handleRightKeyboardArrow(num) {
        this._handleRemoveActiveClass();
        if (num === 0)
            num = 1;
        this._handleAddActiveClassWithKebyboard(num);
    }
    _handleLeftKeyboardArrow(num) {
        this._handleRemoveActiveClass();
        this._handleAddActiveClassWithKebyboard(num);
    }
    _handleActiveChipAfterRemove(index) {
        const chipIndex = index === 0 ? 1 : index - 1;
        return this.allChips[chipIndex];
    }
    _handleClicksOnChips() {
        event_handler_1.default.on(this._element, "click", () => {
            if (this.allChips.length === 0) {
                this.chipsInputWrapper.classList.remove(...this._classes.inputWrapperPadding.split(" "));
                this.input.removeAttribute(ATTR_CHIPS_ACTIVE);
            }
        });
    }
    _handleTextContent() {
        const arr = [];
        this.allChips.forEach((chip) => arr.push({ tag: chip.textContent.trim() }));
        return arr;
    }
    _handleEvents(event, eventName) {
        const arr = this._handleTextContent();
        const filterActive = this.allChips.filter((chip) => chip.hasAttribute(ATTR_CHIPS_ACTIVE) && chip);
        event_handler_1.default.trigger(this._element, eventName, {
            event,
            allChips: this.allChips,
            arrOfObjects: arr,
            active: filterActive,
            activeObj: {
                tag: filterActive.length <= 0 ? "" : filterActive[0].textContent.trim(),
            },
        });
    }
    _handleChipsFocus() {
        event_handler_1.default.on(this._element, "click", ({ target: { attributes } }) => {
            const attrList = [...attributes].map((attr) => attr.name);
            if (attrList.includes(ATTR_CHIP_INIT) ||
                attrList.includes(ATTR_CHIP_CLOSE) ||
                attrList.includes(ATTR_CHIP_TEXT)) {
                return;
            }
            this.input.focus();
        });
    }
    _handleInitialValue() {
        this._appendInputToElement(ATTR_CHIPS_INITIAL);
        if (this._element.hasAttribute(ATTR_CHIPS_INITIAL)) {
            const { initialValues } = this._options;
            initialValues.forEach(({ tag }) => this._handleCreateChip(this.input, tag));
            selector_engine_1.default.findOne(ATTR_SELECTOR_INPUT_NOTCH_REF, this.input.parentNode).setAttribute(ATTR_INPUT_STATE_ACTIVE, "");
            this.input.setAttribute(ATTR_CHIPS_ACTIVE, "");
            this.input.setAttribute(ATTR_INPUT_STATE_ACTIVE, "");
        }
        if (this.allChips.length > 0) {
            this.chipsInputWrapper.classList.add(...this._classes.inputWrapperPadding.split(" "));
            this.chipsInputWrapper.classList.add(...this._classes.transition.split(" "));
        }
    }
    _handleKeysInputToElement(event) {
        const { keyCode, target } = event;
        if (target.hasAttribute(ATTR_CHIP_INIT)) {
            const close = selector_engine_1.default.findOne(ATTR_SELECTOR_CLOSE, target);
            if (keyCode === keycodes_1.ENTER) {
                target.contentEditable = false;
                target.classList.remove(...this._classes.contentEditable.split(" "));
                if (target.textContent !== "") {
                    setTimeout(() => {
                        manipulator_1.default.addStyle(close, { display: "block" });
                        close.classList.remove(...this._classes.opacity.split(" "));
                    }, 160);
                }
                else if (target.textContent === "") {
                    setTimeout(() => {
                        target.classList.add(...this._classes.opacity.split(" "));
                    }, 200);
                    setTimeout(() => {
                        target.remove();
                    }, 300);
                }
            }
            return;
        }
        if (keyCode === keycodes_1.ENTER) {
            if (target.value === "")
                return;
            this._handleCreateChip(target, target.value);
            this._handleRemoveActiveClass();
            this.numberClicks = this.allChips.length + 1;
            this._handleEvents(event, EVENT_ADD);
        }
        if (this.allChips.length > 0) {
            this.chipsInputWrapper.classList.add(...this._classes.inputWrapperPadding.split(" "));
            this.chipsInputWrapper.classList.add(...this._classes.transition.split(" "));
        }
        else {
            this.chipsInputWrapper.classList.remove(...this._classes.inputWrapperPadding.split(" "));
        }
    }
    _handleInputText() {
        const placeholder = selector_engine_1.default.findOne(ATTR_SELECTOR_CHIPS_PLACEHOLDER, this._element);
        event_handler_1.default.on(this._element, "keyup", placeholder, (e) => this._handleKeysInputToElement(e));
        event_handler_1.default.on(this.input, "blur", (e) => this._handleBlurInput(e));
    }
    _appendInputToElement(selector) {
        if (!this._element.hasAttribute(selector))
            return;
        const inputField = (0, templates_1.getInputField)(this._options, this._classes);
        this._element.insertAdjacentHTML("beforeend", inputField);
        const inputWrapper = selector_engine_1.default.findOne("[data-te-chips-input-wrapper]", this._element);
        this._inputInstance = new input_1.default(inputWrapper, this._options.inputOptions, this._options.inputClasses);
    }
    _handleCreateChip(target, value) {
        const divElement = (0, index_1.element)("div");
        const instance = chip_1.default.getInstance(divElement);
        const divWithChips = new chip_1.default(instance, { text: value }, this._classes);
        if (this._options.parentSelector !== "") {
            const parent = document.querySelector(this._options.parentSelector);
            parent.insertAdjacentHTML("beforeend", divWithChips.appendChip());
        }
        else {
            target.insertAdjacentHTML("beforebegin", divWithChips.appendChip());
        }
        target.value = "";
        selector_engine_1.default.find(ATTR_SELECTOR_CHIP_INIT).forEach((chip) => {
            let instance = chip_1.default.getInstance(chip);
            if (!instance) {
                instance = new chip_1.default(chip, {}, this._classes);
            }
            return instance.init();
        });
        this._handleEditable();
    }
    _handleChipsOnSelect() {
        this.allChips.forEach((chip) => {
            event_handler_1.default.on(this._element, "click", (e) => {
                event_handler_1.default.trigger(chip, EVENT_SELECT, {
                    event: e,
                    allChips: this.allChips,
                });
            });
        });
    }
    _handleAddActiveClassWithKebyboard(num) {
        let chip;
        if (this.allChips[num - 1] === undefined) {
            chip = this.allChips[num - 2];
        }
        else {
            chip = this.allChips[num - 1];
        }
        chip.setAttribute(ATTR_CHIPS_ACTIVE);
    }
    _getConfig(options) {
        const config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
exports.default = ChipsInput;
//# sourceMappingURL=index.js.map