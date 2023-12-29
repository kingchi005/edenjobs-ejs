"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextActiveElement = exports.executeAfterTransition = exports.execute = exports.isDisabled = exports.getElement = exports.defineJQueryPlugin = exports.isRTL = exports.onDOMContentLoaded = exports.element = exports.array = exports.reflow = exports.noop = exports.findShadowRoot = exports.isVisible = exports.typeCheckConfig = exports.emulateTransitionEnd = exports.isElement = exports.triggerTransitionEnd = exports.getTransitionDurationFromElement = exports.getElementFromSelector = exports.getSelectorFromElement = exports.getUID = exports.TRANSITION_END = exports.getjQuery = void 0;
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = "transitionend";
exports.TRANSITION_END = TRANSITION_END;
const toType = (obj) => {
    if (obj === null || obj === undefined) {
        return `${obj}`;
    }
    return {}.toString
        .call(obj)
        .match(/\s([a-z]+)/i)[1]
        .toLowerCase();
};
const getUID = (prefix) => {
    do {
        prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));
    return prefix;
};
exports.getUID = getUID;
const getSelector = (element) => {
    let selector = element.getAttribute("data-te-target");
    if (!selector || selector === "#") {
        let hrefAttr = element.getAttribute("href");
        if (!hrefAttr || (!hrefAttr.includes("#") && !hrefAttr.startsWith("."))) {
            return null;
        }
        if (hrefAttr.includes("#") && !hrefAttr.startsWith("#")) {
            hrefAttr = `#${hrefAttr.split("#")[1]}`;
        }
        selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : null;
    }
    return selector;
};
const getSelectorFromElement = (element) => {
    const selector = getSelector(element);
    if (selector) {
        return document.querySelector(selector) ? selector : null;
    }
    return null;
};
exports.getSelectorFromElement = getSelectorFromElement;
const getElementFromSelector = (element) => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
};
exports.getElementFromSelector = getElementFromSelector;
const getTransitionDurationFromElement = (element) => {
    if (!element) {
        return 0;
    }
    let { transitionDuration, transitionDelay } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);
    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
    }
    transitionDuration = transitionDuration.split(",")[0];
    transitionDelay = transitionDelay.split(",")[0];
    return ((Number.parseFloat(transitionDuration) +
        Number.parseFloat(transitionDelay)) *
        MILLISECONDS_MULTIPLIER);
};
exports.getTransitionDurationFromElement = getTransitionDurationFromElement;
const triggerTransitionEnd = (element) => {
    element.dispatchEvent(new Event(TRANSITION_END));
};
exports.triggerTransitionEnd = triggerTransitionEnd;
const isElement = (obj) => {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (typeof obj.jquery !== "undefined") {
        obj = obj[0];
    }
    return typeof obj.nodeType !== "undefined";
};
exports.isElement = isElement;
const getElement = (obj) => {
    if (isElement(obj)) {
        return obj.jquery ? obj[0] : obj;
    }
    if (typeof obj === "string" && obj.length > 0) {
        return document.querySelector(obj);
    }
    return null;
};
exports.getElement = getElement;
const emulateTransitionEnd = (element, duration) => {
    let called = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;
    function listener() {
        called = true;
        element.removeEventListener(TRANSITION_END, listener);
    }
    element.addEventListener(TRANSITION_END, listener);
    setTimeout(() => {
        if (!called) {
            triggerTransitionEnd(element);
        }
    }, emulatedDuration);
};
exports.emulateTransitionEnd = emulateTransitionEnd;
const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach((property) => {
        const expectedTypes = configTypes[property];
        const value = config[property];
        const valueType = value && isElement(value) ? "element" : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(`${componentName.toUpperCase()}: ` +
                `Option "${property}" provided type "${valueType}" ` +
                `but expected type "${expectedTypes}".`);
        }
    });
};
exports.typeCheckConfig = typeCheckConfig;
const isVisible = (element) => {
    if (!element || element.getClientRects().length === 0) {
        return false;
    }
    if (element.style && element.parentNode && element.parentNode.style) {
        const elementStyle = getComputedStyle(element);
        const parentNodeStyle = getComputedStyle(element.parentNode);
        return (getComputedStyle(element).getPropertyValue("visibility") === "visible" ||
            (elementStyle.display !== "none" &&
                parentNodeStyle.display !== "none" &&
                elementStyle.visibility !== "hidden"));
    }
    return false;
};
exports.isVisible = isVisible;
const isDisabled = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }
    if (element.classList.contains("disabled")) {
        return true;
    }
    if (typeof element.disabled !== "undefined") {
        return element.disabled;
    }
    return (element.hasAttribute("disabled") &&
        element.getAttribute("disabled") !== "false");
};
exports.isDisabled = isDisabled;
const findShadowRoot = (element) => {
    if (!document.documentElement.attachShadow) {
        return null;
    }
    if (typeof element.getRootNode === "function") {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
    }
    if (element instanceof ShadowRoot) {
        return element;
    }
    if (!element.parentNode) {
        return null;
    }
    return findShadowRoot(element.parentNode);
};
exports.findShadowRoot = findShadowRoot;
const noop = () => function () { };
exports.noop = noop;
const reflow = (element) => {
    element.offsetHeight;
};
exports.reflow = reflow;
const getjQuery = () => {
    const { jQuery } = window;
    if (jQuery && !document.body.hasAttribute("data-te-no-jquery")) {
        return jQuery;
    }
    return null;
};
exports.getjQuery = getjQuery;
const DOMContentLoadedCallbacks = [];
const onDOMContentLoaded = (callback) => {
    if (document.readyState === "loading") {
        if (!DOMContentLoadedCallbacks.length) {
            document.addEventListener("DOMContentLoaded", () => {
                DOMContentLoadedCallbacks.forEach((callback) => callback());
            });
        }
        DOMContentLoadedCallbacks.push(callback);
    }
    else {
        callback();
    }
};
exports.onDOMContentLoaded = onDOMContentLoaded;
const isRTL = () => document.documentElement.dir === "rtl";
exports.isRTL = isRTL;
const array = (collection) => {
    return Array.from(collection);
};
exports.array = array;
const element = (tag) => {
    return document.createElement(tag);
};
exports.element = element;
const defineJQueryPlugin = (plugin) => {
    onDOMContentLoaded(() => {
        const $ = getjQuery();
        if ($) {
            const name = plugin.NAME;
            const JQUERY_NO_CONFLICT = $.fn[name];
            $.fn[name] = plugin.jQueryInterface;
            $.fn[name].Constructor = plugin;
            $.fn[name].noConflict = () => {
                $.fn[name] = JQUERY_NO_CONFLICT;
                return plugin.jQueryInterface;
            };
        }
    });
};
exports.defineJQueryPlugin = defineJQueryPlugin;
const execute = (callback) => {
    if (typeof callback === "function") {
        callback();
    }
};
exports.execute = execute;
const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
        execute(callback);
        return;
    }
    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;
    const handler = ({ target }) => {
        if (target !== transitionElement) {
            return;
        }
        called = true;
        transitionElement.removeEventListener(TRANSITION_END, handler);
        execute(callback);
    };
    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
        if (!called) {
            triggerTransitionEnd(transitionElement);
        }
    }, emulatedDuration);
};
exports.executeAfterTransition = executeAfterTransition;
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    let index = list.indexOf(activeElement);
    if (index === -1) {
        return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
    }
    const listLength = list.length;
    index += shouldGetNext ? 1 : -1;
    if (isCycleAllowed) {
        index = (index + listLength) % listLength;
    }
    return list[Math.max(0, Math.min(index, listLength - 1))];
};
exports.getNextActiveElement = getNextActiveElement;
//# sourceMappingURL=index.js.map