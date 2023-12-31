"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const base_component_1 = __importDefault(require("../base-component"));
const NAME = "tab";
const DATA_KEY = "te.tab";
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const DATA_NAME_DROPDOWN_MENU = "data-te-dropdown-menu-ref";
const TAB_ACTIVE = "data-te-tab-active";
const NAV_ACTIVE = "data-te-nav-active";
const SELECTOR_DROPDOWN = "[data-te-dropdown-ref]";
const SELECTOR_NAV = "[data-te-nav-ref]";
const SELECTOR_TAB_ACTIVE = `[${TAB_ACTIVE}]`;
const SELECTOR_NAV_ACTIVE = `[${NAV_ACTIVE}]`;
const SELECTOR_ACTIVE_UL = ":scope > li > .active";
const SELECTOR_DROPDOWN_TOGGLE = "[data-te-dropdown-toggle-ref]";
const SELECTOR_DROPDOWN_ACTIVE_CHILD = ":scope > [data-te-dropdown-menu-ref] [data-te-dropdown-show]";
const DefaultClasses = {
    show: "opacity-100",
    hide: "opacity-0",
};
const DefaultClassesType = {
    show: "string",
    hide: "string",
};
class Tab extends base_component_1.default {
    constructor(element, classes) {
        super(element);
        this._classes = this._getClasses(classes);
    }
    static get NAME() {
        return NAME;
    }
    show() {
        if (this._element.parentNode &&
            this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
            this._element.getAttribute(NAV_ACTIVE) === "") {
            return;
        }
        let previous;
        const target = (0, index_1.getElementFromSelector)(this._element);
        const listElement = this._element.closest(SELECTOR_NAV);
        const activeNavElement = selector_engine_1.default.findOne(SELECTOR_NAV_ACTIVE, listElement);
        if (listElement) {
            const itemSelector = listElement.nodeName === "UL" || listElement.nodeName === "OL"
                ? SELECTOR_ACTIVE_UL
                : SELECTOR_TAB_ACTIVE;
            previous = selector_engine_1.default.find(itemSelector, listElement);
            previous = previous[previous.length - 1];
        }
        const hideEvent = previous
            ? event_handler_1.default.trigger(previous, EVENT_HIDE, {
                relatedTarget: this._element,
            })
            : null;
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW, {
            relatedTarget: previous,
        });
        if (showEvent.defaultPrevented ||
            (hideEvent !== null && hideEvent.defaultPrevented)) {
            return;
        }
        this._activate(this._element, listElement, null, activeNavElement, this._element);
        const complete = () => {
            event_handler_1.default.trigger(previous, EVENT_HIDDEN, {
                relatedTarget: this._element,
            });
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, {
                relatedTarget: previous,
            });
        };
        if (target) {
            this._activate(target, target.parentNode, complete, activeNavElement, this._element);
        }
        else {
            complete();
        }
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _activate(element, container, callback, activeNavElement, navElement) {
        const activeElements = container && (container.nodeName === "UL" || container.nodeName === "OL")
            ? selector_engine_1.default.find(SELECTOR_ACTIVE_UL, container)
            : selector_engine_1.default.children(container, SELECTOR_TAB_ACTIVE);
        const active = activeElements[0];
        const isTransitioning = callback && active && active.hasAttribute(TAB_ACTIVE);
        const complete = () => this._transitionComplete(element, active, callback, activeNavElement, navElement);
        if (active && isTransitioning) {
            manipulator_1.default.removeClass(active, this._classes.show);
            manipulator_1.default.addClass(active, this._classes.hide);
            this._queueCallback(complete, element, true);
        }
        else {
            complete();
        }
    }
    _transitionComplete(element, active, callback, activeNavElement, navElement) {
        if (active && activeNavElement) {
            active.removeAttribute(TAB_ACTIVE);
            activeNavElement.removeAttribute(NAV_ACTIVE);
            const dropdownChild = selector_engine_1.default.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);
            if (dropdownChild) {
                dropdownChild.removeAttribute(TAB_ACTIVE);
            }
            if (active.getAttribute("role") === "tab") {
                active.setAttribute("aria-selected", false);
            }
        }
        element.setAttribute(TAB_ACTIVE, "");
        navElement.setAttribute(NAV_ACTIVE, "");
        if (element.getAttribute("role") === "tab") {
            element.setAttribute("aria-selected", true);
        }
        (0, index_1.reflow)(element);
        if (element.classList.contains(this._classes.hide)) {
            manipulator_1.default.removeClass(element, this._classes.hide);
            manipulator_1.default.addClass(element, this._classes.show);
        }
        let parent = element.parentNode;
        if (parent && parent.nodeName === "LI") {
            parent = parent.parentNode;
        }
        if (parent && parent.hasAttribute(DATA_NAME_DROPDOWN_MENU)) {
            const dropdownElement = element.closest(SELECTOR_DROPDOWN);
            if (dropdownElement) {
                selector_engine_1.default.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach((dropdown) => dropdown.setAttribute(TAB_ACTIVE, ""));
            }
            element.setAttribute("aria-expanded", true);
        }
        if (callback) {
            callback();
        }
    }
    static jQueryInterface(config) {
        return this.each(function () {
            const data = Tab.getOrCreateInstance(this);
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config]();
            }
        });
    }
}
exports.default = Tab;
//# sourceMappingURL=tab.js.map