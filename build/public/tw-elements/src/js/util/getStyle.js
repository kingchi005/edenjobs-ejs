"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyle = void 0;
const options = {
    property: "color",
    defaultValue: null,
    inherit: true,
};
const getStyle = (className, customOptions) => {
    const { property, defaultValue, inherit } = Object.assign(Object.assign({}, options), customOptions);
    const element = document.createElement("div");
    element.classList.add(className);
    document.body.appendChild(element);
    const computedStyle = window.getComputedStyle(element);
    const value = computedStyle[property] || defaultValue;
    const parentComputedStyle = window.getComputedStyle(element.parentElement);
    const parentValue = parentComputedStyle[property];
    document.body.removeChild(element);
    if (!inherit && parentValue && value === parentValue) {
        return defaultValue;
    }
    return value || defaultValue;
};
exports.getStyle = getStyle;
//# sourceMappingURL=getStyle.js.map