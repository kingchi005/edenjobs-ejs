"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const jqueryInit = (plugin) => {
    (0, index_1.onDOMContentLoaded)(() => {
        const $ = (0, index_1.getjQuery)();
        if ($) {
            const name = plugin.NAME;
            const JQUERY_NO_CONFLICT = $.fn[name];
            $.fn[name] = plugin.jQueryInterface;
            $.fn[name].Constructor = plugin;
            $.fn[name].noConflict = () => {
                $.fn[name] = JQUERY_NO_CONFLICT;
                return plugin.jQueryInterface;
            };
        }
    });
};
exports.default = jqueryInit;
//# sourceMappingURL=jqueryInit.js.map