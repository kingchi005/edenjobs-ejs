"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../util/index");
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const base_component_1 = __importDefault(require("../../base-component"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const input_1 = require("../../forms/input");
const rules_1 = require("./rules");
const data_1 = __importDefault(require("../../dom/data"));
const NAME = "validation";
const DATA_KEY = "te.validation";
const EVENT_KEY = `.${DATA_KEY}`;
const ATTR_VALIDATION_ELEMENTS = "data-te-validate";
const ATTR_VALIDATED = "data-te-validated";
const ATTR_VALIDATION_STATE = "data-te-validation-state";
const ATTR_VALIDATION_FEEDBACK = "data-te-validation-feedback";
const ATTR_VALID_FEEDBACK = "data-te-valid-feedback";
const ATTR_INVALID_FEEDBACK = "data-te-invalid-feedback";
const ATTR_VALIDATION_RULESET = "data-te-validation-ruleset";
const ATTR_SUBMIT_BTN = "data-te-submit-btn-ref";
const SELECTOR_VALIDATION_ELEMENTS = `[${ATTR_VALIDATION_ELEMENTS}]`;
const SELECTOR_INPUT_NOTCHES = "[data-te-input-notch-ref] div";
const SELECTOR_SUBMIT_BTN = `[${ATTR_SUBMIT_BTN}]`;
const EVENT_VALIDATED = `validated${EVENT_KEY}`;
const EVENT_VALIDATION_VALID = `valid${EVENT_KEY}`;
const EVENT_VALIDATION_INVALID = `invalid${EVENT_KEY}`;
const EVENT_VALIDATION_CHANGED = `changed${EVENT_KEY}`;
const DefaultType = {
    validFeedback: "string",
    invalidFeedback: "string",
    disableFeedback: "boolean",
    customRules: "object",
    customErrorMessages: "object",
    activeValidation: "boolean",
    submitCallback: "(function|null)",
};
const Default = {
    validFeedback: "Looks good!",
    invalidFeedback: "Something is wrong!",
    disableFeedback: false,
    customRules: {},
    customErrorMessages: {},
    activeValidation: false,
    submitCallback: null,
};
const DefaultClasses = {
    notchLeadingValid: "border-[#14a44d] dark:border-[#14a44d] group-data-[te-input-focused]:shadow-[-1px_0_0_#14a44d,_0_1px_0_0_#14a44d,_0_-1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
    notchMiddleValid: "border-[#14a44d] dark:border-[#14a44d] group-data-[te-input-focused]:shadow-[0_1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
    notchTrailingValid: "border-[#14a44d] dark:border-[#14a44d] group-data-[te-input-focused]:shadow-[1px_0_0_#14a44d,_0_-1px_0_0_#14a44d,_0_1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
    notchLeadingInvalid: "border-[#dc4c64] dark:border-[#dc4c64] group-data-[te-input-focused]:shadow-[-1px_0_0_#dc4c64,_0_1px_0_0_#dc4c64,_0_-1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
    notchMiddleInvalid: "border-[#dc4c64] dark:border-[#dc4c64] group-data-[te-input-focused]:shadow-[0_1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
    notchTrailingInvalid: "border-[#dc4c64] dark:border-[#dc4c64] group-data-[te-input-focused]:shadow-[1px_0_0_#dc4c64,_0_-1px_0_0_#dc4c64,_0_1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
    basicInputValid: "!border-[#14a44d] focus:!border-[#14a44d] focus:!shadow-[inset_0_0_0_1px_#14a44d]",
    basicInputInvalid: "!border-[#dc4c64] focus:!border-[#dc4c64] focus:!shadow-[inset_0_0_0_1px_#dc4c64]",
    checkboxValid: "checked:!border-[#14a44d] checked:!bg-[#14a44d] checked:after:!bg-[#14a44d]",
    checkboxInvalid: "checked:!border-[#dc4c64] checked:!bg-[#dc4c64] checked:after:!bg-[#dc4c64]",
    radioValid: "checked:!border-[#14a44d] checked:after:!bg-[#14a44d]",
    radioInvalid: "checked:!border-[#dc4c64] checked:after:!bg-[#dc4c64]",
    labelValid: "!text-[#14a44d]",
    labelInvalid: "!text-[#dc4c64]",
    validFeedback: "absolute top-full left-0 m-1 w-auto text-sm text-[#14a44d] animate-[fade-in_0.3s_both]",
    invalidFeedback: "absolute top-full left-0 m-1 w-auto text-sm text-[#dc4c64] animate-[fade-in_0.3s_both]",
    elementValidated: "mb-8",
};
const DefaultClassesType = {
    notchLeadingValid: "string",
    notchMiddleValid: "string",
    notchTrailingValid: "string",
    notchLeadingInvalid: "string",
    notchMiddleInvalid: "string",
    notchTrailingInvalid: "string",
    basicInputValid: "string",
    basicInputInvalid: "string",
    checkboxValid: "string",
    checkboxInvalid: "string",
    radioValid: "string",
    radioInvalid: "string",
    labelValid: "string",
    labelInvalid: "string",
    validFeedback: "string",
    invalidFeedback: "string",
    elementValidated: "string",
};
class Validation extends base_component_1.default {
    constructor(element, config, classes) {
        super(element);
        this._element = element;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
        this._config = this._getConfig(config);
        this._classes = this._getClasses(classes);
        this._isValid = true;
        this._shouldApplyInputEvents = true;
        this._submitCallback = null;
        this._errorMessages = Object.assign(Object.assign({}, rules_1.teDefaultMessages), this._config.customErrorMessages);
        this._validationElements = this._getValidationElements();
        this._validationElements.forEach(({ element, input }) => {
            this._createFeedbackWrapper(element, input);
        });
        this._validationObserver = this._watchForValidationChanges();
        this._validationObserver.observe(this._element, { attributes: true });
        this._submitButton = null;
        this._handleSubmitButton();
        this._validationResult = [];
    }
    static get DefaultType() {
        return DefaultType;
    }
    static get Default() {
        return Default;
    }
    static get NAME() {
        return NAME;
    }
    dispose() {
        var _a;
        (_a = this._validationObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        this._validationObserver = null;
        this._submitCallback = null;
        this._element.removeAttribute(ATTR_VALIDATED);
        this._removeInputEvents();
        this._removeValidationTraces();
        this._validationResult = [];
        if (this._submitButton) {
            event_handler_1.default.off(this._submitButton, "click");
        }
        if (this._config.activeValidation) {
            this._validationElements.forEach((singleElement) => {
                const { input } = singleElement;
                event_handler_1.default.off(input, "input");
            });
            this._shouldApplyInputEvents = true;
        }
    }
    _removeValidationTraces() {
        this._removeFeedbackWrapper();
        this._validationElements.forEach(({ element, classes, initialHTML }) => {
            element.className = classes;
            element.innerHTML = initialHTML;
            element.removeAttribute(ATTR_VALIDATION_STATE);
            element.removeAttribute(ATTR_INVALID_FEEDBACK);
            element.removeAttribute(ATTR_VALID_FEEDBACK);
        });
        this._validationElements = [];
    }
    _getValidationElements() {
        const elements = selector_engine_1.default.find(SELECTOR_VALIDATION_ELEMENTS, this._element);
        return elements.map((element) => {
            const input = selector_engine_1.default.findOne("input", element) ||
                selector_engine_1.default.findOne("textarea", element);
            const select = selector_engine_1.default.findOne("select", element);
            return {
                id: input.name || input.id || (select === null || select === void 0 ? void 0 : select.name) || (0, index_1.getUID)("validation-"),
                element,
                type: element.getAttribute(ATTR_VALIDATION_ELEMENTS),
                input,
                validFeedback: element.getAttribute(ATTR_VALID_FEEDBACK),
                invalidFeedback: element.getAttribute(ATTR_INVALID_FEEDBACK),
                classes: element.className,
                initialHTML: element.innerHTML,
                ruleset: element.getAttribute(ATTR_VALIDATION_RULESET),
            };
        });
    }
    _createFeedbackWrapper(element, input) {
        if (element.querySelectorAll(`[${ATTR_VALIDATION_FEEDBACK}]`).length > 0) {
            return;
        }
        const span = document.createElement("span");
        span.setAttribute(ATTR_VALIDATION_FEEDBACK, "");
        input.parentNode.appendChild(span);
    }
    _removeFeedbackWrapper() {
        const feedbackWrappers = selector_engine_1.default.find(`[${ATTR_VALIDATION_FEEDBACK}]`, this._element);
        feedbackWrappers.forEach((wrapper) => {
            wrapper.remove();
        });
    }
    _watchForValidationChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const { attributeName } = mutation;
                if (attributeName === ATTR_VALIDATED) {
                    this._handleValidation();
                    if (this._config.activeValidation && this._shouldApplyInputEvents) {
                        this._applyInputEvents();
                    }
                }
            });
        });
        return observer;
    }
    _handleValidation() {
        if (!this._element.getAttribute(ATTR_VALIDATED)) {
            return;
        }
        this._validationResult = [];
        this._isValid = true;
        this._validationElements.forEach((validationElement) => this._validateSingleElement(validationElement));
        this._emitEvents(this._isValid);
        if (this._submitCallback) {
            this._submitCallback(this._isValid);
        }
    }
    _validateSingleElement(validationElement) {
        var _a;
        const { element, type, input, ruleset, id } = validationElement;
        if (ruleset) {
            this._validateByRuleset(validationElement);
        }
        const validationResult = element.getAttribute(ATTR_VALIDATION_STATE);
        if (validationResult !== "valid" && validationResult !== "invalid") {
            return;
        }
        const capitalizedValidationResult = validationResult.replace(validationResult.charAt(0), validationResult.charAt(0).toUpperCase());
        if (type === "input") {
            this._restyleNotches(element, capitalizedValidationResult);
        }
        if (type === "basic") {
            this._restyleBasicInputs(input, capitalizedValidationResult);
        }
        if (type === "checkbox" || type === "radio") {
            this._restyleCheckboxes(input, capitalizedValidationResult, type);
        }
        this._restyleLabels(element, capitalizedValidationResult);
        if (validationResult === "invalid") {
            this._isValid = false;
        }
        if (!this._config.disableFeedback) {
            this._applyFeedback(element, validationResult);
        }
        event_handler_1.default.trigger(this._element, EVENT_VALIDATION_CHANGED, {
            value: {
                name: id,
                result: validationResult,
                validation: (_a = this._validationResult[id]) === null || _a === void 0 ? void 0 : _a.validation,
            },
        });
    }
    _validateByRuleset({ element, type, invalidFeedback, input, id }) {
        const ruleset = this._getRuleset(element);
        if (!ruleset.length) {
            return;
        }
        const result = type === "checkbox" || type === "radio" ? input.checked : input.value;
        let invalidMessage = "";
        let validation = [];
        for (const rule of ruleset) {
            const testResult = rule.callback(result, this._errorMessages[rule.name] || this._config.invalidFeedback, rule.parameter);
            validation.push({
                result: testResult === true,
                name: rule.name,
                fullName: rule.fullName,
            });
            if (typeof testResult === "string" && !invalidMessage) {
                invalidMessage = testResult;
            }
        }
        this._validationResult[id] = { element, validation };
        if (!invalidMessage) {
            element.setAttribute(ATTR_VALIDATION_STATE, `valid`);
            return;
        }
        element.setAttribute(ATTR_VALIDATION_STATE, `invalid`);
        if (!invalidFeedback) {
            element.setAttribute(ATTR_INVALID_FEEDBACK, invalidMessage);
        }
    }
    _handleInputChange(element) {
        this._validateSingleElement(element);
    }
    _getRuleset(element) {
        const ruleset = element.getAttribute(ATTR_VALIDATION_RULESET);
        const ruleArray = ruleset.split("|");
        let rulesToApply = [];
        const rulesList = Object.assign(Object.assign({}, rules_1.teRules), this._config.customRules);
        ruleArray.forEach((rule) => {
            const ruleData = this._getRuleData(rule, rulesList);
            if (ruleData.callback) {
                rulesToApply.push(ruleData);
            }
            else {
                console.warn(`Rule ${rule} does not exist`);
            }
        });
        return rulesToApply;
    }
    _getRuleData(rule, rulesList) {
        const split = rule.split("(");
        return {
            callback: rulesList[split[0]],
            parameter: split[1] ? split[1].split(")")[0] : null,
            name: split[0],
            fullName: rule,
        };
    }
    _applyFeedback(element, result) {
        const feedback = selector_engine_1.default.findOne(`[${ATTR_VALIDATION_FEEDBACK}]`, element);
        const valid = element.getAttribute(ATTR_VALID_FEEDBACK) || this._config.validFeedback;
        const invalid = element.getAttribute(ATTR_INVALID_FEEDBACK) ||
            this._config.invalidFeedback;
        manipulator_1.default.addClass(element, this._classes.elementValidated);
        feedback.textContent = result === "valid" ? valid : invalid;
        feedback.className =
            this._classes[result === "valid" ? "validFeedback" : "invalidFeedback"];
    }
    _restyleCheckboxes(checkbox, result, type) {
        manipulator_1.default.removeClass(checkbox, this._classes.checkboxValid);
        manipulator_1.default.removeClass(checkbox, this._classes.checkboxInvalid);
        manipulator_1.default.addClass(checkbox, this._classes[`${type}${result}`]);
    }
    _restyleBasicInputs(input, result) {
        manipulator_1.default.removeClass(input, this._classes.basicInputValid);
        manipulator_1.default.removeClass(input, this._classes.basicInputInvalid);
        manipulator_1.default.addClass(input, this._classes[`basicInput${result}`]);
    }
    _restyleNotches(element, result) {
        const notches = selector_engine_1.default.find(SELECTOR_INPUT_NOTCHES, element);
        notches.forEach((notch, id) => {
            let classes = id === 0 ? "notchLeading" : id === 1 ? "notchMiddle" : "notchTrailing";
            notch.className = "";
            manipulator_1.default.addClass(notch, input_1.DefaultClasses[classes]);
            classes += result;
            manipulator_1.default.addClass(notch, this._classes[classes]);
        });
    }
    _restyleLabels(element, result) {
        const labels = selector_engine_1.default.find("label", element);
        if (!labels.length) {
            return;
        }
        labels.forEach((label) => {
            manipulator_1.default.removeClass(label, this._classes.labelValid);
            manipulator_1.default.removeClass(label, this._classes.labelInvalid);
            manipulator_1.default.addClass(label, this._classes[`label${result}`]);
        });
    }
    _emitEvents(isValid) {
        event_handler_1.default.trigger(this._element, EVENT_VALIDATED);
        if (isValid) {
            event_handler_1.default.trigger(this._element, EVENT_VALIDATION_VALID, {
                value: this._validationResult,
            });
            return;
        }
        event_handler_1.default.trigger(this._element, EVENT_VALIDATION_INVALID, {
            value: this._validationResult,
        });
    }
    _applyInputEvents() {
        this._validationElements.forEach((singleElement) => {
            const { input, element } = singleElement;
            event_handler_1.default.on(input, "input", () => this._handleInputChange(singleElement));
            event_handler_1.default.on(element, "valueChange.te.select", () => this._delayedInputChange(singleElement));
            event_handler_1.default.on(element, "itemSelect.te.autocomplete", () => this._delayedInputChange(singleElement));
        });
        this._shouldApplyInputEvents = false;
    }
    _removeInputEvents() {
        this._validationElements.forEach((singleElement) => {
            const { input, element } = singleElement;
            event_handler_1.default.off(input, "input", () => this._handleInputChange(singleElement));
            event_handler_1.default.off(element, "valueChange.te.select", () => this._delayedInputChange(singleElement));
            event_handler_1.default.off(element, "itemSelect.te.autocomplete", () => this._delayedInputChange(singleElement));
        });
    }
    _delayedInputChange(element) {
        setTimeout(() => {
            this._handleInputChange(element);
        }, 10);
    }
    _handleSubmitButton() {
        this._submitButton = selector_engine_1.default.findOne(SELECTOR_SUBMIT_BTN, this._element);
        if (!this._submitButton) {
            return;
        }
        event_handler_1.default.on(this._submitButton, "click", (e) => this._handleSubmitButtonClick(e));
    }
    _handleSubmitButtonClick(e) {
        this._element.setAttribute(ATTR_VALIDATED, true);
        if (this._config.submitCallback) {
            this._submitCallback = (valid) => this._config.submitCallback(e, valid);
            return;
        }
    }
    _getConfig(config) {
        config = Object.assign(Object.assign(Object.assign({}, Default), manipulator_1.default.getDataAttributes(this._element)), (typeof config === "object" && config ? config : {}));
        (0, index_1.typeCheckConfig)(NAME, config, this.constructor.DefaultType);
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
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Validation.getOrCreateInstance(this);
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
exports.default = Validation;
//# sourceMappingURL=validation.js.map