"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTooltipTemplate = exports.getHandleTemplate = exports.getConnectsTemplate = void 0;
const getConnectsTemplate = (classes, attributes) => {
    return `<div class="${classes.connectContainer}" ${attributes}>
  <div class="${classes.connect}"></div>
  </div>`;
};
exports.getConnectsTemplate = getConnectsTemplate;
const getHandleTemplate = (classes, attributes) => {
    return `<div class="${classes.hand}" ${attributes}>
    <span></span>
  </div>`;
};
exports.getHandleTemplate = getHandleTemplate;
const getTooltipTemplate = (classes, attributes) => {
    return `
    <span class="${classes.tooltip}" ${attributes}>
      <span class="${classes.tooltipValue}"></span>
    </span>
    `;
};
exports.getTooltipTemplate = getTooltipTemplate;
//# sourceMappingURL=template.js.map