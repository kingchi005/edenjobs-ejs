"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../util/index");
const event_handler_1 = __importStar(require("../../dom/event-handler"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const data_1 = __importDefault(require("../../dom/data"));
const template_1 = require("./template");
const utils_1 = require("./utils");
const base_component_1 = __importDefault(require("../../base-component"));
const NAME = "multiRangeSlider";
const DATA_KEY = `te.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_VALUE_CHANGED = `valueChanged${EVENT_KEY}`;
const ATTR_STATE_ACTIVE = "data-te-active";
const ATTR_HAND_REF = "data-te-multi-range-slider-hand-ref";
const ATTR_CONNECT_REF = "data-te-multi-range-slider-connect-ref";
const ATTR_TOOLTIP_REF = "data-te-multi-range-slider-tooltip-ref";
const DefaultType = {
    max: "number",
    min: "number",
    numberOfRanges: "number",
    startValues: "(array|string)",
    step: "(string|null|number)",
    tooltip: "boolean",
};
const Default = {
    max: 100,
    min: 0,
    numberOfRanges: 2,
    startValues: [0, 100],
    step: null,
    tooltip: false,
};
const DefaultClasses = {
    connect: "z-10 h-full w-full bg-[#eee] will-change-transform dark:bg-[#4f4f4f]",
    connectContainer: "relative border-[1px] border-[#eee] z-0 h-full w-full overflow-hidden dark:border-[#4f4f4f]",
    container: "apperance-none relative m-auto w-full cursor-pointer h-1 border-0 bg-transparent p-0 focus:outline-none dark:border-[#4f4f4f]",
    hand: "apperance-none absolute top-[50%] border-0 -mt-1 h-4 w-4 cursor-pointer rounded-[50%] border-0 bg-primary transition-colors ease-in-out will-change-transform active:bg-[#c4d4ef] active:z-60",
    tooltip: "absolute -top-[18px] origin-[50%_50%] -translate-x-[6px] -rotate-45 scale-0 rounded-bl-none rounded-br-2xl rounded-tl-2xl rounded-tr-2xl bg-primary text-white transition-all duration-[200ms] data-[te-active]:-top-[38px] data-[te-active]:scale-100",
    tooltipValue: "block h-[30px] w-[30px] -translate-x-[6px] translate-y-[6px] rotate-45 text-center text-[10px]",
};
const DefaultClassesType = {
    container: "string",
    connectContainer: "string",
    connect: "string",
    hand: "string",
    tooltip: "string",
    tooltipValue: "string",
};
class MultiRangeSlider extends base_component_1.default {
    constructor(element, options, classes) {
        super(element);
        this._options = this._getConfig(options);
        this._mousemove = false;
        this._classes = this._getClasses(classes);
        this._maxTranslation = null;
        this._minTranslation = null;
        this._currentStepValue = null;
        this._canChangeStep = false;
        this.init();
    }
    static get NAME() {
        return NAME;
    }
    get hands() {
        return selector_engine_1.default.find(`[${ATTR_HAND_REF}]`, this._element);
    }
    get connect() {
        return selector_engine_1.default.findOne(`[${ATTR_CONNECT_REF}]`, this._element);
    }
    get leftConnectRect() {
        return this.connect.getBoundingClientRect().left;
    }
    get handActive() {
        return selector_engine_1.default.findOne(`[${ATTR_STATE_ACTIVE}]`);
    }
    get activeTooltipValue() {
        const handTooltips = selector_engine_1.default.find(`[${ATTR_TOOLTIP_REF}]`);
        const handTooltipActive = handTooltips.filter((hand) => hand.hasAttribute(ATTR_STATE_ACTIVE));
        const tooltip = handTooltipActive[0].children[0];
        return tooltip;
    }
    init() {
        this._setContainerClasses();
        this._setRangeConnectsElement();
        this._setRangeHandleElements();
        this._setMaxAndMinTranslation();
        this._setTransofrmationOnStart();
        this._handleClickEventOnHand();
        this._handleEndMoveEventDocument();
        this._handleClickOnRange();
        this._setTooltipToHand();
    }
    dispose() {
        data_1.default.removeData(this._element, DATA_KEY);
        this._options = null;
        this._mousemove = null;
        this._maxTranslation = null;
        this._minTranslation = null;
        this._currentStepValue = null;
        this._canChangeStep = null;
        this.hands.forEach((hand) => {
            event_handler_1.EventHandlerMulti.off(hand, "mousedown touchstart");
            event_handler_1.EventHandlerMulti.off(hand, "mouseup touchend");
        });
        event_handler_1.EventHandlerMulti.off(document, "mousemove touchmove");
        event_handler_1.EventHandlerMulti.off(document, "mouseup touchend");
        event_handler_1.EventHandlerMulti.off(this.connect, "mousedown touchstart");
    }
    _setMaxAndMinTranslation() {
        this._maxTranslation =
            this.connect.offsetWidth - this.hands[0].offsetWidth / 2;
        this._minTranslation =
            this.connect.offsetLeft - this.hands[0].offsetWidth / 2;
    }
    _setTransofrmationOnStart() {
        const { max, min } = this._options;
        let { startValues } = this._options;
        if (typeof startValues === "string") {
            startValues = JSON.parse(startValues.replace(/'/g, '"'));
        }
        if (startValues.length === 0) {
            this.hands.forEach((hand) => {
                manipulator_1.default.setDataAttribute(hand, "translation", Math.round(this._minTranslation));
                manipulator_1.default.addStyle(hand, {
                    transform: `translate(${this._minTranslation}px,-25%)`,
                });
            });
        }
        else {
            this.hands.forEach((hand, i) => {
                if (startValues[i] > max || startValues[i] < min) {
                    return;
                }
                if (startValues[i] === undefined) {
                    manipulator_1.default.setDataAttribute(hand, "translation", Math.round(this._maxTranslation));
                    manipulator_1.default.addStyle(hand, {
                        transform: `translate(${this._maxTranslation}px,-25%)`,
                        zIndex: this.hands.length - i,
                    });
                    return;
                }
                const normalizedValue = (startValues[i] - min) / (max - min);
                const translation = normalizedValue * this.connect.offsetWidth - hand.offsetWidth / 2;
                manipulator_1.default.setDataAttribute(hand, "translation", Math.round(translation));
                manipulator_1.default.addStyle(hand, {
                    transform: `translate(${translation}px,-25%)`,
                    zIndex: this.hands.length - i,
                });
            });
        }
    }
    _handleOutOfMaxRangeValue(hand, max) {
        this._updateHand(hand, this._maxTranslation);
        if (this._options.tooltip) {
            this.activeTooltipValue.innerText = max;
        }
    }
    _handleOutOfMinRangeValue(hand, min) {
        this._updateHand(hand, this._minTranslation);
        if (this._options.tooltip) {
            this.activeTooltipValue.innerText = min;
        }
    }
    _handleNormalMove(hand, translation, value) {
        this._updateHand(hand, translation);
        if (this._options.tooltip) {
            this.activeTooltipValue.innerText = Math.round(value);
        }
    }
    _handleClickEventOnHand() {
        const { max, min, step } = this._options;
        this.hands.forEach((hand) => {
            event_handler_1.EventHandlerMulti.on(hand, "mousedown touchstart", (ev) => {
                this._mousemove = true;
                hand.setAttribute(ATTR_STATE_ACTIVE, "");
                if (this._options.tooltip) {
                    hand.children[1].setAttribute(ATTR_STATE_ACTIVE, "");
                }
                this._handleMoveEvent(hand);
                this._handleEndMoveEvent(hand, ev);
                if (!this._canChangeStep && step !== null) {
                    return;
                }
                const translation = (0, utils_1.getEventTypeClientX)(ev) - this.leftConnectRect - hand.offsetWidth / 2;
                const value = (((0, utils_1.getEventTypeClientX)(ev) - this.leftConnectRect) /
                    (this.connect.offsetWidth / (max - min))) %
                    (max - min);
                if (translation >= this._maxTranslation) {
                    this._handleOutOfMaxRangeValue(hand, max);
                }
                else if (translation <= this._minTranslation) {
                    this._handleOutOfMinRangeValue(hand, min);
                }
                else {
                    this._handleNormalMove(hand, translation, value);
                }
            });
        });
    }
    _setContainerClasses() {
        manipulator_1.default.addClass(this._element, this._classes.container);
    }
    _setRangeConnectsElement() {
        this._element.insertAdjacentHTML("afterbegin", (0, template_1.getConnectsTemplate)({
            connectContainer: this._classes.connectContainer,
            connect: this._classes.connect,
        }, ATTR_CONNECT_REF));
    }
    _setRangeHandleElements() {
        for (let i = 0; i < this._options.numberOfRanges; i++) {
            this._element.insertAdjacentHTML("beforeend", (0, template_1.getHandleTemplate)({ hand: this._classes.hand }, ATTR_HAND_REF));
        }
        this.hands.forEach((hand, i) => {
            hand.setAttribute("aria-orientation", "horizontal");
            hand.setAttribute("role", "slider");
            manipulator_1.default.setDataAttribute(hand, "handle", i);
        });
    }
    _setTooltipToHand() {
        if (this._options.tooltip) {
            this.hands.forEach((hand) => {
                return hand.insertAdjacentHTML("beforeend", (0, template_1.getTooltipTemplate)({
                    tooltip: this._classes.tooltip,
                    tooltipValue: this._classes.tooltipValue,
                }, ATTR_TOOLTIP_REF));
            });
        }
    }
    _handleMoveEvent(hand) {
        const { tooltip, step } = this._options;
        event_handler_1.EventHandlerMulti.on(document, "mousemove touchmove", (ev) => {
            if (ev.type === "mousemove") {
                ev.preventDefault();
            }
            const { max, min, numberOfRanges } = this._options;
            if (hand.hasAttribute(ATTR_STATE_ACTIVE)) {
                const maxValue = (((0, utils_1.getEventTypeClientX)(ev) - this.leftConnectRect) /
                    this.connect.offsetWidth) *
                    max;
                let value = ((((0, utils_1.getEventTypeClientX)(ev) - this.leftConnectRect) /
                    (this.connect.offsetWidth / (max - min))) %
                    (max - min)) +
                    min;
                if ((this._currentStepValue === Math.round(value) ||
                    Math.round(value) % step !== 0) &&
                    step !== null) {
                    this._canChangeStep = false;
                    return;
                }
                this._canChangeStep = true;
                let translation = (0, utils_1.getEventTypeClientX)(ev) - this.leftConnectRect - hand.offsetWidth / 2;
                const handActiveHandle = manipulator_1.default.getDataAttribute(this.handActive, "handle");
                const handActiveTranslation = manipulator_1.default.getDataAttribute(this.handActive, "translation");
                if (value < min) {
                    translation = min - hand.offsetWidth / 2;
                    value = min;
                }
                else if (maxValue >= max) {
                    return;
                }
                const handleDataTranslate = this.hands.map((hand) => manipulator_1.default.getDataAttribute(hand, "translation"));
                if (numberOfRanges < 2) {
                    if (Math.round(value) % step === 0 && step !== null) {
                        this._currentStepValue = Math.round(value);
                        manipulator_1.default.addStyle(hand, {
                            transform: `translate(${translation}px,-25%)`,
                        });
                        if (tooltip) {
                            this.activeTooltipValue.innerText = Math.round(value);
                        }
                    }
                    else if (step === null) {
                        manipulator_1.default.addStyle(hand, {
                            transform: `translate(${translation}px,-25%)`,
                        });
                        if (tooltip) {
                            this.activeTooltipValue.innerText = Math.round(value);
                        }
                    }
                    manipulator_1.default.setDataAttribute(hand, "translation", translation);
                }
                else {
                    const isWithinBounds = handActiveHandle > 0 && handActiveHandle < numberOfRanges - 1;
                    let newPosition = translation;
                    let canChangeTranslation = false;
                    const nextTranslation = handleDataTranslate[handActiveHandle + 1];
                    const prevTranslation = handleDataTranslate[handActiveHandle - 1];
                    if (handActiveHandle === 0 &&
                        handActiveTranslation >= nextTranslation) {
                        newPosition = nextTranslation;
                        canChangeTranslation = translation <= newPosition;
                    }
                    else if (handActiveHandle === numberOfRanges - 1 &&
                        handActiveTranslation <= prevTranslation) {
                        newPosition = prevTranslation;
                        canChangeTranslation = translation >= newPosition;
                    }
                    else if (isWithinBounds &&
                        (handActiveTranslation >= nextTranslation ||
                            handActiveTranslation <= prevTranslation)) {
                        newPosition =
                            handActiveTranslation >= nextTranslation
                                ? nextTranslation
                                : prevTranslation;
                        canChangeTranslation =
                            newPosition === nextTranslation
                                ? translation <= newPosition
                                : translation >= newPosition;
                    }
                    if (Math.round(value) % step === 0 && step !== null) {
                        this._currentStepValue = Math.round(value);
                        manipulator_1.default.addStyle(hand, {
                            transform: `translate(${newPosition}px,-25%)`,
                        });
                        if (tooltip &&
                            newPosition === translation &&
                            this.activeTooltipValue !== null) {
                            this.activeTooltipValue.innerText = Math.round(value);
                        }
                    }
                    else if (step === null) {
                        manipulator_1.default.addStyle(hand, {
                            transform: `translate(${newPosition}px,-25%)`,
                        });
                        if (tooltip &&
                            newPosition === translation &&
                            this.activeTooltipValue !== null) {
                            this.activeTooltipValue.innerText = Math.round(value);
                        }
                    }
                    manipulator_1.default.setDataAttribute(hand, "translation", canChangeTranslation ? translation : newPosition);
                }
                this._canChangeStep && this._handleEventChangeValuesOnRange();
            }
        });
    }
    _handleEventChangeValuesOnRange() {
        const { max, min, numberOfRanges } = this._options;
        const calculateValue = (hand) => {
            const translation = hand.getBoundingClientRect().left -
                this.leftConnectRect +
                hand.offsetWidth / 2;
            let value = (translation / (this.connect.offsetWidth / (max - min))) % (max - min);
            if (translation === this.connect.offsetWidth) {
                value = max;
            }
            else {
                value += min;
            }
            manipulator_1.default.setDataAttribute(hand, "value", Math.round(value * 10) / 10);
            return { value };
        };
        if (numberOfRanges < 2) {
            const { value } = calculateValue(this.hands[0]);
            event_handler_1.default.trigger(this._element, EVENT_VALUE_CHANGED, {
                values: { value: value + min, rounded: Math.round(value + min) },
            });
            return;
        }
        const valuesArray = this.hands.map((hand) => calculateValue(hand));
        event_handler_1.default.trigger(this._element, EVENT_VALUE_CHANGED, {
            values: {
                value: valuesArray.map(({ value }) => value + min),
                rounded: valuesArray.map(({ value }) => Math.round(value + min)),
            },
        });
    }
    _resetHandState(hand, eventType) {
        event_handler_1.default.off(hand, eventType);
        hand.removeAttribute(ATTR_STATE_ACTIVE);
        if (this._options.tooltip) {
            hand.children[1].removeAttribute(ATTR_STATE_ACTIVE);
        }
    }
    _handleEndMoveEventDocument() {
        event_handler_1.EventHandlerMulti.on(document, "mouseup touchend", () => {
            if (this._mousemove) {
                this.hands.forEach((hand) => {
                    this._resetHandState(hand, "mousemove");
                });
                event_handler_1.EventHandlerMulti.off(document, "mousemove touchmove");
                this._mousemove = false;
            }
        });
    }
    _handleEndMoveEvent(hand) {
        event_handler_1.EventHandlerMulti.on(hand, "mouseup touchend", () => {
            this._resetHandState(hand, "mousemove");
            event_handler_1.EventHandlerMulti.off(document, "mousemove touchmove");
            this._mousemove = false;
        });
    }
    _handleClickOnRange() {
        if (this._options.step !== null) {
            return;
        }
        event_handler_1.EventHandlerMulti.on(this.connect, "mousedown touchstart", (ev) => {
            const arr = [];
            let index = 0;
            this.hands.forEach((hand) => {
                this._mousemove = true;
                const eventTypeClientX = (0, utils_1.getEventTypeClientX)(ev);
                const handWidth = hand.offsetWidth;
                const handTranslation = manipulator_1.default.getDataAttribute(hand, "translation");
                const translation = eventTypeClientX - this.leftConnectRect - handWidth / 2;
                if (this._options.numberOfRanges < 2) {
                    this._updateHand(hand, translation);
                }
                else {
                    arr.push(Math.abs(translation - handTranslation));
                    arr.forEach((item, i) => {
                        if (item < arr[index]) {
                            index = i;
                        }
                    });
                }
            });
            if (this._options.numberOfRanges >= 2) {
                const translation = (0, utils_1.getEventTypeClientX)(ev) -
                    this.leftConnectRect -
                    this.hands[index].offsetWidth / 2;
                this._updateAdjacentHands(index, translation);
            }
            this._handleEventChangeValuesOnRange();
        });
    }
    _updateHand(hand, translation) {
        manipulator_1.default.addStyle(hand, {
            transform: `translate(${translation}px,-25%)`,
        });
        manipulator_1.default.setDataAttribute(hand, "translation", translation);
    }
    _updateAdjacentHands(index, translation) {
        const nextHand = this.hands[index + 1];
        const prevHand = this.hands[index - 1];
        const translationNext = nextHand
            ? manipulator_1.default.getDataAttribute(nextHand, "translation")
            : undefined;
        const translationPrev = prevHand
            ? manipulator_1.default.getDataAttribute(prevHand, "translation")
            : undefined;
        if (nextHand && translation > translationNext) {
            this._updateHand(nextHand, translation);
        }
        else if (prevHand && translation < translationPrev) {
            this._updateHand(prevHand, translation);
        }
        else {
            this._updateHand(this.hands[index], translation);
        }
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
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose|hide/.test(config)) {
                return;
            }
            if (!data) {
                data = new MultiRangeSlider(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](options);
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
exports.default = MultiRangeSlider;
//# sourceMappingURL=index.js.map