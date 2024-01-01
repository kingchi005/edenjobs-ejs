"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackdropTemplate = void 0;
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const index_1 = require("../../util/index");
function getBackdropTemplate({ backdropID }, classes) {
    const backdrop = (0, index_1.element)("div");
    manipulator_1.default.addClass(backdrop, `${classes.backdrop} ${classes.backdropColor}`);
    backdrop.id = backdropID;
    return backdrop;
}
exports.getBackdropTemplate = getBackdropTemplate;
//# sourceMappingURL=templates.js.map