"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToggleButtonTemplate = exports.getIconButtonsTemplate = void 0;
const getIconButtonsTemplate = (datepickerIconTemplate, timepickerIconTemplate, classes) => `
  <button type="button" class="${classes.pickerIcon}" data-te-datepicker-toggle-button-ref>
    ${datepickerIconTemplate}
  </button>
  <button type="button" class="${classes.pickerIcon}" data-te-timepicker-toggle-button-ref>
    ${timepickerIconTemplate}
  </button>
`;
exports.getIconButtonsTemplate = getIconButtonsTemplate;
const getToggleButtonTemplate = (toggleButtonTemplate, classes) => `
  <button type="button" class="${classes.toggleButton}" data-te-date-timepicker-toggle-ref>
    ${toggleButtonTemplate} 
  </button>
`;
exports.getToggleButtonTemplate = getToggleButtonTemplate;
//# sourceMappingURL=templates.js.map