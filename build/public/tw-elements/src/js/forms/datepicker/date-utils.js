"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areDatesInSameView = exports.isPreviousDateDisabled = exports.isNextDateDisabled = exports.isYearDisabled = exports.isMonthDisabled = exports.isDateDisabled = exports.getStartYear = exports.getYearsOffset = exports.isSameDate = exports.compareDates = exports.isValidDate = exports.convertStringToDate = exports.createDate = exports.addDays = exports.addMonths = exports.addYears = exports.getToday = exports.getMonthEnd = exports.getDaysInMonth = exports.getFirstDayOfWeek = exports.getYear = exports.getMonth = exports.getDayNumber = exports.getDate = void 0;
function getDate(date) {
    return date.getDate();
}
exports.getDate = getDate;
function getDayNumber(date) {
    return date.getDay();
}
exports.getDayNumber = getDayNumber;
function getMonth(date) {
    return date.getMonth();
}
exports.getMonth = getMonth;
function getYear(date) {
    return date.getFullYear();
}
exports.getYear = getYear;
function getFirstDayOfWeek(year, month, options) {
    const firstDayIndex = options.startDay;
    const sundayIndex = firstDayIndex > 0 ? 7 - firstDayIndex : 0;
    const date = new Date(year, month);
    const index = date.getDay() + sundayIndex;
    const newIndex = index >= 7 ? index - 7 : index;
    return newIndex;
}
exports.getFirstDayOfWeek = getFirstDayOfWeek;
function getDaysInMonth(date) {
    return getMonthEnd(date).getDate();
}
exports.getDaysInMonth = getDaysInMonth;
function getMonthEnd(date) {
    return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}
exports.getMonthEnd = getMonthEnd;
function getToday() {
    return new Date();
}
exports.getToday = getToday;
function addYears(date, years) {
    return addMonths(date, years * 12);
}
exports.addYears = addYears;
function addMonths(date, months) {
    const month = createDate(date.getFullYear(), date.getMonth() + months, date.getDate());
    const dayOfPreviousMonth = getDate(date);
    const dayOfNewMonth = getDate(month);
    if (dayOfPreviousMonth !== dayOfNewMonth) {
        month.setDate(0);
    }
    return month;
}
exports.addMonths = addMonths;
function addDays(date, days) {
    return createDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
exports.addDays = addDays;
function createDate(year, month, day) {
    const result = new Date(year, month, day);
    if (year >= 0 && year < 100) {
        result.setFullYear(result.getFullYear() - 1900);
    }
    return result;
}
exports.createDate = createDate;
function convertStringToDate(dateString) {
    const dateArr = dateString.split("-");
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2];
    return createDate(year, month, day);
}
exports.convertStringToDate = convertStringToDate;
function isValidDate(date) {
    return !Number.isNaN(date.getTime());
}
exports.isValidDate = isValidDate;
function compareDates(date1, date2) {
    return (getYear(date1) - getYear(date2) ||
        getMonth(date1) - getMonth(date2) ||
        getDate(date1) - getDate(date2));
}
exports.compareDates = compareDates;
function isSameDate(date1, date2) {
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    return date1.getTime() === date2.getTime();
}
exports.isSameDate = isSameDate;
function getYearsOffset(activeDate, yearsInView) {
    const activeYear = getYear(activeDate);
    const yearsDifference = activeYear - getStartYear();
    return modulo(yearsDifference, yearsInView);
}
exports.getYearsOffset = getYearsOffset;
function modulo(a, b) {
    return ((a % b) + b) % b;
}
function getStartYear(yearsInView, minDate, maxDate) {
    let startYear = 0;
    if (maxDate) {
        const maxYear = getYear(maxDate);
        startYear = maxYear - yearsInView + 1;
    }
    else if (minDate) {
        startYear = getYear(minDate);
    }
    return startYear;
}
exports.getStartYear = getStartYear;
function isDateDisabled(date, minDate, maxDate, filter, disabledPast, disabledFuture) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const isBeforeMin = minDate && compareDates(date, minDate) <= -1;
    const isAfterMax = maxDate && compareDates(date, maxDate) >= 1;
    const isDisabledPast = disabledPast && compareDates(date, currentDate) <= -1;
    const isDisabledFuture = disabledFuture && compareDates(date, currentDate) >= 1;
    const isDisabled = filter && filter(date) === false;
    return (isBeforeMin ||
        isAfterMax ||
        isDisabled ||
        isDisabledPast ||
        isDisabledFuture);
}
exports.isDateDisabled = isDateDisabled;
function isMonthDisabled(month, year, minDate, maxDate, disabledPast, disabledFuture) {
    const currentDate = new Date();
    const maxYear = maxDate && getYear(maxDate);
    const maxMonth = maxDate && getMonth(maxDate);
    const minYear = minDate && getYear(minDate);
    const minMonth = minDate && getMonth(minDate);
    const currentYear = getYear(currentDate);
    const currentMonth = getMonth(currentDate);
    const isMonthAndYearAfterMax = maxMonth &&
        maxYear &&
        (year > maxYear || (year === maxYear && month > maxMonth));
    const isMonthAndYearBeforeMin = minMonth &&
        minYear &&
        (year < minYear || (year === minYear && month < minMonth));
    const isMonthAndYearDisabledPast = disabledPast &&
        (year < currentYear || (year === currentYear && month < currentMonth));
    const isMonthAndYearDisabledFuture = disabledFuture &&
        (year > currentYear || (year === currentYear && month > currentMonth));
    return (isMonthAndYearAfterMax ||
        isMonthAndYearBeforeMin ||
        isMonthAndYearDisabledPast ||
        isMonthAndYearDisabledFuture);
}
exports.isMonthDisabled = isMonthDisabled;
function isYearDisabled(year, minDate, maxDate, disabledPast, disabledFuture) {
    const min = minDate && getYear(minDate);
    const max = maxDate && getYear(maxDate);
    const currentYear = getYear(new Date());
    const isAfterMax = max && year > max;
    const isBeforeMin = min && year < min;
    const isDisabledPast = disabledPast && year < currentYear;
    const isDisabledFuture = disabledFuture && year > currentYear;
    return isAfterMax || isBeforeMin || isDisabledPast || isDisabledFuture;
}
exports.isYearDisabled = isYearDisabled;
function isNextDateDisabled(disabledFuture, activeDate, view, yearsInView, minDate, maxDate, lastYearInView, firstYearInView) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (disabledFuture && maxDate && compareDates(maxDate, currentDate) < 0) {
        maxDate = currentDate;
    }
    else if (disabledFuture) {
        maxDate = currentDate;
    }
    return (maxDate &&
        areDatesInSameView(activeDate, maxDate, view, yearsInView, minDate, maxDate, lastYearInView, firstYearInView));
}
exports.isNextDateDisabled = isNextDateDisabled;
function isPreviousDateDisabled(disabledPast, activeDate, view, yearsInView, minDate, maxDate, lastYearInView, firstYearInView) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (disabledPast && minDate && compareDates(minDate, currentDate) < 0) {
        minDate = currentDate;
    }
    else if (disabledPast) {
        minDate = currentDate;
    }
    return (minDate &&
        areDatesInSameView(activeDate, minDate, view, yearsInView, minDate, maxDate, lastYearInView, firstYearInView));
}
exports.isPreviousDateDisabled = isPreviousDateDisabled;
function areDatesInSameView(date1, date2, view, yearsInView, minDate, maxDate, lastYearInView, firstYearInView) {
    if (view === "days") {
        return (getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2));
    }
    if (view === "months") {
        return getYear(date1) === getYear(date2);
    }
    if (view === "years") {
        return (getYear(date2) >= firstYearInView && getYear(date2) <= lastYearInView);
    }
    return false;
}
exports.areDatesInSameView = areDatesInSameView;
//# sourceMappingURL=date-utils.js.map