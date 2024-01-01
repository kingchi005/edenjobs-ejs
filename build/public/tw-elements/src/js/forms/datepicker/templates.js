"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToggleButtonTemplate = exports.createYearViewTemplate = exports.createMonthViewTemplate = exports.createDayViewTemplate = exports.createViewChangeButtonIcon = exports.createContainer = exports.getBackdropTemplate = exports.getDatepickerTemplate = void 0;
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const util_1 = require("../../util");
const date_utils_1 = require("./date-utils");
const MODAL_CONTAINER_REF = "data-te-datepicker-modal-container-ref";
const DROPDOWN_CONTAINER_REF = "data-te-datepicker-dropdown-container-ref";
const BACKDROP_REF = "data-te-dropdown-backdrop-ref";
const DATE_TEXT_REF = "data-te-datepicker-date-text-ref";
const VIEW_REF = "data-te-datepicker-view-ref";
const PREVIOUS_BUTTON_REF = "data-te-datepicker-previous-button-ref";
const NEXT_BUTTON_REF = "data-te-datepicker-next-button-ref";
const OK_BUTTON_REF = "data-te-datepicker-ok-button-ref";
const CANCEL_BUTTON_REF = "data-te-datepicker-cancel-button-ref";
const CLEAR_BUTTON_REF = "data-te-datepicker-clear-button-ref";
const VIEW_CHANGE_BUTTON_REF = "data-te-datepicker-view-change-button-ref";
function getDatepickerTemplate(date, selectedDate, selectedYear, selectedMonth, options, monthsInRow, yearsInView, yearsInRow, id, classes) {
    const month = (0, date_utils_1.getMonth)(date);
    const year = (0, date_utils_1.getYear)(date);
    const day = (0, date_utils_1.getDate)(date);
    const dayNumber = (0, date_utils_1.getDayNumber)(date);
    const template = (0, util_1.element)("div");
    const inlineContent = `
        ${createMainContent(date, month, year, selectedDate, selectedYear, selectedMonth, options, monthsInRow, yearsInView, yearsInRow, classes)}
    `;
    const modalContent = `
      ${createHeader(day, dayNumber, month, options, classes)}
      ${createMainContent(date, month, year, selectedDate, selectedYear, selectedMonth, options, monthsInRow, yearsInView, yearsInRow, classes)}
    `;
    if (options.inline) {
        manipulator_1.default.addClass(template, classes.datepickerDropdownContainer);
        template.setAttribute(DROPDOWN_CONTAINER_REF, id);
        template.innerHTML = inlineContent;
    }
    else {
        manipulator_1.default.addClass(template, classes.modalContainer);
        template.setAttribute(MODAL_CONTAINER_REF, id);
        template.innerHTML = modalContent;
    }
    return template;
}
exports.getDatepickerTemplate = getDatepickerTemplate;
function getBackdropTemplate(backdropClasses) {
    const backdrop = (0, util_1.element)("div");
    manipulator_1.default.addClass(backdrop, backdropClasses);
    backdrop.setAttribute(BACKDROP_REF, "");
    return backdrop;
}
exports.getBackdropTemplate = getBackdropTemplate;
function createContainer(modalContainerClasses) {
    const container = (0, util_1.element)("div");
    manipulator_1.default.addClass(container, modalContainerClasses);
    container.setAttribute(MODAL_CONTAINER_REF, "");
    return container;
}
exports.createContainer = createContainer;
function createHeader(day, dayNumber, month, options, classes) {
    return `
      <div class="${classes.datepickerHeader}" data-te-datepicker-header>
        <div class="${classes.datepickerTitle}">
          <span class="${classes.datepickerTitleText}">${options.title}</span>
        </div>
        <div class="${classes.datepickerDate}">
          <span class="${classes.datepickerDateText}" ${DATE_TEXT_REF} >${options.weekdaysShort[dayNumber]}, ${options.monthsShort[month]} ${day}</span>
        </div>
      </div>
    `;
}
function createMainContent(date, month, year, selectedDate, selectedYear, selectedMonth, options, monthsInRow, yearsInView, yearsInRow, classes) {
    let mainContentTemplate;
    if (options.inline) {
        mainContentTemplate = `
    <div class="${classes.datepickerMain}">
      ${createControls(month, year, options, classes)}
      <div class="${classes.datepickerView}" ${VIEW_REF} tabindex="0">
        ${createViewTemplate(date, year, selectedDate, selectedYear, selectedMonth, options, monthsInRow, yearsInView, yearsInRow, classes)}
      </div>
    </div>
  `;
    }
    else {
        mainContentTemplate = `
    <div class="${classes.datepickerMain}">
      ${createControls(month, year, options, classes)}
      <div class="${classes.datepickerView}" ${VIEW_REF} tabindex="0">
        ${createViewTemplate(date, year, selectedDate, selectedYear, selectedMonth, options, monthsInRow, yearsInView, yearsInRow, classes)}
      </div>
      ${createFooter(options, classes)}
    </div>
  `;
    }
    return mainContentTemplate;
}
function createViewTemplate(date, year, selectedDate, selectedYear, selectedMonth, options, monthsInRow, yearsInView, yearsInRow, classes) {
    let viewTemplate;
    if (options.view === "days") {
        viewTemplate = createDayViewTemplate(date, selectedDate, options, classes);
    }
    else if (options.view === "months") {
        viewTemplate = createMonthViewTemplate(year, selectedYear, selectedMonth, options, monthsInRow, classes);
    }
    else {
        viewTemplate = createYearViewTemplate(date, selectedYear, options, yearsInView, yearsInRow, classes);
    }
    return viewTemplate;
}
function createControls(month, year, options, classes) {
    return `
    <div class="${classes.datepickerDateControls}">
      <button class="${classes.datepickerViewChangeButton}" aria-label="${options.switchToMultiYearViewLabel}" ${VIEW_CHANGE_BUTTON_REF}>
        ${options.monthsFull[month]} ${year} ${createViewChangeButtonIcon(options, classes)}
      </button>
      <div class="${classes.datepickerArrowControls}">
        <button class="${classes.datepickerPreviousButton}" aria-label="${options.prevMonthLabel}" ${PREVIOUS_BUTTON_REF}>${options.changeMonthIconTemplate}</button>
        <button class="${classes.datepickerNextButton}" aria-label="${options.nextMonthLabel}" ${NEXT_BUTTON_REF}>${options.changeMonthIconTemplate}</button>
      </div>
    </div>
    `;
}
function createViewChangeButtonIcon(options, classes) {
    return `
  <span class="${classes.datepickerViewChangeIcon}">
  ${options.viewChangeIconTemplate}
  </span>
  `;
}
exports.createViewChangeButtonIcon = createViewChangeButtonIcon;
function createFooter(options, classes) {
    const okBtn = `<button class="${classes.datepickerFooterBtn}" aria-label="${options.okBtnLabel}" ${OK_BUTTON_REF}>${options.okBtnText}</button>`;
    const cancelButton = `<button class="${classes.datepickerFooterBtn}" aria-label="${options.cancelBtnLabel}" ${CANCEL_BUTTON_REF}>${options.cancelBtnText}</button>`;
    const clearButton = `<button class="${classes.datepickerFooterBtn} ${classes.datepickerClearBtn}" aria-label="${options.clearBtnLabel}" ${CLEAR_BUTTON_REF}>${options.clearBtnText}</button>`;
    return `
        <div class="${classes.datepickerFooter}">
          
        ${options.removeClearBtn ? "" : clearButton}
        ${options.removeCancelBtn ? "" : cancelButton}
        ${options.removeOkBtn ? "" : okBtn}
        </div>
      `;
}
function createDayViewTemplate(date, headerDate, options, classes) {
    const dates = getDatesArray(date, headerDate, options);
    const dayNames = options.weekdaysNarrow;
    const tableHeadContent = `
      <tr>
        ${dayNames
        .map((name, i) => {
        return `<th class="${classes.datepickerDayHeading}" scope="col" aria-label="${options.weekdaysFull[i]}">${name}</th>`;
    })
        .join("")}
      </tr>
    `;
    const tableBodyContent = dates
        .map((week) => {
        return `
        <tr>
          ${week
            .map((day) => {
            return `
              <td
              class="${classes.datepickerCell} ${classes.datepickerCellSmall}"
              data-te-date="${(0, date_utils_1.getYear)(day.date)}-${(0, date_utils_1.getMonth)(day.date)}-${(0, date_utils_1.getDate)(day.date)}"
              aria-label="${day.date}"
              aria-selected="${day.isSelected}"
              ${day.isSelected ? "data-te-datepicker-cell-selected" : ""}
              ${!day.currentMonth || day.disabled
                ? "data-te-datepicker-cell-disabled"
                : ""}
              ${day.isToday ? "data-te-datepicker-cell-current" : ""}
              >
                <div
                  class="${classes.datepickerCellContent} ${classes.datepickerCellContentSmall}"
                  style="${day.currentMonth ? "display: block" : "display: none"}"
                  >
                  ${day.dayNumber}
                  </div>
              </td>
            `;
        })
            .join("")}
        </tr>
      `;
    })
        .join("");
    return `
      <table class="${classes.datepickerTable}">
        <thead>
          ${tableHeadContent}
        </thead>
        <tbody>
         ${tableBodyContent}
        </tbody>
      </table>
    `;
}
exports.createDayViewTemplate = createDayViewTemplate;
function getDatesArray(activeDate, headerDate, options) {
    const dates = [];
    const month = (0, date_utils_1.getMonth)(activeDate);
    const previousMonth = (0, date_utils_1.getMonth)((0, date_utils_1.addMonths)(activeDate, -1));
    const nextMonth = (0, date_utils_1.getMonth)((0, date_utils_1.addMonths)(activeDate, 1));
    const year = (0, date_utils_1.getYear)(activeDate);
    const firstDay = (0, date_utils_1.getFirstDayOfWeek)(year, month, options);
    const daysInMonth = (0, date_utils_1.getDaysInMonth)(activeDate);
    const daysInPreviousMonth = (0, date_utils_1.getDaysInMonth)((0, date_utils_1.addMonths)(activeDate, -1));
    const daysInWeek = 7;
    let dayNumber = 1;
    let isCurrentMonth = false;
    for (let i = 1; i < daysInWeek; i++) {
        const week = [];
        if (i === 1) {
            const previousMonthDay = daysInPreviousMonth - firstDay + 1;
            for (let j = previousMonthDay; j <= daysInPreviousMonth; j++) {
                const date = (0, date_utils_1.createDate)(year, previousMonth, j);
                week.push({
                    date,
                    currentMonth: isCurrentMonth,
                    isSelected: headerDate && (0, date_utils_1.isSameDate)(date, headerDate),
                    isToday: (0, date_utils_1.isSameDate)(date, (0, date_utils_1.getToday)()),
                    dayNumber: (0, date_utils_1.getDate)(date),
                });
            }
            isCurrentMonth = true;
            const daysLeft = daysInWeek - week.length;
            for (let j = 0; j < daysLeft; j++) {
                const date = (0, date_utils_1.createDate)(year, month, dayNumber);
                week.push({
                    date,
                    currentMonth: isCurrentMonth,
                    isSelected: headerDate && (0, date_utils_1.isSameDate)(date, headerDate),
                    isToday: (0, date_utils_1.isSameDate)(date, (0, date_utils_1.getToday)()),
                    dayNumber: (0, date_utils_1.getDate)(date),
                    disabled: (0, date_utils_1.isDateDisabled)(date, options.min, options.max, options.filter, options.disablePast, options.disableFuture),
                });
                dayNumber++;
            }
        }
        else {
            for (let j = 1; j < 8; j++) {
                if (dayNumber > daysInMonth) {
                    dayNumber = 1;
                    isCurrentMonth = false;
                }
                const date = (0, date_utils_1.createDate)(year, isCurrentMonth ? month : nextMonth, dayNumber);
                week.push({
                    date,
                    currentMonth: isCurrentMonth,
                    isSelected: headerDate && (0, date_utils_1.isSameDate)(date, headerDate),
                    isToday: (0, date_utils_1.isSameDate)(date, (0, date_utils_1.getToday)()),
                    dayNumber: (0, date_utils_1.getDate)(date),
                    disabled: (0, date_utils_1.isDateDisabled)(date, options.min, options.max, options.filter, options.disablePast, options.disableFuture),
                });
                dayNumber++;
            }
        }
        dates.push(week);
    }
    return dates;
}
function createMonthViewTemplate(year, selectedYear, selectedMonth, options, monthsInRow, classes) {
    const months = getMonthsArray(options, monthsInRow);
    const currentMonth = (0, date_utils_1.getMonth)((0, date_utils_1.getToday)());
    const currentYear = (0, date_utils_1.getYear)((0, date_utils_1.getToday)());
    const tableBodyContent = `
      ${months
        .map((row) => {
        return `
          <tr>
            ${row
            .map((month) => {
            const monthIndex = options.monthsShort.indexOf(month);
            return `
                <td class="${classes.datepickerCell} ${classes.datepickerCellLarge}"
                ${(0, date_utils_1.isMonthDisabled)(monthIndex, year, options.min, options.max, options.disablePast, options.disableFuture)
                ? "data-te-datepicker-cell-disabled"
                : ""}
                
                data-te-month="${monthIndex}" data-te-year="${year}" aria-label="${month}, ${year}"
                ${monthIndex === selectedMonth && year === selectedYear
                ? "data-te-datepicker-cell-selected"
                : ""}
                ${monthIndex === currentMonth && year === currentYear
                ? "data-te-datepicker-cell-current"
                : ""}" data-te-month="${monthIndex}" data-te-year="${year}" aria-label="${month}, ${year}">
                  <div class="${classes.datepickerCellContent} ${classes.datepickerCellContentLarge}">${month}</div>
                </td>
              `;
        })
            .join("")}
          </tr>
        `;
    })
        .join("")}
    `;
    return `
      <table class="${classes.datepickerTable}">
        <tbody>
         ${tableBodyContent}
        </tbody>
      </table>
    `;
}
exports.createMonthViewTemplate = createMonthViewTemplate;
function getMonthsArray(options, monthsInRow) {
    const months = [];
    let row = [];
    for (let i = 0; i < options.monthsShort.length; i++) {
        row.push(options.monthsShort[i]);
        if (row.length === monthsInRow) {
            const monthsRow = row;
            months.push(monthsRow);
            row = [];
        }
    }
    return months;
}
function createYearViewTemplate(date, selectedYear, options, yearsInView, yearsInRow, classes) {
    const years = getYearsArray(date, yearsInView, yearsInRow);
    const currentYear = (0, date_utils_1.getYear)((0, date_utils_1.getToday)());
    const tableBodyContent = `
    ${years
        .map((row) => {
        return `
        <tr>
          ${row
            .map((year) => {
            return `
              <td class="${classes.datepickerCell} ${classes.datepickerCellLarge}"  aria-label="${year}" data-te-year="${year}"
              ${(0, date_utils_1.isYearDisabled)(year, options.min, options.max, options.disablePast, options.disableFuture)
                ? "data-te-datepicker-cell-disabled"
                : ""}
              ${year === selectedYear ? "data-te-datepicker-cell-selected" : ""}
              ${year === currentYear ? "data-te-datepicker-cell-current" : ""}
              >
                <div class="${classes.datepickerCellContent} ${classes.datepickerCellContentLarge}">${year}</div>
              </td>
            `;
        })
            .join("")}
        </tr>
      `;
    })
        .join("")}
  `;
    return `
      <table class="${classes.datepickerTable}">
        <tbody>
        ${tableBodyContent}
        </tbody>
      </table>
    `;
}
exports.createYearViewTemplate = createYearViewTemplate;
function getYearsArray(date, yearsInView, yearsInRow) {
    const years = [];
    const activeYear = (0, date_utils_1.getYear)(date);
    const yearsOffset = (0, date_utils_1.getYearsOffset)(date, yearsInView);
    const firstYearInView = activeYear - yearsOffset;
    let row = [];
    for (let i = 0; i < yearsInView; i++) {
        row.push(firstYearInView + i);
        if (row.length === yearsInRow) {
            const yearsRow = row;
            years.push(yearsRow);
            row = [];
        }
    }
    return years;
}
function getToggleButtonTemplate(id, toggleBtnClasses) {
    return `
    <button id="${id}" type="button" class="${toggleBtnClasses}" data-te-datepicker-toggle-button-ref data-te-datepicker-toggle-ref>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
      </svg>  
    </button>
  `;
}
exports.getToggleButtonTemplate = getToggleButtonTemplate;
//# sourceMappingURL=templates.js.map