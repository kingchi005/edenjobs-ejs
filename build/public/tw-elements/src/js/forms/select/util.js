"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function allOptionsSelected(options) {
    return options
        .filter((option) => !option.disabled)
        .every((option) => {
        return option.selected;
    });
}
exports.default = allOptionsSelected;
//# sourceMappingURL=util.js.map