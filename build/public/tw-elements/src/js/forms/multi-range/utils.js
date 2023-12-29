"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventTypeClientX = void 0;
const getEventTypeClientX = (ev) => {
    const event = ev.type === "touchmove" ? ev.touches[0].clientX : ev.clientX;
    return event;
};
exports.getEventTypeClientX = getEventTypeClientX;
//# sourceMappingURL=utils.js.map