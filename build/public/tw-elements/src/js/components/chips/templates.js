"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChip = exports.getInputField = void 0;
const getInputField = ({ inputID, labelText }, classes) => {
    return `<div data-te-chips-input-wrapper data-te-input-wrapper-init class="${classes.chipsInputWrapper}">
      <input
          type="text"
          class="${classes.chipsInput}"
          id="${inputID}"
          placeholder="Example label" />
        <label
          for="${inputID}"
          class="${classes.chipsLabel}"
          >${labelText}
        </label>
      </div>
    </div>`;
};
exports.getInputField = getInputField;
const getChip = ({ text, iconSVG }, classes) => {
    return `<div data-te-chip-init data-te-ripple-init class="${classes.chipElement}">
    <span data-te-chip-text>${text}</span> 
      <span data-te-chip-close class="${classes.chipCloseIcon}">
        ${iconSVG}
      </span>
  </div>`;
};
exports.getChip = getChip;
//# sourceMappingURL=templates.js.map