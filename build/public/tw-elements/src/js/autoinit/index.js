"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const jqueryInit_1 = __importDefault(require("./jqueryInit"));
const autoinitCallbacks_1 = require("./autoinitCallbacks");
const chartsInit_1 = require("./chartsInit");
const Register_1 = __importDefault(require("./Register"));
const register = new Register_1.default();
const defaultInitSelectors = {
    alert: {
        name: "Alert",
        selector: "[data-te-alert-init]",
        isToggler: false,
    },
    animation: {
        name: "Animate",
        selector: "[data-te-animation-init]",
        isToggler: false,
    },
    carousel: {
        name: "Carousel",
        selector: "[data-te-carousel-init]",
        isToggler: false,
    },
    chips: {
        name: "ChipsInput",
        selector: "[data-te-chips-input-init]",
        isToggler: false,
    },
    chip: {
        name: "Chip",
        selector: "[data-te-chip-init]",
        isToggler: false,
        onInit: "init",
    },
    datepicker: {
        name: "Datepicker",
        selector: "[data-te-datepicker-init]",
        isToggler: false,
    },
    datetimepicker: {
        name: "Datetimepicker",
        selector: "[data-te-date-timepicker-init]",
        isToggler: false,
    },
    input: {
        name: "Input",
        selector: "[data-te-input-wrapper-init]",
        isToggler: false,
    },
    perfectScrollbar: {
        name: "PerfectScrollbar",
        selector: "[data-te-perfect-scrollbar-init]",
        isToggler: false,
    },
    rating: {
        name: "Rating",
        selector: "[data-te-rating-init]",
        isToggler: false,
    },
    scrollspy: {
        name: "ScrollSpy",
        selector: "[data-te-spy='scroll']",
        isToggler: false,
    },
    select: {
        name: "Select",
        selector: "[data-te-select-init]",
        isToggler: false,
    },
    sidenav: {
        name: "Sidenav",
        selector: "[data-te-sidenav-init]",
        isToggler: false,
    },
    stepper: {
        name: "Stepper",
        selector: "[data-te-stepper-init]",
        isToggler: false,
    },
    timepicker: {
        name: "Timepicker",
        selector: "[data-te-timepicker-init]",
        isToggler: false,
    },
    toast: {
        name: "Toast",
        selector: "[data-te-toast-init]",
        isToggler: false,
    },
    datatable: {
        name: "Datatable",
        selector: "[data-te-datatable-init]",
    },
    popconfirm: {
        name: "Popconfirm",
        selector: "[data-te-toggle='popconfirm']",
    },
    validation: {
        name: "Validation",
        selector: "[data-te-validation-init]",
    },
    smoothScroll: {
        name: "SmoothScroll",
        selector: "a[data-te-smooth-scroll-init]",
    },
    lazyLoad: {
        name: "LazyLoad",
        selector: "[data-te-lazy-load-init]",
    },
    clipboard: {
        name: "Clipboard",
        selector: "[data-te-clipboard-init]",
    },
    infiniteScroll: {
        name: "InfiniteScroll",
        selector: "[data-te-infinite-scroll-init]",
    },
    loadingManagement: {
        name: "LoadingManagement",
        selector: "[data-te-loading-management-init]",
    },
    sticky: {
        name: "Sticky",
        selector: "[data-te-sticky-init]",
    },
    multiRangeSlider: {
        name: "MultiRangeSlider",
        selector: "[data-te-multi-range-slider-init]",
    },
    chart: {
        name: "Chart",
        selector: "[data-te-chart]",
        isToggler: false,
        advanced: chartsInit_1.chartsCallback,
    },
    button: {
        name: "Button",
        selector: "[data-te-toggle='button']",
        isToggler: true,
        callback: autoinitCallbacks_1.buttonCallback,
    },
    collapse: {
        name: "Collapse",
        selector: "[data-te-collapse-init]",
        isToggler: true,
        callback: autoinitCallbacks_1.collapseCallback,
    },
    dropdown: {
        name: "Dropdown",
        selector: "[data-te-dropdown-toggle-ref]",
        isToggler: true,
        callback: autoinitCallbacks_1.dropdownCallback,
    },
    modal: {
        name: "Modal",
        selector: "[data-te-toggle='modal']",
        isToggler: true,
        callback: autoinitCallbacks_1.modalCallback,
    },
    ripple: {
        name: "Ripple",
        selector: "[data-te-ripple-init]",
        isToggler: true,
        callback: autoinitCallbacks_1.rippleCallback,
    },
    offcanvas: {
        name: "Offcanvas",
        selector: "[data-te-offcanvas-toggle]",
        isToggler: true,
        callback: autoinitCallbacks_1.offcanvasCallback,
    },
    tab: {
        name: "Tab",
        selector: "[data-te-toggle='tab'], [data-te-toggle='pill'], [data-te-toggle='list']",
        isToggler: true,
        callback: autoinitCallbacks_1.tabCallback,
    },
    tooltip: {
        name: "Tooltip",
        selector: "[data-te-toggle='tooltip']",
        isToggler: false,
        callback: autoinitCallbacks_1.tooltipsCallback,
    },
    popover: {
        name: "Popover",
        selector: "[data-te-toggle='popover']",
        isToggler: true,
        callback: autoinitCallbacks_1.popoverCallback,
    },
    lightbox: {
        name: "Lightbox",
        selector: "[data-te-lightbox-init]",
        isToggler: true,
        callback: autoinitCallbacks_1.lightboxCallback,
    },
    touch: {
        name: "Touch",
        selector: "[data-te-touch-init]",
    },
};
const getComponentData = (component) => {
    return defaultInitSelectors[component.NAME] || null;
};
const initComponent = (component, options) => {
    if (!component ||
        (!options.allowReinits && register.isInited(component.NAME))) {
        return;
    }
    register.add(component.NAME);
    const thisComponent = getComponentData(component);
    const isToggler = (thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.isToggler) || false;
    (0, jqueryInit_1.default)(component);
    if (thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.advanced) {
        thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.advanced(component, thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.selector);
        return;
    }
    if (isToggler) {
        thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.callback(component, thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.selector);
        return;
    }
    selector_engine_1.default.find(thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.selector).forEach((element) => {
        let instance = component.getInstance(element);
        if (!instance) {
            instance = new component(element);
            if (thisComponent === null || thisComponent === void 0 ? void 0 : thisComponent.onInit) {
                instance[thisComponent.onInit]();
            }
        }
    });
};
const init = (components, options) => {
    components.forEach((component) => initComponent(component, options));
};
const defaultOptions = {
    allowReinits: false,
    checkOtherImports: false,
};
const initTE = (components, options = {}) => {
    options = Object.assign(Object.assign({}, defaultOptions), options);
    const componentList = Object.keys(defaultInitSelectors).map((element) => {
        const requireAutoinit = Boolean(document.querySelector(defaultInitSelectors[element].selector));
        if (requireAutoinit) {
            const component = components[defaultInitSelectors[element].name];
            if (!component &&
                !register.isInited(element) &&
                options.checkOtherImports) {
                console.warn(`Please import ${defaultInitSelectors[element].name} from "tw-elements" package and add it to a object parameter inside "initTE" function`);
            }
            return component;
        }
    });
    init(componentList, options);
};
exports.default = initTE;
//# sourceMappingURL=index.js.map