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
const NAME = "sticky";
const DATA_KEY = `te.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_ACTIVE = `active${EVENT_KEY}`;
const EVENT_INACTIVE = `inactive${EVENT_KEY}`;
const Default = {
    stickyAnimationSticky: "",
    stickyAnimationUnsticky: "",
    stickyBoundary: false,
    stickyDelay: 0,
    stickyDirection: "down",
    stickyMedia: 0,
    stickyOffset: 0,
    stickyPosition: "top",
    stickyZIndex: 100,
};
const DefaultType = {
    stickyAnimationSticky: "string",
    stickyAnimationUnsticky: "string",
    stickyBoundary: "(boolean|string)",
    stickyDelay: "number",
    stickyDirection: "string",
    stickyMedia: "number",
    stickyOffset: "number",
    stickyPosition: "string",
    stickyZIndex: "(string|number)",
};
const DefaultClasses = {
    stickyActive: "",
};
const DefaultClassesType = {
    stickyActive: "string",
};
class Sticky {
    constructor(element, options, classes) {
        this._element = element;
        this._hiddenElement = null;
        this._elementPositionStyles = {};
        this._scrollDirection = "";
        this._isSticked = false;
        this._elementOffsetTop = null;
        this._scrollTop = 0;
        this._pushPoint = "";
        this._manuallyDeactivated = false;
        if (this._element) {
            this._options = this._getConfig(options);
            this._classes = this._getClasses(classes);
            data_1.default.setData(element, DATA_KEY, this);
            this._init();
        }
    }
    static get NAME() {
        return NAME;
    }
    dispose() {
        const { stickyAnimationUnsticky } = this._options;
        let { animationDuration } = getComputedStyle(this._element);
        animationDuration =
            stickyAnimationUnsticky !== "" ? parseFloat(animationDuration) * 1000 : 0;
        this._disableSticky();
        setTimeout(() => {
            data_1.default.removeData(this._element, DATA_KEY);
            this._element = null;
            this._options = null;
            this._hiddenElement = null;
            this._elementPositionStyles = null;
            this._scrollDirection = null;
            this._isSticked = null;
            this._elementOffsetTop = null;
            this._scrollTop = null;
            this._pushPoint = null;
            this._manuallyDeactivated = null;
        }, animationDuration);
    }
    active() {
        if (this._isSticked) {
            return;
        }
        this._createHiddenElement();
        this._enableSticky();
        this._changeBoundaryPosition();
        this._isSticked = true;
        this._manuallyDeactivated = false;
    }
    inactive() {
        if (!this._isSticked) {
            return;
        }
        this._disableSticky();
        this._isSticked = false;
        this._manuallyDeactivated = true;
    }
    _init() {
        this._userActivityListener();
    }
    _userActivityListener() {
        event_handler_1.default.on(window, "resize", () => {
            this._updateElementPosition();
            this._updateElementOffset();
        });
        event_handler_1.default.on(window, "scroll", () => {
            if (!this._element) {
                return;
            }
            if (window.innerWidth <= this._options.stickyMedia) {
                return;
            }
            if (this._manuallyDeactivated) {
                return;
            }
            const doc = document.documentElement;
            const { stickyDirection } = this._options;
            const scrollTop = window.pageYOffset || doc.scrollTop;
            this._updateElementOffset();
            this._updatePushPoint();
            this._updateScrollDirection(scrollTop);
            this._clearInProgressAnimations();
            const isCorrectScrollDirection = [this._scrollDirection, "both"].includes(stickyDirection);
            const isPushPointReached = this._pushPoint <= scrollTop;
            const shouldBeSticky = isPushPointReached && !this._isSticked && isCorrectScrollDirection;
            const shouldNotBeSticky = (!isPushPointReached || !isCorrectScrollDirection) && this._isSticked;
            if (shouldBeSticky) {
                this._createHiddenElement();
                this._enableSticky();
                this._changeBoundaryPosition();
                this._isSticked = true;
            }
            if (shouldNotBeSticky) {
                this._disableSticky();
                this._isSticked = false;
            }
            if (this._isSticked) {
                this._updatePosition({ styles: this._elementPositionStyles });
                this._changeBoundaryPosition();
            }
            this._scrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
    _updatePushPoint() {
        if (this._options.stickyPosition === "top") {
            this._pushPoint = this._elementOffsetTop - this._options.stickyDelay;
        }
        else {
            this._pushPoint =
                this._elementOffsetTop +
                    this._element.height -
                    document.body.scrollHeight +
                    this._options.stickyDelay;
        }
    }
    _updateElementOffset() {
        if (this._hiddenElement) {
            this._elementOffsetTop = this._hiddenElement.offsetTop;
        }
        else {
            this._elementOffsetTop = this._element.offsetTop;
        }
        if (this._options.stickyAnimationUnsticky) {
            this._elementOffsetTop += this._element.height || 0;
        }
    }
    _updateElementPosition() {
        if (this._hiddenElement) {
            const { left } = this._hiddenElement.getBoundingClientRect();
            this._elementPositionStyles = {
                left: `${left}px`,
            };
        }
        else {
            this._elementPositionStyles = {};
        }
        this._setStyle(this._element, this._elementPositionStyles);
    }
    _updateScrollDirection(scrollTop) {
        if (scrollTop > this._scrollTop) {
            this._scrollDirection = "down";
        }
        else {
            this._scrollDirection = "up";
        }
    }
    _clearInProgressAnimations() {
        const isScrollUp = this._scrollDirection === "up";
        const isUnstickyAnimationInProgress = this._element.classList.contains(this._options.stickyAnimationUnsticky);
        const isScrolledAboveElement = window.scrollY <= this._elementOffsetTop - this._element.height;
        if (isScrollUp && isUnstickyAnimationInProgress && isScrolledAboveElement) {
            this._removeUnstickyAnimation();
            this._resetStyles();
            this._removeHiddenElement();
        }
    }
    _enableSticky() {
        const { stickyAnimationSticky, stickyAnimationUnsticky, stickyOffset, stickyPosition, stickyZIndex, } = this._options;
        const { height, left, width } = this._element.getBoundingClientRect();
        if (stickyAnimationSticky !== "") {
            this._toggleClass(stickyAnimationSticky, stickyAnimationUnsticky, this._element);
        }
        this._toggleClass(this._classes.stickyActive, "", this._element);
        this._setStyle(this._element, {
            top: stickyPosition === "top" && `${0 + stickyOffset}px`,
            bottom: stickyPosition === "bottom" && `${0 + stickyOffset}px`,
            height: `${height}px`,
            width: `${width}px`,
            left: `${left}px`,
            zIndex: `${stickyZIndex}`,
            position: "fixed",
        });
        this._hiddenElement.hidden = false;
        event_handler_1.default.trigger(this._element, EVENT_ACTIVE);
    }
    _changeBoundaryPosition() {
        const { stickyPosition, stickyBoundary, stickyOffset } = this._options;
        const { height } = this._element.getBoundingClientRect();
        const parentOffset = Object.assign({ height: this._element.parentElement.getBoundingClientRect().height }, this._getOffset(this._element.parentElement));
        let stopPoint;
        const stopper = selector_engine_1.default.findOne(stickyBoundary);
        if (stopper) {
            stopPoint = this._getOffset(stopper).top - height - stickyOffset;
        }
        else {
            stopPoint =
                parentOffset.height +
                    parentOffset[stickyPosition] -
                    height -
                    stickyOffset;
        }
        const isStickyTop = stickyPosition === "top";
        const isStickyBottom = stickyPosition === "bottom";
        const isStickyBoundary = stickyBoundary;
        const isBelowStopPoint = stopPoint < 0;
        const isBelowParentElementEnd = stopPoint > parentOffset.height - height;
        let elementStyle;
        if (isStickyTop) {
            if (isBelowStopPoint && isStickyBoundary) {
                elementStyle = { top: `${stickyOffset + stopPoint}px` };
            }
            else {
                elementStyle = { top: `${stickyOffset + 0}px` };
            }
        }
        if (isStickyBottom) {
            if (isBelowStopPoint && isStickyBoundary) {
                elementStyle = { bottom: `${stickyOffset + stopPoint}px` };
            }
            else if (isBelowParentElementEnd && isStickyBoundary) {
                elementStyle = { bottom: `${stickyOffset + parentOffset.bottom}px` };
            }
            else {
                elementStyle = { bottom: `${stickyOffset + 0}px` };
            }
        }
        this._setStyle(this._element, elementStyle);
    }
    _disableSticky() {
        const { stickyAnimationUnsticky, stickyAnimationSticky } = this._options;
        let { animationDuration } = getComputedStyle(this._element);
        animationDuration =
            stickyAnimationUnsticky !== "" ? parseFloat(animationDuration) * 1000 : 0;
        if (this._options.stickyAnimationUnsticky !== "") {
            this._toggleClass(stickyAnimationUnsticky, stickyAnimationSticky, this._element);
        }
        setTimeout(() => {
            if (this._element.classList.contains(stickyAnimationSticky)) {
                return;
            }
            this._removeUnstickyAnimation();
            this._resetStyles();
            this._removeHiddenElement();
            this._toggleClass("", this._classes.stickyActive, this._element);
            event_handler_1.default.trigger(this._element, EVENT_INACTIVE);
        }, animationDuration);
    }
    _createHiddenElement() {
        if (!this._hiddenElement) {
            this._hiddenElement = this._copyElement(this._element);
        }
    }
    _removeHiddenElement() {
        if (!this._hiddenElement) {
            return;
        }
        this._hiddenElement.remove();
        this._hiddenElement = null;
    }
    _removeUnstickyAnimation() {
        this._toggleClass("", this._options.stickyAnimationUnsticky, this._element);
    }
    _resetStyles() {
        this._setStyle(this._element, {
            top: null,
            bottom: null,
            position: null,
            left: null,
            zIndex: null,
            width: null,
            height: null,
        });
    }
    _updatePosition({ styles }) {
        this._setStyle(this._element, styles);
    }
    _toggleClass(addClass, removeClass, target) {
        if (addClass) {
            manipulator_1.default.addClass(target, addClass);
        }
        if (removeClass) {
            manipulator_1.default.removeClass(target, removeClass);
        }
    }
    _getOffset(element) {
        const offsetElement = manipulator_1.default.offset(element);
        const rectElement = element.getBoundingClientRect();
        const bottom = offsetElement.left === 0 && offsetElement.top === 0
            ? 0
            : window.innerHeight - rectElement.bottom;
        return Object.assign(Object.assign({}, offsetElement), { bottom });
    }
    _copyElement(itemToCopy) {
        const { height, width } = itemToCopy.getBoundingClientRect();
        const COPIED_ITEM = itemToCopy.cloneNode(false);
        COPIED_ITEM.hidden = true;
        this._setStyle(COPIED_ITEM, {
            height: `${height}px`,
            width: `${width}px`,
            opacity: "0",
        });
        itemToCopy.parentElement.insertBefore(COPIED_ITEM, itemToCopy);
        return COPIED_ITEM;
    }
    _getConfig(config = {}) {
        const dataAttributes = manipulator_1.default.getDataAttributes(this._element);
        config = Object.assign(Object.assign(Object.assign({}, Default), dataAttributes), config);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _setStyle(element, styles) {
        Object.keys(styles).forEach((style) => {
            element.style[style] = styles[style];
        });
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose|hide/.test(config)) {
                return;
            }
            if (!data) {
                data = new Sticky(this, _config);
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
exports.default = Sticky;
//# sourceMappingURL=sticky.js.map