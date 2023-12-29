"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const focusTrap_1 = __importDefault(require("../util/focusTrap"));
const keycodes_1 = require("../util/keycodes");
const index_2 = __importDefault(require("../util/touch/index"));
const collapse_1 = __importDefault(require("../components/collapse"));
const data_1 = __importDefault(require("../dom/data"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const ripple_1 = __importDefault(require("../methods/ripple"));
const backdrop_1 = __importDefault(require("../util/backdrop"));
const index_es_1 = require("../index.es");
const NAME = "sidenav";
const DATA_KEY = "te.sidenav";
const ARROW_DATA = "data-te-sidenav-rotate-icon-ref";
const SELECTOR_TOGGLE = "[data-te-sidenav-toggle-ref]";
const SELECTOR_TOGGLE_COLLAPSE = "[data-te-collapse-init]";
const SELECTOR_SHOW_SLIM = '[data-te-sidenav-slim="true"]';
const SELECTOR_HIDE_SLIM = '[data-te-sidenav-slim="false"]';
const SELECTOR_NAVIGATION = "[data-te-sidenav-menu-ref]";
const SELECTOR_COLLAPSE = "[data-te-sidenav-collapse-ref]";
const SELECTOR_LINK = "[data-te-sidenav-link-ref]";
const TRANSLATION_LEFT = (0, index_1.isRTL)() ? 100 : -100;
const TRANSLATION_RIGHT = (0, index_1.isRTL)() ? -100 : 100;
const OPTIONS_TYPE = {
    sidenavAccordion: "(boolean)",
    sidenavBackdrop: "(boolean)",
    sidenavBackdropClass: "(null|string)",
    sidenavCloseOnEsc: "(boolean)",
    sidenavColor: "(string)",
    sidenavContent: "(null|string)",
    sidenavExpandable: "(boolean)",
    sidenavExpandOnHover: "(boolean)",
    sidenavFocusTrap: "(boolean)",
    sidenavHidden: "(boolean)",
    sidenavMode: "(string)",
    sidenavModeBreakpointOver: "(null|string|number)",
    sidenavModeBreakpointSide: "(null|string|number)",
    sidenavModeBreakpointPush: "(null|string|number)",
    sidenavBreakpointSm: "(number)",
    sidenavBreakpointMd: "(number)",
    sidenavBreakpointLg: "(number)",
    sidenavBreakpointXl: "(number)",
    sidenavBreakpoint2xl: "(number)",
    sidenavScrollContainer: "(null|string)",
    sidenavSlim: "(boolean)",
    sidenavSlimCollapsed: "(boolean)",
    sidenavSlimWidth: "(number)",
    sidenavPosition: "(string)",
    sidenavRight: "(boolean)",
    sidenavTransitionDuration: "(number)",
    sidenavWidth: "(number)",
};
const DEFAULT_OPTIONS = {
    sidenavAccordion: false,
    sidenavBackdrop: true,
    sidenavBackdropClass: null,
    sidenavCloseOnEsc: true,
    sidenavColor: "primary",
    sidenavContent: null,
    sidenavExpandable: true,
    sidenavExpandOnHover: false,
    sidenavFocusTrap: true,
    sidenavHidden: true,
    sidenavMode: "over",
    sidenavModeBreakpointOver: null,
    sidenavModeBreakpointSide: null,
    sidenavModeBreakpointPush: null,
    sidenavBreakpointSm: 640,
    sidenavBreakpointMd: 768,
    sidenavBreakpointLg: 1024,
    sidenavBreakpointXl: 1280,
    sidenavBreakpoint2xl: 1536,
    sidenavScrollContainer: null,
    sidenavSlim: false,
    sidenavSlimCollapsed: false,
    sidenavSlimWidth: 77,
    sidenavPosition: "fixed",
    sidenavRight: false,
    sidenavTransitionDuration: 300,
    sidenavWidth: 240,
};
class Sidenav {
    constructor(node, options = {}) {
        this._addBackdropOnInit = () => {
            if (this._options.sidenavHidden) {
                return;
            }
            this._backdrop.show();
            event_handler_1.default.off(this._element, "transitionend", this._addBackdropOnInit);
        };
        this._element = node;
        this._options = options;
        this._ID = (0, index_1.getUID)("");
        this._content = null;
        this._initialContentStyle = null;
        this._slimCollapsed = false;
        this._activeNode = null;
        this._tempSlim = false;
        this._backdrop = this._initializeBackDrop();
        this._focusTrap = null;
        this._perfectScrollbar = null;
        this._touch = null;
        this._setModeFromBreakpoints();
        this.escHandler = (e) => {
            if (e.keyCode === keycodes_1.ESCAPE && this.toggler && (0, index_1.isVisible)(this.toggler)) {
                this._update(false);
                event_handler_1.default.off(window, "keydown", this.escHandler);
            }
        };
        this.hashHandler = () => {
            this._setActiveElements();
        };
        if (node) {
            data_1.default.setData(node, DATA_KEY, this);
            this._setup();
        }
        if (this.options.sidenavBackdrop &&
            !this.options.sidenavHidden &&
            this.options.sidenavMode === "over") {
            event_handler_1.default.on(this._element, "transitionend", this._addBackdropOnInit);
        }
        this._didInit = false;
        this._init();
    }
    static get NAME() {
        return NAME;
    }
    get container() {
        if (this.options.sidenavPosition === "fixed") {
            return selector_engine_1.default.findOne("body");
        }
        const findContainer = (el) => {
            if (!el.parentNode || el.parentNode === document) {
                return el;
            }
            if (el.parentNode.style.position === "relative" ||
                el.parentNode.classList.contains("relative")) {
                return el.parentNode;
            }
            return findContainer(el.parentNode);
        };
        return findContainer(this._element);
    }
    get isVisible() {
        let containerStart = 0;
        let containerEnd = window.innerWidth;
        if (this.options.sidenavPosition !== "fixed") {
            const boundry = this.container.getBoundingClientRect();
            containerStart = boundry.x;
            containerEnd = boundry.x + boundry.width;
        }
        const { x } = this._element.getBoundingClientRect();
        if ((this.options.sidenavRight && !(0, index_1.isRTL)()) ||
            (!this.options.sidenavRight && (0, index_1.isRTL)())) {
            let scrollBarWidth = 0;
            if (this.container.scrollHeight > this.container.clientHeight) {
                scrollBarWidth =
                    this.container.offsetWidth - this.container.clientWidth;
            }
            if (this.container.tagName === "BODY") {
                const documentWidth = document.documentElement.clientWidth;
                scrollBarWidth = Math.abs(window.innerWidth - documentWidth);
            }
            return Math.abs(x + scrollBarWidth - containerEnd) > 10;
        }
        return Math.abs(x - containerStart) < 10;
    }
    get links() {
        return selector_engine_1.default.find(SELECTOR_LINK, this._element);
    }
    get navigation() {
        return selector_engine_1.default.find(SELECTOR_NAVIGATION, this._element);
    }
    get options() {
        const config = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), manipulator_1.default.getDataAttributes(this._element)), this._options);
        (0, index_1.typeCheckConfig)(NAME, config, OPTIONS_TYPE);
        return config;
    }
    get sidenavStyle() {
        return {
            width: `${this.width}px`,
            height: this.options.sidenavPosition === "fixed" ? "100vh" : "100%",
            position: this.options.sidenavPosition,
            transition: `all ${this.transitionDuration} linear`,
        };
    }
    get toggler() {
        const toggleElement = selector_engine_1.default.find(SELECTOR_TOGGLE).find((toggler) => {
            const target = manipulator_1.default.getDataAttribute(toggler, "target");
            return selector_engine_1.default.findOne(target) === this._element;
        });
        return toggleElement;
    }
    get transitionDuration() {
        return `${this.options.sidenavTransitionDuration / 1000}s`;
    }
    get translation() {
        return this.options.sidenavRight ? TRANSLATION_RIGHT : TRANSLATION_LEFT;
    }
    get width() {
        return this._slimCollapsed
            ? this.options.sidenavSlimWidth
            : this.options.sidenavWidth;
    }
    get isBackdropVisible() {
        return Boolean(this._backdrop._element);
    }
    changeMode(mode) {
        this._setMode(mode);
    }
    dispose() {
        event_handler_1.default.off(window, "keydown", this.escHandler);
        this.options.sidenavBackdrop && this._backdrop.dispose();
        event_handler_1.default.off(window, "hashchange", this.hashHandler);
        this._touch.dispose();
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    hide() {
        this._emitEvents(false);
        this._update(false);
        this._options.sidenavBackdrop &&
            this.isBackdropVisible &&
            this._backdrop.hide();
    }
    show() {
        this._emitEvents(true);
        this._update(true);
        this._options.sidenavBackdrop &&
            this._options.sidenavMode === "over" &&
            this._backdrop.show();
    }
    toggle() {
        this._emitEvents(!this.isVisible);
        this._update(!this.isVisible);
    }
    toggleSlim() {
        this._setSlim(!this._slimCollapsed);
    }
    update(options) {
        this._options = options;
        this._setup();
    }
    getBreakpoint(prefix) {
        return this._transformBreakpointValuesToObject()[prefix];
    }
    _init() {
        if (this._didInit) {
            return;
        }
        event_handler_1.default.on(document, "click", SELECTOR_TOGGLE, Sidenav.toggleSidenav());
        this._didInit = true;
    }
    _transformBreakpointValuesToObject() {
        return {
            sm: this.options.sidenavBreakpointSm,
            md: this.options.sidenavBreakpointMd,
            lg: this.options.sidenavBreakpointLg,
            xl: this.options.sidenavBreakpointXl,
            "2xl": this.options.sidenavBreakpoint2xl,
        };
    }
    _setModeFromBreakpoints() {
        const innerWidth = window.innerWidth;
        const breakpointsList = this._transformBreakpointValuesToObject();
        if (innerWidth === undefined || !breakpointsList) {
            return;
        }
        const overCalculated = typeof this.options.sidenavModeBreakpointOver === "number"
            ? innerWidth - this.options.sidenavModeBreakpointOver
            : innerWidth - breakpointsList[this.options.sidenavModeBreakpointOver];
        const sideCalculated = typeof this.options.sidenavModeBreakpointSide === "number"
            ? innerWidth - this.options.sidenavModeBreakpointSide
            : innerWidth - breakpointsList[this.options.sidenavModeBreakpointSide];
        const pushCalculated = typeof this.options.sidenavModeBreakpointPush === "number"
            ? innerWidth - this.options.sidenavModeBreakpointPush
            : innerWidth - breakpointsList[this.options.sidenavModeBreakpointPush];
        const sortAsc = (a, b) => {
            if (a - b < 0)
                return -1;
            if (b - a < 0)
                return 1;
            return 0;
        };
        const closestPositive = [overCalculated, sideCalculated, pushCalculated]
            .filter((value) => value != null && value >= 0)
            .sort(sortAsc)[0];
        if (overCalculated > 0 && overCalculated === closestPositive) {
            this._options.sidenavMode = "over";
            this._options.sidenavHidden = true;
        }
        else if (sideCalculated > 0 && sideCalculated === closestPositive) {
            this._options.sidenavMode = "side";
        }
        else if (pushCalculated > 0 && pushCalculated === closestPositive) {
            this._options.sidenavMode = "push";
        }
    }
    _collapseItems() {
        this.navigation.forEach((menu) => {
            const collapseElements = selector_engine_1.default.find(SELECTOR_COLLAPSE, menu);
            collapseElements.forEach((el) => {
                collapse_1.default.getInstance(el).hide();
            });
        });
    }
    _getOffsetValue(show, { index, property, offsets }) {
        const initialValue = this._getPxValue(this._initialContentStyle[index][offsets[property].property]);
        const offset = show ? offsets[property].value : 0;
        return initialValue + offset;
    }
    _getProperty(...args) {
        return args
            .map((arg, i) => {
            if (i === 0) {
                return arg;
            }
            return arg[0].toUpperCase().concat(arg.slice(1));
        })
            .join("");
    }
    _getPxValue(property) {
        if (!property) {
            return 0;
        }
        return parseFloat(property);
    }
    _handleSwipe(e, inverseDirecion) {
        if (inverseDirecion &&
            this._slimCollapsed &&
            this.options.sidenavSlim &&
            this.options.sidenavExpandable) {
            this.toggleSlim();
        }
        else if (!inverseDirecion) {
            if (this._slimCollapsed ||
                !this.options.sidenavSlim ||
                !this.options.sidenavExpandable) {
                if (this.toggler && (0, index_1.isVisible)(this.toggler)) {
                    this.toggle();
                }
            }
            else {
                this.toggleSlim();
            }
        }
    }
    _isActive(link, reference) {
        if (reference) {
            return reference === link;
        }
        if (link.attributes.href) {
            return new URL(link, window.location.href).href === window.location.href;
        }
        return false;
    }
    _isAllToBeCollapsed() {
        const collapseElements = selector_engine_1.default.find(SELECTOR_TOGGLE_COLLAPSE, this._element);
        const collapseElementsExpanded = collapseElements.filter((collapsible) => collapsible.getAttribute("aria-expanded") === "true");
        return collapseElementsExpanded.length === 0;
    }
    _isAllCollapsed() {
        return (selector_engine_1.default.find(SELECTOR_COLLAPSE, this._element).filter((el) => (0, index_1.isVisible)(el)).length === 0);
    }
    _initializeBackDrop() {
        if (!this.options.sidenavBackdrop) {
            return;
        }
        const backdropClasses = this.options.sidenavBackdropClass
            ? this.options.sidenavBackdropClass.split(" ")
            : this.options.sidenavPosition
                ? [
                    "opacity-50",
                    "transition-all",
                    "duration-300",
                    "ease-in-out",
                    this.options.sidenavPosition,
                    "top-0",
                    "left-0",
                    "z-50",
                    "bg-black/10",
                    "dark:bg-black-60",
                    "w-full",
                    "h-full",
                    this._element.id,
                ]
                : null;
        return new backdrop_1.default({
            isVisible: this.options.sidenavBackdrop,
            isAnimated: true,
            rootElement: this._element.parentNode,
            backdropClasses,
            clickCallback: () => this.hide(),
        });
    }
    _updateBackdrop(show) {
        if (this.options.sidenavMode === "over") {
            show
                ? this._backdrop.show()
                : this.isBackdropVisible && this._backdrop.hide();
            return;
        }
        this.isBackdropVisible && this._backdrop.hide();
    }
    _setup() {
        this._setupTouch();
        if (this.options.sidenavFocusTrap) {
            this._setupFocusTrap();
        }
        this._setupCollapse();
        if (this.options.sidenavSlim) {
            this._setupSlim();
        }
        this._setupInitialStyling();
        this._setupScrolling();
        if (this.options.sidenavContent) {
            this._setupContent();
        }
        this._setupActiveState();
        this._setupRippleEffect();
        if (!this.options.sidenavHidden) {
            this._updateOffsets(true, true);
        }
        if (this.options.sidenavMode === "over") {
            this._setTabindex(true);
        }
    }
    _setupActiveState() {
        this._setActiveElements();
        this.links.forEach((link) => {
            event_handler_1.default.on(link, "click", () => this._setActiveElements(link));
            event_handler_1.default.on(link, "keydown", (e) => {
                if (e.keyCode === keycodes_1.ENTER) {
                    this._setActiveElements(link);
                }
            });
        });
        event_handler_1.default.on(window, "hashchange", this.hashHandler);
    }
    _setupCollapse() {
        this.navigation.forEach((menu, menuIndex) => {
            const categories = selector_engine_1.default.find(SELECTOR_COLLAPSE, menu);
            categories.forEach((list, index) => this._setupCollapseList({ list, index, menu, menuIndex }));
        });
    }
    _generateCollpaseID(index, menuIndex) {
        return `sidenav-collapse-${this._ID}-${menuIndex}-${index}`;
    }
    _setupCollapseList({ list, index, menu, menuIndex }) {
        const ID = this._generateCollpaseID(index, menuIndex);
        list.setAttribute("id", ID);
        list.setAttribute("data-te-collapse-item", "");
        const [toggler] = selector_engine_1.default.prev(list, SELECTOR_LINK);
        manipulator_1.default.setDataAttribute(toggler, "collapse-init", "");
        toggler.setAttribute("href", `#${ID}`);
        toggler.setAttribute("role", "button");
        const instance = collapse_1.default.getInstance(list) ||
            new collapse_1.default(list, {
                toggle: false,
                parent: this.options.sidenavAccordion ? menu : list,
            });
        if (list.dataset.teSidenavStateShow === "" ||
            list.dataset.teCollapseShow === "") {
            this._rotateArrow(toggler, false);
        }
        event_handler_1.default.on(toggler, "click", (e) => {
            this._toggleCategory(e, instance, list);
            if (this._tempSlim && this._isAllToBeCollapsed()) {
                this._setSlim(true);
                this._tempSlim = false;
            }
            if (this.options.sidenavMode === "over" && this._focusTrap) {
                this._focusTrap.update();
            }
        });
        event_handler_1.default.on(list, "show.te.collapse", () => this._rotateArrow(toggler, false));
        event_handler_1.default.on(list, "hide.te.collapse", () => this._rotateArrow(toggler, true));
        event_handler_1.default.on(list, "shown.te.collapse", () => {
            if (this.options.sidenavMode === "over" && this._focusTrap) {
                this._focusTrap.update();
            }
        });
        event_handler_1.default.on(list, "hidden.te.collapse", () => {
            if (this._tempSlim && this._isAllCollapsed()) {
                this._setSlim(true);
                this._tempSlim = false;
            }
            if (this.options.sidenavMode === "over" && this._focusTrap) {
                this._focusTrap.update();
            }
        });
    }
    _setupContent() {
        this._content = selector_engine_1.default.find(this.options.sidenavContent);
        this._content.forEach((el) => {
            const searchFor = [
                "!p",
                "!m",
                "!px",
                "!pl",
                "!pr",
                "!mx",
                "!ml",
                "!mr",
                "!-p",
                "!-m",
                "!-px",
                "!-pl",
                "!-pr",
                "!-mx",
                "!-ml",
                "!-mr",
            ];
            const classesToRemove = [...el.classList].filter((singleClass) => searchFor.findIndex((el) => singleClass.includes(el)) >= 0);
            classesToRemove.forEach((remove) => el.classList.remove(remove));
        });
        this._initialContentStyle = this._content.map((el) => {
            const { paddingLeft, paddingRight, marginLeft, marginRight, transition } = window.getComputedStyle(el);
            return { paddingLeft, paddingRight, marginLeft, marginRight, transition };
        });
    }
    _setupFocusTrap() {
        this._focusTrap = new focusTrap_1.default(this._element, {
            event: "keydown",
            condition: (e) => e.keyCode === keycodes_1.TAB,
            onlyVisible: true,
        }, this.toggler);
    }
    _setupInitialStyling() {
        this._setColor();
        manipulator_1.default.style(this._element, this.sidenavStyle);
    }
    _setupScrolling() {
        let container = this._element;
        if (this.options.sidenavScrollContainer) {
            container = selector_engine_1.default.findOne(this.options.sidenavScrollContainer, this._element);
            const siblings = (0, index_1.array)(container.parentNode.children).filter((el) => el !== container);
            const siblingsHeight = siblings.reduce((a, b) => {
                return a + b.clientHeight;
            }, 0);
            manipulator_1.default.style(container, {
                maxHeight: `calc(100% - ${siblingsHeight}px)`,
                position: "relative",
            });
        }
        this._perfectScrollbar = new index_es_1.PerfectScrollbar(container, {
            suppressScrollX: true,
            handlers: ["click-rail", "drag-thumb", "wheel", "touch"],
        });
    }
    _setupSlim() {
        this._slimCollapsed = this.options.sidenavSlimCollapsed;
        this._toggleSlimDisplay(this._slimCollapsed);
        if (this.options.sidenavExpandOnHover) {
            this._element.addEventListener("mouseenter", () => {
                if (this._slimCollapsed) {
                    this._setSlim(false);
                }
            });
            this._element.addEventListener("mouseleave", () => {
                if (!this._slimCollapsed) {
                    this._setSlim(true);
                }
            });
        }
    }
    _setupRippleEffect() {
        this.links.forEach((link) => {
            let wave = ripple_1.default.getInstance(link);
            let color = this.options.sidenavColor;
            if (wave && wave._options.sidenavColor !== this.options.sidenavColor) {
                wave.dispose();
            }
            else if (wave) {
                return;
            }
            if (localStorage.theme === "dark" ||
                (!("theme" in localStorage) &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                color = "white";
            }
            wave = new ripple_1.default(link, { rippleColor: color });
        });
    }
    _setupTouch() {
        this._touch = new index_2.default(this._element, "swipe", { threshold: 20 });
        this._touch.init();
        event_handler_1.default.on(this._element, "swipeleft", (e) => this._handleSwipe(e, this.options.sidenavRight));
        event_handler_1.default.on(this._element, "swiperight", (e) => this._handleSwipe(e, !this.options.sidenavRight));
    }
    _setActive(link, reference) {
        link.setAttribute("data-te-sidebar-state-active", "");
        if (this._activeNode) {
            link.removeAttribute("data-te-sidebar-state-active");
        }
        this._activeNode = link;
        const [collapse] = selector_engine_1.default.parents(this._activeNode, SELECTOR_COLLAPSE);
        if (!collapse) {
            this._setActiveCategory();
            return;
        }
        const [category] = selector_engine_1.default.prev(collapse, SELECTOR_LINK);
        this._setActiveCategory(category);
        if (!reference && !this._slimCollapsed) {
            collapse_1.default.getInstance(collapse).show();
        }
    }
    _setActiveCategory(el) {
        this.navigation.forEach((menu) => {
            const categories = selector_engine_1.default.find(SELECTOR_COLLAPSE, menu);
            categories.forEach((collapse) => {
                const [collapseToggler] = selector_engine_1.default.prev(collapse, SELECTOR_LINK);
                if (collapseToggler !== el) {
                    collapseToggler.removeAttribute("data-te-sidenav-state-active");
                }
                else {
                    collapseToggler.setAttribute("data-te-sidenav-state-active", "");
                }
            });
        });
    }
    _setActiveElements(reference) {
        this.navigation.forEach((menu) => {
            const links = selector_engine_1.default.find(SELECTOR_LINK, menu);
            links
                .filter((link) => {
                return selector_engine_1.default.next(link, SELECTOR_COLLAPSE).length === 0;
            })
                .forEach((link) => {
                if (this._isActive(link, reference) && link !== this._activeNode) {
                    this._setActive(link, reference);
                }
            });
        });
        reference && this._updateFocus(this.isVisible);
    }
    _setColor() {
        const colors = [
            "primary",
            "secondary",
            "success",
            "info",
            "warning",
            "danger",
            "light",
            "dark",
        ];
        const { sidenavColor: optionColor } = this.options;
        const color = colors.includes(optionColor) ? optionColor : "primary";
        colors.forEach((color) => {
            this._element.classList.remove(`sidenav-${color}`);
        });
        manipulator_1.default.addClass(this._element, `sidenav-${color}`);
    }
    _setContentOffsets(show, offsets, initial) {
        this._content.forEach((el, i) => {
            const padding = this._getOffsetValue(show, {
                index: i,
                property: "padding",
                offsets,
            });
            const margin = this._getOffsetValue(show, {
                index: i,
                property: "margin",
                offsets,
            });
            const style = {};
            if (!initial) {
                style.transition = `all ${this.transitionDuration} linear`;
            }
            style[offsets.padding.property] = `${padding}px`;
            style[offsets.margin.property] = `${margin}px`;
            manipulator_1.default.style(el, style);
            if (!show) {
                return;
            }
            if (initial) {
                manipulator_1.default.style(el, {
                    transition: this._initialContentStyle[i].transition,
                });
                return;
            }
            event_handler_1.default.on(el, "transitionend", () => {
                manipulator_1.default.style(el, {
                    transition: this._initialContentStyle[i].transition,
                });
            });
        });
    }
    _setMode(mode) {
        if (this.options.sidenavMode === mode) {
            return;
        }
        this._options.sidenavMode = mode;
        this._update(this.isVisible);
    }
    _setSlim(isSlimCollapsed) {
        const events = isSlimCollapsed
            ? ["collapse", "collapsed"]
            : ["expand", "expanded"];
        this._triggerEvents(...events);
        if (isSlimCollapsed) {
            this._collapseItems();
        }
        this._slimCollapsed = isSlimCollapsed;
        this._toggleSlimDisplay(isSlimCollapsed);
        manipulator_1.default.style(this._element, { width: `${this.width}px` });
        this._updateOffsets(this.isVisible);
    }
    _setTabindex(tabIndexValue) {
        this.links.forEach((link) => {
            link.tabIndex = tabIndexValue ? 0 : -1;
        });
    }
    _emitEvents(show) {
        const events = show ? ["show", "shown"] : ["hide", "hidden"];
        this._triggerEvents(...events);
    }
    _rotateArrow(toggler, collapsed) {
        const [arrow] = selector_engine_1.default.children(toggler, `[${ARROW_DATA}]`);
        if (!arrow) {
            return;
        }
        collapsed
            ? manipulator_1.default.removeClass(arrow, "rotate-180")
            : manipulator_1.default.addClass(arrow, "rotate-180");
    }
    _toggleCategory(e, instance) {
        e.preventDefault();
        instance.toggle();
        if (this._slimCollapsed && this.options.sidenavExpandable) {
            this._tempSlim = true;
            this._setSlim(false);
        }
    }
    _toggleSlimDisplay(slim) {
        const slimCollapsedElements = selector_engine_1.default.find(SELECTOR_SHOW_SLIM, this._element);
        const fullWidthElements = selector_engine_1.default.find(SELECTOR_HIDE_SLIM, this._element);
        const toggleElements = () => {
            slimCollapsedElements.forEach((el) => {
                manipulator_1.default.style(el, {
                    display: this._slimCollapsed ? "unset" : "none",
                });
            });
            fullWidthElements.forEach((el) => {
                manipulator_1.default.style(el, {
                    display: this._slimCollapsed ? "none" : "unset",
                });
            });
        };
        if (slim) {
            setTimeout(() => toggleElements(true), this.options.sidenavTransitionDuration);
        }
        else {
            toggleElements();
        }
    }
    _triggerEvents(startEvent, completeEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            event_handler_1.default.trigger(this._element, `${startEvent}.te.sidenav`);
            if (completeEvent) {
                yield setTimeout(() => {
                    event_handler_1.default.trigger(this._element, `${completeEvent}.te.sidenav`);
                }, this.options.sidenavTransitionDuration + 5);
            }
        });
    }
    _isiPhone() {
        return /iPhone|iPod/i.test(navigator.userAgent);
    }
    _update(show) {
        if (show && this._isiPhone()) {
            manipulator_1.default.addClass(this._element, "ps--scrolling-y");
        }
        if (this.toggler) {
            this._updateTogglerAria(show);
        }
        this._updateDisplay(show);
        if (this.options.sidenavBackdrop) {
            this._updateBackdrop(show);
        }
        this._updateOffsets(show);
        if (show &&
            this.options.sidenavCloseOnEsc &&
            this.options.sidenavMode !== "side") {
            event_handler_1.default.on(window, "keydown", this.escHandler);
        }
        if (this.options.sidenavFocusTrap) {
            this._updateFocus(show);
        }
    }
    _updateDisplay(show) {
        const translation = show ? 0 : this.translation;
        manipulator_1.default.style(this._element, {
            transform: `translateX(${translation}%)`,
        });
    }
    _updateFocus(show) {
        this._setTabindex(show);
        if (this.options.sidenavMode === "over" && this.options.sidenavFocusTrap) {
            if (show) {
                this._focusTrap.trap();
                return;
            }
            this._focusTrap.disable();
        }
        this._focusTrap.disable();
    }
    _updateOffsets(show, initial = false) {
        const [paddingPosition, marginPosition] = this.options.sidenavRight
            ? ["right", "left"]
            : ["left", "right"];
        const padding = {
            property: this._getProperty("padding", paddingPosition),
            value: this.options.sidenavMode === "over" ? 0 : this.width,
        };
        const margin = {
            property: this._getProperty("margin", marginPosition),
            value: this.options.sidenavMode === "push" ? -1 * this.width : 0,
        };
        event_handler_1.default.trigger(this._element, "update.te.sidenav", {
            margin,
            padding,
        });
        if (!this._content) {
            return;
        }
        this._content.className = "";
        this._setContentOffsets(show, { padding, margin }, initial);
    }
    _updateTogglerAria(show) {
        this.toggler.setAttribute("aria-expanded", show);
    }
    static toggleSidenav() {
        return function (e) {
            const toggler = selector_engine_1.default.closest(e.target, SELECTOR_TOGGLE);
            const elementSelector = manipulator_1.default.getDataAttributes(toggler).target;
            selector_engine_1.default.find(elementSelector).forEach((element) => {
                const instance = Sidenav.getInstance(element) || new Sidenav(element);
                instance.toggle();
            });
        };
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Sidenav(this, _config);
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
exports.default = Sidenav;
//# sourceMappingURL=sidenav.js.map