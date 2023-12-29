"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@popperjs/core");
const data_1 = __importDefault(require("../../dom/data"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const scrollbar_1 = __importDefault(require("../../util/scrollbar"));
const index_1 = require("../../util/index");
const focusTrap_1 = __importDefault(require("../../util/focusTrap"));
const date_utils_1 = require("./date-utils");
const templates_1 = require("./templates");
const keycodes_1 = require("../../util/keycodes");
const YEARS_IN_VIEW = 24;
const YEARS_IN_ROW = 4;
const MONTHS_IN_ROW = 4;
const NAME = "datepicker";
const DATA_KEY = "te.datepicker";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_OPEN = `open${EVENT_KEY}`;
const EVENT_DATE_CHANGE = `dateChange${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const MODAL_CONTAINER_NAME = "data-te-datepicker-modal-container-ref";
const DROPDOWN_CONTAINER_NAME = "data-te-datepicker-dropdown-container-ref";
const DATEPICKER_TOGGLE_SELECTOR = "[data-te-datepicker-toggle-ref]";
const MODAL_CONTAINER_SELECTOR = `[${MODAL_CONTAINER_NAME}]`;
const DROPDOWN_CONTAINER_SELECTOR = `[${DROPDOWN_CONTAINER_NAME}]`;
const VIEW_CHANGE_BUTTON_SELECTOR = "[data-te-datepicker-view-change-button-ref]";
const PREVIOUS_BUTTON_SELECTOR = "[data-te-datepicker-previous-button-ref]";
const NEXT_BUTTON_SELECTOR = "[data-te-datepicker-next-button-ref]";
const OK_BUTTON_SELECTOR = "[data-te-datepicker-ok-button-ref]";
const CANCEL_BUTTON_SELECTOR = "[data-te-datepicker-cancel-button-ref]";
const CLEAR_BUTTON_SELECTOR = "[data-te-datepicker-clear-button-ref]";
const VIEW_SELECTOR = "[data-te-datepicker-view-ref]";
const TOGGLE_BUTTON_SELECTOR = "[data-te-datepicker-toggle-button-ref]";
const DATE_TEXT_SELECTOR = "[data-te-datepicker-date-text-ref]";
const BACKDROP_SELECTOR = "[data-te-dropdown-backdrop-ref]";
const FADE_IN_CLASSES = "animate-[fade-in_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const FADE_OUT_CLASSES = "animate-[fade-out_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const FADE_IN_SHORT_CLASSES = "animate-[fade-in_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const FADE_OUT_SHORT_CLASSES = "animate-[fade-out_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const MODAL_CONTAINER_CLASSES = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[328px] h-[512px] bg-white rounded-[0.6rem] shadow-lg z-[1066] xs:max-md:landscape:w-[475px] xs:max-md:landscape:h-[360px] xs:max-md:landscape:flex-row dark:bg-zinc-700";
const DATEPICKER_BACKDROP_CLASSES = "w-full h-full fixed top-0 right-0 left-0 bottom-0 bg-black/40 z-[1065]";
const DATEPICKER_MAIN_CLASSES = "relative h-full";
const DATEPICKER_HEADER_CLASSES = "xs:max-md:landscape:h-full h-[120px] px-6 bg-primary flex flex-col rounded-t-lg dark:bg-zinc-800";
const DATEPICKER_TITLE_CLASSES = "h-8 flex flex-col justify-end";
const DATEPICKER_TITLE_TEXT_CLASSES = "text-[10px] font-normal uppercase tracking-[1.7px] text-white";
const DATEPICKER_DATE_CLASSES = "xs:max-md:landscape:mt-24 h-[72px] flex flex-col justify-end";
const DATEPICKER_DATE_TEXT_CLASSES = "text-[34px] font-normal text-white";
const DATEPICKER_VIEW_CLASSES = "outline-none px-3";
const DATEPICKER_DATE_CONTROLS_CLASSES = "px-3 pt-2.5 pb-0 flex justify-between text-black/[64]";
const DATEPICKER_VIEW_CHANGE_BUTTON_CLASSES = `flex items-center outline-none p-2.5 text-neutral-500 font-medium text-[0.9rem] rounded-xl shadow-none bg-transparent m-0 border-none hover:bg-neutral-200 focus:bg-neutral-200  dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10`;
const DATEPICKER_ARROW_CONTROLS_CLASSES = "mt-2.5";
const DATEPICKER_PREVIOUS_BUTTON_CLASSES = "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent mr-6 hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:mx-auto";
const DATEPICKER_NEXT_BUTTON_CLASSES = "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:rotate-180 [&>svg]:mx-auto";
const DATEPICKER_FOOTER_CLASSES = "h-14 flex absolute w-full bottom-0 justify-end items-center px-3";
const DATEPICKER_FOOTER_BTN_CLASSES = "outline-none bg-white text-primary border-none cursor-pointer py-0 px-2.5 uppercase text-[0.8rem] leading-10 font-medium h-10 tracking-[.1rem] rounded-[10px] mb-2.5 hover:bg-neutral-200 focus:bg-neutral-200 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10";
const DATEPICKER_CLEAR_BTN_CLASSES = "mr-auto";
const DATEPICKER_DAY_HEADING_CLASSES = "w-10 h-10 text-center text-[12px] font-normal dark:text-white";
const DATEPICKER_CELL_CLASSES = "text-center data-[te-datepicker-cell-disabled]:text-neutral-300 data-[te-datepicker-cell-disabled]:cursor-default data-[te-datepicker-cell-disabled]:pointer-events-none data-[te-datepicker-cell-disabled]:hover:cursor-default hover:cursor-pointer group";
const DATEPICKER_CELL_SMALL_CLASSES = "w-10 h-10 xs:max-md:landscape:w-8 xs:max-md:landscape:h-8";
const DATEPICKER_CELL_LARGE_CLASSES = "w-[76px] h-[42px]";
const DATEPICKER_CELL_CONTENT_CLASSES = "mx-auto group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-neutral-300 group-[[data-te-datepicker-cell-selected]]:bg-primary group-[[data-te-datepicker-cell-selected]]:text-white group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-neutral-100 group-[[data-te-datepicker-cell-focused]]:data-[te-datepicker-cell-selected]:bg-primary group-[[data-te-datepicker-cell-current]]:border-solid group-[[data-te-datepicker-cell-current]]:border-black group-[[data-te-datepicker-cell-current]]:border dark:group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-white/10 dark:group-[[data-te-datepicker-cell-current]]:border-white dark:text-white dark:group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-white/10 dark:group-[[data-te-datepicker-cell-disabled]]:text-neutral-500";
const DATEPICKER_CELL_CONTENT_SMALL_CLASSES = "w-9 h-9 leading-9 rounded-[50%] text-[13px]";
const DATEPICKER_CELL_CONTENT_LARGE_CLASSES = "w-[72px] h-10 leading-10 py-[1px] px-0.5 rounded-[999px]";
const DATEPICKER_TABLE_CLASSES = "mx-auto w-[304px]";
const DATEPICKER_TOGGLE_BUTTON_CLASSES = "flex items-center justify-content-center [&>svg]:w-5 [&>svg]:h-5 absolute outline-none border-none bg-transparent right-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-primary focus:text-primary dark:hover:text-primary-400 dark:focus:text-primary-400 dark:text-neutral-200";
const DATEPICKER_VIEW_CHANGE_ICON_CLASSES = "inline-block pointer-events-none ml-[3px] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-neutral-500 dark:[&>svg]:fill-white";
const DATEPICKER_DROPDOWN_CONTAINER_CLASSES = "w-[328px] h-[380px] bg-white rounded-lg shadow-[0px_2px_15px_-3px_rgba(0,0,0,.07),_0px_10px_20px_-2px_rgba(0,0,0,.04)] z-[1066] dark:bg-zinc-700";
const Default = {
    title: "Select date",
    container: "body",
    disablePast: false,
    disableFuture: false,
    monthsFull: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    weekdaysFull: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysNarrow: ["S", "M", "T", "W", "T", "F", "S"],
    okBtnText: "Ok",
    clearBtnText: "Clear",
    cancelBtnText: "Cancel",
    okBtnLabel: "Confirm selection",
    clearBtnLabel: "Clear selection",
    cancelBtnLabel: "Cancel selection",
    nextMonthLabel: "Next month",
    prevMonthLabel: "Previous month",
    nextYearLabel: "Next year",
    prevYearLabel: "Previous year",
    changeMonthIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
  `,
    nextMultiYearLabel: "Next 24 years",
    prevMultiYearLabel: "Previous 24 years",
    switchToMultiYearViewLabel: "Choose year and month",
    switchToMonthViewLabel: "Choose date",
    switchToDayViewLabel: "Choose date",
    startDate: null,
    startDay: 0,
    format: "dd/mm/yyyy",
    view: "days",
    viewChangeIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
  `,
    min: null,
    max: null,
    filter: null,
    inline: false,
    toggleButton: true,
    disableToggleButton: false,
    disableInput: false,
    animations: true,
    confirmDateOnSelect: false,
    removeOkBtn: false,
    removeCancelBtn: false,
    removeClearBtn: false,
};
const DefaultType = {
    title: "string",
    container: "string",
    disablePast: "boolean",
    disableFuture: "boolean",
    monthsFull: "array",
    monthsShort: "array",
    weekdaysFull: "array",
    weekdaysShort: "array",
    weekdaysNarrow: "array",
    okBtnText: "string",
    clearBtnText: "string",
    cancelBtnText: "string",
    okBtnLabel: "string",
    clearBtnLabel: "string",
    cancelBtnLabel: "string",
    nextMonthLabel: "string",
    prevMonthLabel: "string",
    nextYearLabel: "string",
    prevYearLabel: "string",
    nextMultiYearLabel: "string",
    prevMultiYearLabel: "string",
    changeMonthIconTemplate: "string",
    switchToMultiYearViewLabel: "string",
    switchToMonthViewLabel: "string",
    switchToDayViewLabel: "string",
    startDate: "(null|string|date)",
    startDay: "number",
    format: "string",
    view: "string",
    viewChangeIconTemplate: "string",
    min: "(null|string|date)",
    max: "(null|string|date)",
    filter: "(null|function)",
    inline: "boolean",
    toggleButton: "boolean",
    disableToggleButton: "boolean",
    disableInput: "boolean",
    animations: "boolean",
    confirmDateOnSelect: "boolean",
    removeOkBtn: "boolean",
    removeCancelBtn: "boolean",
    removeClearBtn: "boolean",
};
const DefaultClasses = {
    fadeIn: FADE_IN_CLASSES,
    fadeOut: FADE_OUT_CLASSES,
    fadeInShort: FADE_IN_SHORT_CLASSES,
    fadeOutShort: FADE_OUT_SHORT_CLASSES,
    modalContainer: MODAL_CONTAINER_CLASSES,
    datepickerBackdrop: DATEPICKER_BACKDROP_CLASSES,
    datepickerMain: DATEPICKER_MAIN_CLASSES,
    datepickerHeader: DATEPICKER_HEADER_CLASSES,
    datepickerTitle: DATEPICKER_TITLE_CLASSES,
    datepickerTitleText: DATEPICKER_TITLE_TEXT_CLASSES,
    datepickerDate: DATEPICKER_DATE_CLASSES,
    datepickerDateText: DATEPICKER_DATE_TEXT_CLASSES,
    datepickerView: DATEPICKER_VIEW_CLASSES,
    datepickerDateControls: DATEPICKER_DATE_CONTROLS_CLASSES,
    datepickerViewChangeButton: DATEPICKER_VIEW_CHANGE_BUTTON_CLASSES,
    datepickerViewChangeIcon: DATEPICKER_VIEW_CHANGE_ICON_CLASSES,
    datepickerArrowControls: DATEPICKER_ARROW_CONTROLS_CLASSES,
    datepickerPreviousButton: DATEPICKER_PREVIOUS_BUTTON_CLASSES,
    datepickerNextButton: DATEPICKER_NEXT_BUTTON_CLASSES,
    datepickerFooter: DATEPICKER_FOOTER_CLASSES,
    datepickerFooterBtn: DATEPICKER_FOOTER_BTN_CLASSES,
    datepickerClearBtn: DATEPICKER_CLEAR_BTN_CLASSES,
    datepickerDayHeading: DATEPICKER_DAY_HEADING_CLASSES,
    datepickerCell: DATEPICKER_CELL_CLASSES,
    datepickerCellSmall: DATEPICKER_CELL_SMALL_CLASSES,
    datepickerCellLarge: DATEPICKER_CELL_LARGE_CLASSES,
    datepickerCellContent: DATEPICKER_CELL_CONTENT_CLASSES,
    datepickerCellContentSmall: DATEPICKER_CELL_CONTENT_SMALL_CLASSES,
    datepickerCellContentLarge: DATEPICKER_CELL_CONTENT_LARGE_CLASSES,
    datepickerTable: DATEPICKER_TABLE_CLASSES,
    datepickerToggleButton: DATEPICKER_TOGGLE_BUTTON_CLASSES,
    datepickerDropdownContainer: DATEPICKER_DROPDOWN_CONTAINER_CLASSES,
};
const DefaultClassesType = {
    fadeIn: "string",
    fadeOut: "string",
    fadeInShort: "string",
    fadeOutShort: "string",
    modalContainer: "string",
    datepickerBackdrop: "string",
    datepickerMain: "string",
    datepickerHeader: "string",
    datepickerTitle: "string",
    datepickerTitleText: "string",
    datepickerDate: "string",
    datepickerDateText: "string",
    datepickerView: "string",
    datepickerDateControls: "string",
    datepickerViewChangeButton: "string",
    datepickerArrowControls: "string",
    datepickerPreviousButton: "string",
    datepickerNextButton: "string",
    datepickerFooter: "string",
    datepickerFooterBtn: "string",
    datepickerClearBtn: "string",
    datepickerDayHeading: "string",
    datepickerCell: "string",
    datepickerCellSmall: "string",
    datepickerCellLarge: "string",
    datepickerCellContent: "string",
    datepickerCellContentSmall: "string",
    datepickerCellContentLarge: "string",
    datepickerTable: "string",
    datepickerToggleButton: "string",
    datepickerDropdownContainer: "string",
};
class Datepicker {
    constructor(element, options, classes) {
        this._element = element;
        this._input = selector_engine_1.default.findOne("input", this._element);
        this._options = this._getConfig(options);
        this._classes = this._getClasses(classes);
        this._activeDate = new Date();
        this._selectedDate = null;
        this._selectedYear = null;
        this._selectedMonth = null;
        this._headerDate = null;
        this._headerYear = null;
        this._headerMonth = null;
        this._view = this._options.view;
        this._popper = null;
        this._focusTrap = null;
        this._isOpen = false;
        this._toggleButtonId = (0, index_1.getUID)("datepicker-toggle-");
        this._animations =
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
                this._options.animations;
        this._scrollBar = new scrollbar_1.default();
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
        }
        this._init();
        if (this.toggleButton && this._options.disableToggle) {
            this.toggleButton.disabled = "true";
        }
        if (this._options.disableInput) {
            this._input.disabled = "true";
        }
    }
    static get NAME() {
        return NAME;
    }
    get container() {
        return (selector_engine_1.default.findOne(`[${MODAL_CONTAINER_NAME}='${this._toggleButtonId}']`) ||
            selector_engine_1.default.findOne(`[${DROPDOWN_CONTAINER_NAME}='${this._toggleButtonId}']`));
    }
    get options() {
        return this._options;
    }
    get activeCell() {
        let activeCell;
        if (this._view === "days") {
            activeCell = this._getActiveDayCell();
        }
        if (this._view === "months") {
            activeCell = this._getActiveMonthCell();
        }
        if (this._view === "years") {
            activeCell = this._getActiveYearCell();
        }
        return activeCell;
    }
    get activeDay() {
        return (0, date_utils_1.getDate)(this._activeDate);
    }
    get activeMonth() {
        return (0, date_utils_1.getMonth)(this._activeDate);
    }
    get activeYear() {
        return (0, date_utils_1.getYear)(this._activeDate);
    }
    get firstYearInView() {
        return this.activeYear - (0, date_utils_1.getYearsOffset)(this._activeDate, YEARS_IN_VIEW);
    }
    get lastYearInView() {
        return this.firstYearInView + YEARS_IN_VIEW - 1;
    }
    get viewChangeButton() {
        return selector_engine_1.default.findOne(VIEW_CHANGE_BUTTON_SELECTOR, this.container);
    }
    get previousButton() {
        return selector_engine_1.default.findOne(PREVIOUS_BUTTON_SELECTOR, this.container);
    }
    get nextButton() {
        return selector_engine_1.default.findOne(NEXT_BUTTON_SELECTOR, this.container);
    }
    get okButton() {
        return selector_engine_1.default.findOne(OK_BUTTON_SELECTOR, this.container);
    }
    get cancelButton() {
        return selector_engine_1.default.findOne(CANCEL_BUTTON_SELECTOR, this.container);
    }
    get clearButton() {
        return selector_engine_1.default.findOne(CLEAR_BUTTON_SELECTOR, this.container);
    }
    get datesContainer() {
        return selector_engine_1.default.findOne(VIEW_SELECTOR, this.container);
    }
    get toggleButton() {
        return selector_engine_1.default.findOne(TOGGLE_BUTTON_SELECTOR, this._element);
    }
    update(options = {}) {
        this._options = this._getConfig(Object.assign(Object.assign({}, this._options), options));
    }
    _getConfig(config) {
        const dataAttributes = manipulator_1.default.getDataAttributes(this._element);
        config = Object.assign(Object.assign(Object.assign({}, Default), dataAttributes), config);
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        if (config.max && typeof config.max === "string") {
            config.max = new Date(config.max);
        }
        if (config.min && typeof config.min === "string") {
            config.min = new Date(config.min);
        }
        if (config.startDay && config.startDay !== 0) {
            const sortedWeekdaysNarrow = this._getNewDaysOrderArray(config);
            config.weekdaysNarrow = sortedWeekdaysNarrow;
        }
        return config;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _getContainer() {
        return selector_engine_1.default.findOne(this._options.container);
    }
    _getNewDaysOrderArray(config) {
        const index = config.startDay;
        const weekdaysNarrow = config.weekdaysNarrow;
        const sortedWeekdays = weekdaysNarrow
            .slice(index)
            .concat(weekdaysNarrow.slice(0, index));
        return sortedWeekdays;
    }
    _init() {
        if (!this.toggleButton && this._options.toggleButton) {
            this._appendToggleButton();
            if (this._input.readOnly || this._input.disabled) {
                this.toggleButton.style.pointerEvents = "none";
            }
        }
        this._listenToUserInput();
        this._listenToToggleClick();
        this._listenToToggleKeydown();
    }
    _appendToggleButton() {
        const toggleButton = (0, templates_1.getToggleButtonTemplate)(this._toggleButtonId, this._classes.datepickerToggleButton);
        this._element.insertAdjacentHTML("beforeend", toggleButton);
    }
    open() {
        if (this._input.readOnly || this._input.disabled) {
            return;
        }
        const openEvent = event_handler_1.default.trigger(this._element, EVENT_OPEN);
        if (this._isOpen || openEvent.defaultPrevented) {
            return;
        }
        this._setInitialDate();
        const backdrop = (0, templates_1.getBackdropTemplate)(this._classes.datepickerBackdrop);
        const template = (0, templates_1.getDatepickerTemplate)(this._activeDate, this._selectedDate, this._selectedYear, this._selectedMonth, this._options, MONTHS_IN_ROW, YEARS_IN_VIEW, YEARS_IN_ROW, this._toggleButtonId, this._classes);
        if (this._options.inline) {
            this._openDropdown(template);
        }
        else {
            this._openModal(backdrop, template);
            this._scrollBar.hide();
        }
        if (this._animations) {
            manipulator_1.default.addClass(this.container, this._classes.fadeIn);
            manipulator_1.default.addClass(backdrop, this._classes.fadeInShort);
        }
        this._setFocusTrap(this.container);
        this._listenToDateSelection();
        this._addControlsListeners();
        this._updateControlsDisabledState();
        this._listenToEscapeClick();
        this._listenToKeyboardNavigation();
        this._listenToDatesContainerFocus();
        this._listenToDatesContainerBlur();
        this._asyncFocusDatesContainer();
        this._updateViewControlsAndAttributes(this._view);
        this._isOpen = true;
        setTimeout(() => {
            this._listenToOutsideClick();
        }, 0);
    }
    _openDropdown(template) {
        this._popper = (0, core_1.createPopper)(this._input, template, {
            placement: "bottom-start",
        });
        const container = this._getContainer();
        container.appendChild(template);
    }
    _openModal(backdrop, template) {
        const container = this._getContainer();
        container.appendChild(backdrop);
        container.appendChild(template);
    }
    _setFocusTrap(element) {
        this._focusTrap = new focusTrap_1.default(element, {
            event: "keydown",
            condition: (event) => event.key === "Tab",
        });
        this._focusTrap.trap();
    }
    _listenToUserInput() {
        event_handler_1.default.on(this._input, "input", (event) => {
            this._handleUserInput(event.target.value);
        });
    }
    _listenToToggleClick() {
        event_handler_1.default.on(this._element, EVENT_CLICK_DATA_API, DATEPICKER_TOGGLE_SELECTOR, (event) => {
            event.preventDefault();
            this.open();
        });
    }
    _listenToToggleKeydown() {
        event_handler_1.default.on(this._element, "keydown", DATEPICKER_TOGGLE_SELECTOR, (event) => {
            if (event.keyCode === keycodes_1.ENTER && !this._isOpen) {
                this.open();
            }
        });
    }
    _listenToDateSelection() {
        event_handler_1.default.on(this.datesContainer, "click", (e) => {
            this._handleDateSelection(e);
        });
    }
    _handleDateSelection(e) {
        const dataset = e.target.nodeName === "DIV"
            ? e.target.parentNode.dataset
            : e.target.dataset;
        const cell = e.target.nodeName === "DIV" ? e.target.parentNode : e.target;
        if (dataset.teDate) {
            this._pickDay(dataset.teDate, cell);
        }
        if (dataset.teMonth && dataset.teYear) {
            const month = parseInt(dataset.teMonth, 10);
            const year = parseInt(dataset.teYear, 10);
            this._pickMonth(month, year);
        }
        if (dataset.teYear && !dataset.teMonth) {
            const year = parseInt(dataset.teYear, 10);
            this._pickYear(year);
        }
        if (!this._options.inline) {
            this._updateHeaderDate(this._activeDate, this._options.monthsShort, this._options.weekdaysShort);
        }
    }
    _updateHeaderDate(date, monthNames, dayNames) {
        const headerDateEl = selector_engine_1.default.findOne(DATE_TEXT_SELECTOR, this.container);
        const month = (0, date_utils_1.getMonth)(date);
        const day = (0, date_utils_1.getDate)(date);
        const dayNumber = (0, date_utils_1.getDayNumber)(date);
        headerDateEl.innerHTML = `${dayNames[dayNumber]}, ${monthNames[month]} ${day}`;
    }
    _addControlsListeners() {
        event_handler_1.default.on(this.nextButton, "click", () => {
            if (this._view === "days") {
                this.nextMonth();
            }
            else if (this._view === "years") {
                this.nextYears();
            }
            else {
                this.nextYear();
            }
            this._updateControlsDisabledState();
        });
        event_handler_1.default.on(this.previousButton, "click", () => {
            if (this._view === "days") {
                this.previousMonth();
            }
            else if (this._view === "years") {
                this.previousYears();
            }
            else {
                this.previousYear();
            }
            this._updateControlsDisabledState();
        });
        event_handler_1.default.on(this.viewChangeButton, "click", () => {
            if (this._view === "days") {
                this._changeView("years");
            }
            else if (this._view === "years" || this._view === "months") {
                this._changeView("days");
            }
        });
        if (!this._options.inline) {
            this._listenToFooterButtonsClick();
        }
    }
    _listenToFooterButtonsClick() {
        event_handler_1.default.on(this.okButton, "click", () => this.handleOk());
        event_handler_1.default.on(this.cancelButton, "click", () => this.handleCancel());
        event_handler_1.default.on(this.clearButton, "click", () => this.handleClear());
    }
    _listenToOutsideClick() {
        event_handler_1.default.on(document, EVENT_CLICK_DATA_API, (e) => {
            const isContainer = e.target === this.container;
            const isContainerContent = this.container && this.container.contains(e.target);
            if (!isContainer && !isContainerContent) {
                this.close();
            }
        });
    }
    _listenToEscapeClick() {
        event_handler_1.default.on(document, "keydown", (event) => {
            if (event.keyCode === keycodes_1.ESCAPE && this._isOpen) {
                this.close();
            }
        });
    }
    _listenToKeyboardNavigation() {
        event_handler_1.default.on(this.datesContainer, "keydown", (event) => {
            this._handleKeydown(event);
        });
    }
    _listenToDatesContainerFocus() {
        event_handler_1.default.on(this.datesContainer, "focus", () => {
            this._focusActiveCell(this.activeCell);
        });
    }
    _listenToDatesContainerBlur() {
        event_handler_1.default.on(this.datesContainer, "blur", () => {
            this._removeCurrentFocusStyles();
        });
    }
    _handleKeydown(event) {
        if (this._view === "days") {
            this._handleDaysViewKeydown(event);
        }
        if (this._view === "months") {
            this._handleMonthsViewKeydown(event);
        }
        if (this._view === "years") {
            this._handleYearsViewKeydown(event);
        }
    }
    _handleDaysViewKeydown(event) {
        const oldActiveDate = this._activeDate;
        const previousActiveCell = this.activeCell;
        switch (event.keyCode) {
            case keycodes_1.LEFT_ARROW:
                this._activeDate = (0, date_utils_1.addDays)(this._activeDate, (0, index_1.isRTL)() ? 1 : -1);
                break;
            case keycodes_1.RIGHT_ARROW:
                this._activeDate = (0, date_utils_1.addDays)(this._activeDate, (0, index_1.isRTL)() ? -1 : 1);
                break;
            case keycodes_1.UP_ARROW:
                this._activeDate = (0, date_utils_1.addDays)(this._activeDate, -7);
                break;
            case keycodes_1.DOWN_ARROW:
                this._activeDate = (0, date_utils_1.addDays)(this._activeDate, 7);
                break;
            case keycodes_1.HOME:
                this._activeDate = (0, date_utils_1.addDays)(this._activeDate, 1 - (0, date_utils_1.getDate)(this._activeDate));
                break;
            case keycodes_1.END:
                this._activeDate = (0, date_utils_1.addDays)(this._activeDate, (0, date_utils_1.getDaysInMonth)(this._activeDate) - (0, date_utils_1.getDate)(this._activeDate));
                break;
            case keycodes_1.PAGE_UP:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, -1);
                break;
            case keycodes_1.PAGE_DOWN:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, 1);
                break;
            case keycodes_1.ENTER:
            case keycodes_1.SPACE:
                this._selectDate(this._activeDate);
                this._handleDateSelection(event);
                event.preventDefault();
                return;
            default:
                return;
        }
        if (!(0, date_utils_1.areDatesInSameView)(oldActiveDate, this._activeDate, this._view, YEARS_IN_VIEW, this._options.min, this._options.max)) {
            this._changeView("days");
        }
        this._removeHighlightFromCell(previousActiveCell);
        this._focusActiveCell(this.activeCell);
        event.preventDefault();
    }
    _asyncFocusDatesContainer() {
        setTimeout(() => {
            this.datesContainer.focus();
        }, 0);
    }
    _focusActiveCell(cell) {
        if (cell) {
            cell.setAttribute("data-te-datepicker-cell-focused", "");
        }
    }
    _removeHighlightFromCell(cell) {
        if (cell) {
            cell.removeAttribute("data-te-datepicker-cell-focused");
        }
    }
    _getActiveDayCell() {
        const cells = selector_engine_1.default.find("td", this.datesContainer);
        const activeCell = Array.from(cells).find((cell) => {
            const cellDate = (0, date_utils_1.convertStringToDate)(cell.dataset.teDate);
            return (0, date_utils_1.isSameDate)(cellDate, this._activeDate);
        });
        return activeCell;
    }
    _handleMonthsViewKeydown(event) {
        const oldActiveDate = this._activeDate;
        const previousActiveCell = this.activeCell;
        switch (event.keyCode) {
            case keycodes_1.LEFT_ARROW:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, (0, index_1.isRTL)() ? 1 : -1);
                break;
            case keycodes_1.RIGHT_ARROW:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, (0, index_1.isRTL)() ? -1 : 1);
                break;
            case keycodes_1.UP_ARROW:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, -4);
                break;
            case keycodes_1.DOWN_ARROW:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, 4);
                break;
            case keycodes_1.HOME:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, -this.activeMonth);
                break;
            case keycodes_1.END:
                this._activeDate = (0, date_utils_1.addMonths)(this._activeDate, 11 - this.activeMonth);
                break;
            case keycodes_1.PAGE_UP:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, -1);
                break;
            case keycodes_1.PAGE_DOWN:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, 1);
                break;
            case keycodes_1.ENTER:
            case keycodes_1.SPACE:
                this._selectMonth(this.activeMonth);
                return;
            default:
                return;
        }
        if (!(0, date_utils_1.areDatesInSameView)(oldActiveDate, this._activeDate, this._view, YEARS_IN_VIEW, this._options.min, this._options.max)) {
            this._changeView("months");
        }
        this._removeHighlightFromCell(previousActiveCell);
        this._focusActiveCell(this.activeCell);
        event.preventDefault();
    }
    _getActiveMonthCell() {
        const cells = selector_engine_1.default.find("td", this.datesContainer);
        const activeCell = Array.from(cells).find((cell) => {
            const cellYear = parseInt(cell.dataset.teYear, 10);
            const cellMonth = parseInt(cell.dataset.teMonth, 10);
            return cellYear === this.activeYear && cellMonth === this.activeMonth;
        });
        return activeCell;
    }
    _handleYearsViewKeydown(event) {
        const oldActiveDate = this._activeDate;
        const previousActiveCell = this.activeCell;
        const yearsPerRow = 4;
        const yearsPerPage = 24;
        switch (event.keyCode) {
            case keycodes_1.LEFT_ARROW:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, (0, index_1.isRTL)() ? 1 : -1);
                break;
            case keycodes_1.RIGHT_ARROW:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, (0, index_1.isRTL)() ? -1 : 1);
                break;
            case keycodes_1.UP_ARROW:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, -yearsPerRow);
                break;
            case keycodes_1.DOWN_ARROW:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, yearsPerRow);
                break;
            case keycodes_1.HOME:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, -(0, date_utils_1.getYearsOffset)(this._activeDate, yearsPerPage));
                break;
            case keycodes_1.END:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, yearsPerPage - (0, date_utils_1.getYearsOffset)(this._activeDate, yearsPerPage) - 1);
                break;
            case keycodes_1.PAGE_UP:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, -yearsPerPage);
                break;
            case keycodes_1.PAGE_DOWN:
                this._activeDate = (0, date_utils_1.addYears)(this._activeDate, yearsPerPage);
                break;
            case keycodes_1.ENTER:
            case keycodes_1.SPACE:
                this._selectYear(this.activeYear);
                return;
            default:
                return;
        }
        if (!(0, date_utils_1.areDatesInSameView)(oldActiveDate, this._activeDate, this._view, YEARS_IN_VIEW, this._options.min, this._options.max)) {
            this._changeView("years");
        }
        this._removeHighlightFromCell(previousActiveCell);
        this._focusActiveCell(this.activeCell);
        event.preventDefault();
    }
    _getActiveYearCell() {
        const cells = selector_engine_1.default.find("td", this.datesContainer);
        const activeCell = Array.from(cells).find((cell) => {
            const cellYear = parseInt(cell.dataset.teYear, 10);
            return cellYear === this.activeYear;
        });
        return activeCell;
    }
    _setInitialDate() {
        if (this._input.value) {
            this._handleUserInput(this._input.value);
        }
        else if (this._options.startDate) {
            this._activeDate = new Date(this._options.startDate);
        }
        else {
            this._activeDate = new Date();
        }
    }
    close() {
        const closeEvent = event_handler_1.default.trigger(this._element, EVENT_CLOSE);
        if (!this._isOpen || closeEvent.defaultPrevented) {
            return;
        }
        this._removeDatepickerListeners();
        if (this._animations) {
            manipulator_1.default.addClass(this.container, this._classes.fadeOut);
        }
        if (this._options.inline) {
            this._closeDropdown();
        }
        else {
            this._closeModal();
        }
        this._isOpen = false;
        this._view = this._options.view;
        if (this.toggleButton) {
            this.toggleButton.focus();
        }
        else {
            this._input.focus();
        }
    }
    _closeDropdown() {
        const datepicker = selector_engine_1.default.findOne(DROPDOWN_CONTAINER_SELECTOR);
        const container = this._getContainer();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            if (datepicker) {
                container.removeChild(datepicker);
            }
            if (this._popper) {
                this._popper.destroy();
            }
        }
        datepicker.addEventListener("animationend", () => {
            if (datepicker) {
                container.removeChild(datepicker);
            }
            if (this._popper) {
                this._popper.destroy();
            }
        });
        this._removeFocusTrap();
    }
    _closeModal() {
        const backdrop = selector_engine_1.default.findOne(BACKDROP_SELECTOR);
        const datepicker = selector_engine_1.default.findOne(MODAL_CONTAINER_SELECTOR);
        if (!datepicker || !backdrop) {
            return;
        }
        if (this._animations) {
            manipulator_1.default.addClass(backdrop, this._classes.fadeOutShort);
            backdrop.addEventListener("animationend", () => {
                this._removePicker(backdrop, datepicker);
                this._scrollBar.reset();
            });
        }
        else {
            this._removePicker(backdrop, datepicker);
            this._scrollBar.reset();
        }
    }
    _removePicker(backdrop, datepicker) {
        const container = this._getContainer();
        container.removeChild(backdrop);
        container.removeChild(datepicker);
    }
    _removeFocusTrap() {
        if (this._focusTrap) {
            this._focusTrap.disable();
            this._focusTrap = null;
        }
    }
    _removeDatepickerListeners() {
        event_handler_1.default.off(this.nextButton, "click");
        event_handler_1.default.off(this.previousButton, "click");
        event_handler_1.default.off(this.viewChangeButton, "click");
        event_handler_1.default.off(this.okButton, "click");
        event_handler_1.default.off(this.cancelButton, "click");
        event_handler_1.default.off(this.clearButton, "click");
        event_handler_1.default.off(this.datesContainer, "click");
        event_handler_1.default.off(this.datesContainer, "keydown");
        event_handler_1.default.off(this.datesContainer, "focus");
        event_handler_1.default.off(this.datesContainer, "blur");
        event_handler_1.default.off(document, EVENT_CLICK_DATA_API);
    }
    dispose() {
        if (this._isOpen) {
            this.close();
        }
        this._removeInputAndToggleListeners();
        const generatedToggleButton = selector_engine_1.default.findOne(`#${this._toggleButtonId}`);
        if (generatedToggleButton) {
            this._element.removeChild(generatedToggleButton);
        }
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
        this._input = null;
        this._options = null;
        this._activeDate = null;
        this._selectedDate = null;
        this._selectedYear = null;
        this._selectedMonth = null;
        this._headerDate = null;
        this._headerYear = null;
        this._headerMonth = null;
        this._view = null;
        this._popper = null;
        this._focusTrap = null;
    }
    _removeInputAndToggleListeners() {
        event_handler_1.default.off(this._input, "input");
        event_handler_1.default.off(this._element, EVENT_CLICK_DATA_API, DATEPICKER_TOGGLE_SELECTOR);
        event_handler_1.default.off(this._element, "keydown", DATEPICKER_TOGGLE_SELECTOR);
    }
    handleOk() {
        this._confirmSelection(this._headerDate);
        this.close();
    }
    _selectDate(date, cell = this.activeCell) {
        const { min, max, filter, disablePast, disableFuture } = this._options;
        if ((0, date_utils_1.isDateDisabled)(date, min, max, filter, disablePast, disableFuture)) {
            return;
        }
        this._removeCurrentSelectionStyles();
        this._removeCurrentFocusStyles();
        this._addSelectedStyles(cell);
        this._selectedDate = date;
        this._selectedYear = (0, date_utils_1.getYear)(date);
        this._selectedMonth = (0, date_utils_1.getMonth)(date);
        this._headerDate = date;
        if (this._options.inline || this.options.confirmDateOnSelect) {
            this._confirmSelection(date);
            this.close();
        }
    }
    _selectYear(year, cell = this.activeCell) {
        this._removeCurrentSelectionStyles();
        this._removeCurrentFocusStyles();
        this._addSelectedStyles(cell);
        this._headerYear = year;
        this._asyncChangeView("months");
    }
    _selectMonth(month, cell = this.activeCell) {
        this._removeCurrentSelectionStyles();
        this._removeCurrentFocusStyles();
        this._addSelectedStyles(cell);
        this._headerMonth = month;
        this._asyncChangeView("days");
    }
    _removeSelectedStyles(cell) {
        if (cell) {
            cell.removeAttribute("data-te-datepicker-cell-selected");
        }
    }
    _addSelectedStyles(cell) {
        if (cell) {
            cell.setAttribute("data-te-datepicker-cell-selected", "");
        }
    }
    _confirmSelection(date) {
        if (date) {
            const dateString = this.formatDate(date);
            this._input.value = dateString;
            event_handler_1.default.trigger(this._element, EVENT_DATE_CHANGE, { date });
            event_handler_1.default.trigger(this._input, "input");
        }
    }
    handleCancel() {
        this._selectedDate = null;
        this._selectedYear = null;
        this._selectedMonth = null;
        this.close();
    }
    handleClear() {
        this._selectedDate = null;
        this._selectedMonth = null;
        this._selectedYear = null;
        this._headerDate = null;
        this._headerMonth = null;
        this._headerYear = null;
        this._removeCurrentSelectionStyles();
        this._input.value = "";
        this._setInitialDate();
        this._changeView("days");
        this._updateHeaderDate(this._activeDate, this._options.monthsShort, this._options.weekdaysShort);
    }
    _removeCurrentSelectionStyles() {
        const currentSelected = selector_engine_1.default.findOne("[data-te-datepicker-cell-selected]", this.container);
        if (currentSelected) {
            currentSelected.removeAttribute("data-te-datepicker-cell-selected");
        }
    }
    _removeCurrentFocusStyles() {
        const currentFocused = selector_engine_1.default.findOne("[data-te-datepicker-cell-focused]", this.container);
        if (currentFocused) {
            currentFocused.removeAttribute("data-te-datepicker-cell-focused");
        }
    }
    formatDate(date) {
        const d = (0, date_utils_1.getDate)(date);
        const dd = this._addLeadingZero((0, date_utils_1.getDate)(date));
        const ddd = this._options.weekdaysShort[(0, date_utils_1.getDayNumber)(date)];
        const dddd = this._options.weekdaysFull[(0, date_utils_1.getDayNumber)(date)];
        const m = (0, date_utils_1.getMonth)(date) + 1;
        const mm = this._addLeadingZero((0, date_utils_1.getMonth)(date) + 1);
        const mmm = this._options.monthsShort[(0, date_utils_1.getMonth)(date)];
        const mmmm = this._options.monthsFull[(0, date_utils_1.getMonth)(date)];
        const yy = (0, date_utils_1.getYear)(date).toString().length === 2
            ? (0, date_utils_1.getYear)(date)
            : (0, date_utils_1.getYear)(date).toString().slice(2, 4);
        const yyyy = (0, date_utils_1.getYear)(date);
        const preformatted = this._options.format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
        let formatted = "";
        preformatted.forEach((datePart) => {
            switch (datePart) {
                case "dddd":
                    datePart = datePart.replace(datePart, dddd);
                    break;
                case "ddd":
                    datePart = datePart.replace(datePart, ddd);
                    break;
                case "dd":
                    datePart = datePart.replace(datePart, dd);
                    break;
                case "d":
                    datePart = datePart.replace(datePart, d);
                    break;
                case "mmmm":
                    datePart = datePart.replace(datePart, mmmm);
                    break;
                case "mmm":
                    datePart = datePart.replace(datePart, mmm);
                    break;
                case "mm":
                    datePart = datePart.replace(datePart, mm);
                    break;
                case "m":
                    datePart = datePart.replace(datePart, m);
                    break;
                case "yyyy":
                    datePart = datePart.replace(datePart, yyyy);
                    break;
                case "yy":
                    datePart = datePart.replace(datePart, yy);
                    break;
                default:
            }
            formatted += datePart;
        });
        return formatted;
    }
    _addLeadingZero(value) {
        return parseInt(value, 10) < 10 ? `0${value}` : value;
    }
    _pickDay(day, el) {
        const date = (0, date_utils_1.convertStringToDate)(day);
        const { min, max, filter, disablePast, disableFuture } = this._options;
        if ((0, date_utils_1.isDateDisabled)(date, min, max, filter, disablePast, disableFuture)) {
            return;
        }
        this._activeDate = date;
        this._selectDate(date, el);
    }
    _pickYear(year) {
        const { min, max, disablePast, disableFuture } = this._options;
        if ((0, date_utils_1.isYearDisabled)(year, min, max, disablePast, disableFuture)) {
            return;
        }
        const newDate = (0, date_utils_1.createDate)(year, this.activeMonth, this.activeDay);
        this._activeDate = newDate;
        this._selectedDate = newDate;
        this._selectYear(year);
    }
    _pickMonth(month, year) {
        const { min, max, disablePast, disableFuture } = this._options;
        if ((0, date_utils_1.isMonthDisabled)(month, year, min, max, disablePast, disableFuture) ||
            (0, date_utils_1.isYearDisabled)(year, min, max, disablePast, disableFuture)) {
            return;
        }
        const newDate = (0, date_utils_1.createDate)(year, month, this.activeDay);
        this._activeDate = newDate;
        this._selectMonth(month);
    }
    nextMonth() {
        const nextMonth = (0, date_utils_1.addMonths)(this._activeDate, 1);
        const template = (0, templates_1.createDayViewTemplate)(nextMonth, this._headerDate, this._options, this._classes);
        this._activeDate = nextMonth;
        this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`;
        this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
        this.datesContainer.innerHTML = template;
    }
    previousMonth() {
        const previousMonth = (0, date_utils_1.addMonths)(this._activeDate, -1);
        this._activeDate = previousMonth;
        const template = (0, templates_1.createDayViewTemplate)(previousMonth, this._headerDate, this._options, this._classes);
        this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`;
        this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
        this.datesContainer.innerHTML = template;
    }
    nextYear() {
        const nextYear = (0, date_utils_1.addYears)(this._activeDate, 1);
        this._activeDate = nextYear;
        this.viewChangeButton.textContent = `${this.activeYear}`;
        this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
        const template = (0, templates_1.createMonthViewTemplate)(this.activeYear, this._selectedYear, this._selectedMonth, this._options, MONTHS_IN_ROW, this._classes);
        this.datesContainer.innerHTML = template;
    }
    previousYear() {
        const previousYear = (0, date_utils_1.addYears)(this._activeDate, -1);
        this._activeDate = previousYear;
        this.viewChangeButton.textContent = `${this.activeYear}`;
        this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
        const template = (0, templates_1.createMonthViewTemplate)(this.activeYear, this._selectedYear, this._selectedMonth, this._options, MONTHS_IN_ROW, this._classes);
        this.datesContainer.innerHTML = template;
    }
    nextYears() {
        const nextYear = (0, date_utils_1.addYears)(this._activeDate, 24);
        this._activeDate = nextYear;
        const template = (0, templates_1.createYearViewTemplate)(nextYear, this._selectedYear, this._options, YEARS_IN_VIEW, YEARS_IN_ROW, this._classes);
        this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
        this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
        this.datesContainer.innerHTML = template;
    }
    previousYears() {
        const previousYear = (0, date_utils_1.addYears)(this._activeDate, -24);
        this._activeDate = previousYear;
        const template = (0, templates_1.createYearViewTemplate)(previousYear, this._selectedYear, this._options, YEARS_IN_VIEW, YEARS_IN_ROW, this._classes);
        this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
        this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
        this.datesContainer.innerHTML = template;
    }
    _asyncChangeView(view) {
        setTimeout(() => {
            this._changeView(view);
        }, 0);
    }
    _changeView(view) {
        this._view = view;
        this.datesContainer.blur();
        if (view === "days") {
            this.datesContainer.innerHTML = (0, templates_1.createDayViewTemplate)(this._activeDate, this._headerDate, this._options, this._classes);
        }
        if (view === "months") {
            this.datesContainer.innerHTML = (0, templates_1.createMonthViewTemplate)(this.activeYear, this._selectedYear, this._selectedMonth, this._options, MONTHS_IN_ROW, this._classes);
        }
        if (view === "years") {
            this.datesContainer.innerHTML = (0, templates_1.createYearViewTemplate)(this._activeDate, this._selectedYear, this._options, YEARS_IN_VIEW, YEARS_IN_ROW, this._classes);
        }
        this.datesContainer.focus();
        this._updateViewControlsAndAttributes(view);
        this._updateControlsDisabledState();
    }
    _updateViewControlsAndAttributes(view) {
        if (view === "days") {
            this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`;
            this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
            this.viewChangeButton.setAttribute("aria-label", this._options.switchToMultiYearViewLabel);
            this.previousButton.setAttribute("aria-label", this._options.prevMonthLabel);
            this.nextButton.setAttribute("aria-label", this._options.nextMonthLabel);
        }
        if (view === "months") {
            this.viewChangeButton.textContent = `${this.activeYear}`;
            this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
            this.viewChangeButton.setAttribute("aria-label", this._options.switchToDayViewLabel);
            this.previousButton.setAttribute("aria-label", this._options.prevYearLabel);
            this.nextButton.setAttribute("aria-label", this._options.nextYearLabel);
        }
        if (view === "years") {
            this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
            this.viewChangeButton.innerHTML += (0, templates_1.createViewChangeButtonIcon)(this._options, this._classes);
            this.viewChangeButton.setAttribute("aria-label", this._options.switchToMonthViewLabel);
            this.previousButton.setAttribute("aria-label", this._options.prevMultiYearLabel);
            this.nextButton.setAttribute("aria-label", this._options.nextMultiYearLabel);
        }
    }
    _updateControlsDisabledState() {
        if ((0, date_utils_1.isNextDateDisabled)(this._options.disableFuture, this._activeDate, this._view, YEARS_IN_VIEW, this._options.min, this._options.max, this.lastYearInView, this.firstYearInView)) {
            this.nextButton.disabled = true;
        }
        else {
            this.nextButton.disabled = false;
        }
        if ((0, date_utils_1.isPreviousDateDisabled)(this._options.disablePast, this._activeDate, this._view, YEARS_IN_VIEW, this._options.min, this._options.max, this.lastYearInView, this.firstYearInView)) {
            this.previousButton.disabled = true;
        }
        else {
            this.previousButton.disabled = false;
        }
    }
    _handleUserInput(input) {
        const delimeters = this._getDelimeters(this._options.format);
        const date = this._parseDate(input, this._options.format, delimeters);
        if ((0, date_utils_1.isValidDate)(date)) {
            this._activeDate = date;
            this._selectedDate = date;
            this._selectedYear = (0, date_utils_1.getYear)(date);
            this._selectedMonth = (0, date_utils_1.getMonth)(date);
            this._headerDate = date;
        }
        else {
            this._activeDate = new Date();
            this._selectedDate = null;
            this._selectedMonth = null;
            this._selectedYear = null;
            this._headerDate = null;
            this._headerMonth = null;
            this._headerYear = null;
        }
    }
    _getDelimeters(format) {
        return format.match(/[^(dmy)]{1,}/g);
    }
    _parseDate(dateString, format, delimeters) {
        let delimeterPattern;
        if (delimeters[0] !== delimeters[1]) {
            delimeterPattern = delimeters[0] + delimeters[1];
        }
        else {
            delimeterPattern = delimeters[0];
        }
        const regExp = new RegExp(`[${delimeterPattern}]`);
        const dateParts = dateString.split(regExp);
        const formatParts = format.split(regExp);
        const isMonthString = format.indexOf("mmm") !== -1;
        const datesArray = [];
        for (let i = 0; i < formatParts.length; i++) {
            if (formatParts[i].indexOf("yy") !== -1) {
                datesArray[0] = { value: dateParts[i], format: formatParts[i] };
            }
            if (formatParts[i].indexOf("m") !== -1) {
                datesArray[1] = { value: dateParts[i], format: formatParts[i] };
            }
            if (formatParts[i].indexOf("d") !== -1 && formatParts[i].length <= 2) {
                datesArray[2] = { value: dateParts[i], format: formatParts[i] };
            }
        }
        let monthsNames;
        if (format.indexOf("mmmm") !== -1) {
            monthsNames = this._options.monthsFull;
        }
        else {
            monthsNames = this._options.monthsShort;
        }
        const year = Number(datesArray[0].value);
        const month = isMonthString
            ? this.getMonthNumberByMonthName(datesArray[1].value, monthsNames)
            : Number(datesArray[1].value) - 1;
        const day = Number(datesArray[2].value);
        const parsedDate = (0, date_utils_1.createDate)(year, month, day);
        return parsedDate;
    }
    getMonthNumberByMonthName(monthValue, monthLabels) {
        return monthLabels.findIndex((monthLabel) => monthLabel === monthValue);
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
exports.default = Datepicker;
//# sourceMappingURL=index.js.map