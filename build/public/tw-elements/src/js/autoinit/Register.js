"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InitRegister {
    constructor() {
        this.inits = [];
    }
    get initialized() {
        return this.inits;
    }
    isInited(componentName) {
        return this.inits.includes(componentName);
    }
    add(componentName) {
        if (!this.isInited(componentName)) {
            this.inits.push(componentName);
        }
    }
}
exports.default = InitRegister;
//# sourceMappingURL=Register.js.map