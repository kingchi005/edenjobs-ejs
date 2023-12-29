"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlerMulti = void 0;
const index_1 = require("../util/index");
const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {};
let uidEvent = 1;
const customEvents = {
    mouseenter: "mouseover",
    mouseleave: "mouseout",
};
const customEventsRegex = /^(mouseenter|mouseleave)/i;
const nativeEvents = new Set([
    "click",
    "dblclick",
    "mouseup",
    "mousedown",
    "contextmenu",
    "mousewheel",
    "DOMMouseScroll",
    "mouseover",
    "mouseout",
    "mousemove",
    "selectstart",
    "selectend",
    "keydown",
    "keypress",
    "keyup",
    "orientationchange",
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointerleave",
    "pointercancel",
    "gesturestart",
    "gesturechange",
    "gestureend",
    "focus",
    "blur",
    "change",
    "reset",
    "select",
    "submit",
    "focusin",
    "focusout",
    "load",
    "unload",
    "beforeunload",
    "resize",
    "move",
    "DOMContentLoaded",
    "readystatechange",
    "error",
    "abort",
    "scroll",
]);
function getUidEvent(element, uid) {
    return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++;
}
function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
}
function bootstrapHandler(element, fn) {
    return function handler(event) {
        event.delegateTarget = element;
        if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
        }
        return fn.apply(element, [event]);
    };
}
function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
        const domElements = element.querySelectorAll(selector);
        for (let { target } = event; target && target !== this; target = target.parentNode) {
            for (let i = domElements.length; i--; "") {
                if (domElements[i] === target) {
                    event.delegateTarget = target;
                    if (handler.oneOff) {
                        EventHandler.off(element, event.type, fn);
                    }
                    return fn.apply(target, [event]);
                }
            }
        }
        return null;
    };
}
function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);
    for (let i = 0, len = uidEventList.length; i < len; i++) {
        const event = events[uidEventList[i]];
        if (event.originalHandler === handler &&
            event.delegationSelector === delegationSelector) {
            return event;
        }
    }
    return null;
}
function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === "string";
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);
    if (!isNative) {
        typeEvent = originalTypeEvent;
    }
    return [delegation, originalHandler, typeEvent];
}
function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== "string" || !element) {
        return;
    }
    if (!handler) {
        handler = delegationFn;
        delegationFn = null;
    }
    if (customEventsRegex.test(originalTypeEvent)) {
        const wrapFn = (fn) => {
            return function (event) {
                if (!event.relatedTarget ||
                    (event.relatedTarget !== event.delegateTarget &&
                        !event.delegateTarget.contains(event.relatedTarget))) {
                    return fn.call(this, event);
                }
            };
        };
        if (delegationFn) {
            delegationFn = wrapFn(delegationFn);
        }
        else {
            handler = wrapFn(handler);
        }
    }
    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);
    if (previousFn) {
        previousFn.oneOff = previousFn.oneOff && oneOff;
        return;
    }
    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ""));
    const fn = delegation
        ? bootstrapDelegationHandler(element, handler, delegationFn)
        : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    if (!fn) {
        return;
    }
    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach((handlerKey) => {
        if (handlerKey.includes(namespace)) {
            const event = storeElementEvent[handlerKey];
            removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
    });
}
function getTypeEvent(event) {
    event = event.replace(stripNameRegex, "");
    return customEvents[event] || event;
}
const EventHandler = {
    on(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, false);
    },
    one(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, true);
    },
    off(element, originalTypeEvent, handler, delegationFn) {
        if (typeof originalTypeEvent !== "string" || !element) {
            return;
        }
        const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getEvent(element);
        const isNamespace = originalTypeEvent.startsWith(".");
        if (typeof originalHandler !== "undefined") {
            if (!events || !events[typeEvent]) {
                return;
            }
            removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
            return;
        }
        if (isNamespace) {
            Object.keys(events).forEach((elementEvent) => {
                removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            });
        }
        const storeElementEvent = events[typeEvent] || {};
        Object.keys(storeElementEvent).forEach((keyHandlers) => {
            const handlerKey = keyHandlers.replace(stripUidRegex, "");
            if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
                const event = storeElementEvent[keyHandlers];
                removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
            }
        });
    },
    trigger(element, event, args) {
        if (typeof event !== "string" || !element) {
            return null;
        }
        const $ = (0, index_1.getjQuery)();
        const typeEvent = getTypeEvent(event);
        const inNamespace = event !== typeEvent;
        const isNative = nativeEvents.has(typeEvent);
        let jQueryEvent;
        let bubbles = true;
        let nativeDispatch = true;
        let defaultPrevented = false;
        let evt = null;
        if (inNamespace && $) {
            jQueryEvent = $.Event(event, args);
            $(element).trigger(jQueryEvent);
            bubbles = !jQueryEvent.isPropagationStopped();
            nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
            defaultPrevented = jQueryEvent.isDefaultPrevented();
        }
        if (isNative) {
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(typeEvent, bubbles, true);
        }
        else {
            evt = new CustomEvent(event, {
                bubbles,
                cancelable: true,
            });
        }
        if (typeof args !== "undefined") {
            Object.keys(args).forEach((key) => {
                Object.defineProperty(evt, key, {
                    get() {
                        return args[key];
                    },
                });
            });
        }
        if (defaultPrevented) {
            evt.preventDefault();
        }
        if (nativeDispatch) {
            element.dispatchEvent(evt);
        }
        if (evt.defaultPrevented && typeof jQueryEvent !== "undefined") {
            jQueryEvent.preventDefault();
        }
        return evt;
    },
};
exports.EventHandlerMulti = {
    on(element, eventsName, handler, delegationFn) {
        const events = eventsName.split(" ");
        for (let i = 0; i < events.length; i++) {
            EventHandler.on(element, events[i], handler, delegationFn);
        }
    },
    off(element, originalTypeEvent, handler, delegationFn) {
        const events = originalTypeEvent.split(" ");
        for (let i = 0; i < events.length; i++) {
            EventHandler.off(element, events[i], handler, delegationFn);
        }
    },
};
exports.default = EventHandler;
//# sourceMappingURL=event-handler.js.map