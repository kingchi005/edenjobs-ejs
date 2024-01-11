"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._convertHourToNumber = exports._verifyMaxTimeHourAndAddDisabledClass = exports._verifyMinTimeMinutesTipsAndAddDisabledClass = exports._verifyMaxTimeMinutesTipsAndAddDisabledClass = exports._verifyMinTimeHourAndAddDisabledClass = exports.setMaxTime = exports.setMinTime = exports.compareTimes = exports.takeValue = exports.checkValueBeforeAccept = exports.toggleClassHandler = exports.formatToAmPm = exports.formatNormalHours = exports.findMousePosition = exports.checkBrowser = void 0;
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const ATTR_TIMEPICKER_DISABLED = "data-te-timepicker-disabled";
const ATTR_TIMEPICKER_ACTIVE = "data-te-timepicker-active";
const formatToAmPm = (date) => {
    if (date === "")
        return;
    let hours;
    let minutes;
    let amOrPm;
    let originalHours;
    if (isValidDate(date)) {
        hours = date.getHours();
        originalHours = hours;
        minutes = date.getMinutes();
        hours %= 12;
        if (originalHours === 0 && hours === 0) {
            amOrPm = "AM";
        }
        hours = hours || 12;
        if (amOrPm === undefined) {
            amOrPm = Number(originalHours) >= 12 ? "PM" : "AM";
        }
        minutes = minutes < 10 ? `0${minutes}` : minutes;
    }
    else {
        [hours, minutes, amOrPm] = takeValue(date, false);
        originalHours = hours;
        hours %= 12;
        if (originalHours === 0 && hours === 0) {
            amOrPm = "AM";
        }
        hours = hours || 12;
        if (amOrPm === undefined) {
            amOrPm = Number(originalHours) >= 12 ? "PM" : "AM";
        }
    }
    return {
        hours,
        minutes,
        amOrPm,
    };
};
exports.formatToAmPm = formatToAmPm;
const isValidDate = (date) => {
    return (date &&
        Object.prototype.toString.call(date) === "[object Date]" &&
        !Number.isNaN(date));
};
const formatNormalHours = (date) => {
    if (date === "")
        return;
    let hours;
    let minutes;
    if (!isValidDate(date)) {
        [hours, minutes] = takeValue(date, false);
    }
    else {
        hours = date.getHours();
        minutes = date.getMinutes();
    }
    minutes = Number(minutes) < 10 ? `0${Number(minutes)}` : minutes;
    return {
        hours,
        minutes,
    };
};
exports.formatNormalHours = formatNormalHours;
const toggleClassHandler = (event, selector, classes) => {
    return event_handler_1.default.on(document, event, selector, ({ target }) => {
        if (target.hasAttribute(ATTR_TIMEPICKER_ACTIVE))
            return;
        const allElements = document.querySelectorAll(selector);
        allElements.forEach((element) => {
            if (!element.hasAttribute(ATTR_TIMEPICKER_ACTIVE))
                return;
            manipulator_1.default.removeClass(element, classes.opacity);
            element.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
        });
        manipulator_1.default.addClass(target, classes.opacity);
        target.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
    });
};
exports.toggleClassHandler = toggleClassHandler;
const findMousePosition = ({ clientX, clientY, touches }, object, isMobile = false) => {
    const { left, top } = object.getBoundingClientRect();
    let obj = {};
    if (!isMobile || !touches) {
        obj = {
            x: clientX - left,
            y: clientY - top,
        };
    }
    else if (isMobile && Object.keys(touches).length > 0) {
        obj = {
            x: touches[0].clientX - left,
            y: touches[0].clientY - top,
        };
    }
    return obj;
};
exports.findMousePosition = findMousePosition;
const checkBrowser = () => {
    const isBrowserMatched = (navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2 &&
        /MacIntel/.test(navigator.platform)) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isBrowserMatched;
};
exports.checkBrowser = checkBrowser;
const takeValue = (element, isInput = true) => {
    if (isInput)
        return element.value.replace(/:/gi, " ").split(" ");
    return element.replace(/:/gi, " ").split(" ");
};
exports.takeValue = takeValue;
const compareTimes = (time1, time2) => {
    const [time1Hour, time1Minutes, time1maxTimeFormat] = takeValue(time1, false);
    const [time2Hour, time2Minutes, time2maxTimeFormat] = takeValue(time2, false);
    const bothFormatsEqual = time1maxTimeFormat === time2maxTimeFormat;
    const condition = (time1maxTimeFormat === "PM" && time2maxTimeFormat === "AM") ||
        (bothFormatsEqual && time1Hour > time2Hour) ||
        time1Minutes > time2Minutes;
    return condition;
};
exports.compareTimes = compareTimes;
const getCurrentTime = () => {
    const date = new Date();
    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const currentTime = `${currentHours}:${currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}`;
    return currentTime;
};
const setMinTime = (minTime, disabledPast, format12) => {
    if (!disabledPast) {
        return minTime;
    }
    let currentTime = getCurrentTime();
    if (format12) {
        currentTime = `${formatToAmPm(currentTime).hours}:${formatToAmPm(currentTime).minutes} ${formatToAmPm(currentTime).amOrPm}`;
    }
    if ((minTime !== "" && compareTimes(currentTime, minTime)) ||
        minTime === "") {
        minTime = currentTime;
    }
    return minTime;
};
exports.setMinTime = setMinTime;
const setMaxTime = (maxTime, disabledFuture, format12) => {
    if (!disabledFuture)
        return maxTime;
    let currentTime = getCurrentTime();
    if (format12) {
        currentTime = `${formatToAmPm(currentTime).hours}:${formatToAmPm(currentTime).minutes} ${formatToAmPm(currentTime).amOrPm}`;
    }
    if ((maxTime !== "" && !compareTimes(currentTime, maxTime)) ||
        maxTime === "") {
        maxTime = currentTime;
    }
    return maxTime;
};
exports.setMaxTime = setMaxTime;
const checkValueBeforeAccept = ({ format12, maxTime, minTime, disablePast, disableFuture }, input, hourHeader) => {
    const minute = takeValue(input)[1];
    minTime = setMinTime(minTime, disablePast, format12);
    maxTime = setMaxTime(maxTime, disableFuture, format12);
    const [maxTimeHour, maxTimeMin, maxTimeFormat] = takeValue(maxTime, false);
    const [minTimeHour, minTimeMin, minTimeFormat] = takeValue(minTime, false);
    if (maxTimeFormat !== undefined || minTimeFormat !== undefined)
        return [hourHeader, minute];
    if (maxTimeHour !== "" &&
        minTimeHour === "" &&
        Number(hourHeader) > Number(maxTimeHour))
        return;
    if (maxTimeHour === "" &&
        minTimeHour !== "" &&
        maxTimeMin === undefined &&
        minTimeMin !== "" &&
        Number(hourHeader) < Number(minTimeHour))
        return;
    return [hourHeader, minute];
};
exports.checkValueBeforeAccept = checkValueBeforeAccept;
const _verifyMaxTimeHourAndAddDisabledClass = (tips, maxTimeHour, classes, format12) => {
    tips.forEach((tip) => {
        maxTimeHour = maxTimeHour === "12" && format12 ? "0" : maxTimeHour;
        if (tip.textContent === "00" ||
            Number(tip.textContent === "12" && format12 ? "0" : tip.textContent) >
                maxTimeHour) {
            manipulator_1.default.addClass(tip, classes.tipsDisabled);
            tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
        }
    });
};
exports._verifyMaxTimeHourAndAddDisabledClass = _verifyMaxTimeHourAndAddDisabledClass;
const _verifyMinTimeHourAndAddDisabledClass = (tips, minTimeHour, classes, format12) => {
    tips.forEach((tip) => {
        minTimeHour = minTimeHour === "12" && format12 ? "0" : minTimeHour;
        if (tip.textContent !== "00" &&
            Number(tip.textContent === "12" && format12 ? "0" : tip.textContent) <
                Number(minTimeHour)) {
            manipulator_1.default.addClass(tip, classes.tipsDisabled);
            tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
        }
    });
};
exports._verifyMinTimeHourAndAddDisabledClass = _verifyMinTimeHourAndAddDisabledClass;
const _isHourDisabled = (selectedHour, timeHour, format12, operator) => {
    if (timeHour === "12" || timeHour === "24") {
        return;
    }
    const hourChange = format12 ? 12 : 24;
    if (operator === "max") {
        return ((Number(selectedHour) === hourChange ? 0 : Number(selectedHour)) >
            Number(timeHour));
    }
    return ((Number(selectedHour) === hourChange ? 0 : Number(selectedHour)) <
        Number(timeHour));
};
const _verifyMaxTimeMinutesTipsAndAddDisabledClass = (tips, maxMinutes, maxHour, currHour, classes, format12) => {
    tips.forEach((tip) => {
        if (_isHourDisabled(currHour, maxHour, format12, "max") ||
            (Number(tip.textContent) > maxMinutes &&
                Number(currHour) === Number(maxHour))) {
            manipulator_1.default.addClass(tip, classes.tipsDisabled);
            tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
        }
    });
};
exports._verifyMaxTimeMinutesTipsAndAddDisabledClass = _verifyMaxTimeMinutesTipsAndAddDisabledClass;
const _verifyMinTimeMinutesTipsAndAddDisabledClass = (tips, minMinutes, minHour, currHour, classes, format12) => {
    tips.forEach((tip) => {
        if (_isHourDisabled(currHour, minHour, format12, "min") ||
            (Number(tip.textContent) < minMinutes &&
                Number(currHour) === Number(minHour))) {
            manipulator_1.default.addClass(tip, classes.tipsDisabled);
            tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
        }
    });
};
exports._verifyMinTimeMinutesTipsAndAddDisabledClass = _verifyMinTimeMinutesTipsAndAddDisabledClass;
const _convertHourToNumber = (string) => {
    if (string.startsWith("0"))
        return Number(string.slice(1));
    return Number(string);
};
exports._convertHourToNumber = _convertHourToNumber;
//# sourceMappingURL=utils.js.map