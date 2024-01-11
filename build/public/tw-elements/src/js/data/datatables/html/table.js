"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = __importDefault(require("./pagination"));
const columns_1 = __importDefault(require("./columns"));
const rows_1 = __importDefault(require("./rows"));
const ATTR_BODY = "data-te-datatable-inner-ref";
const ATTR_HEADER = "data-te-datatable-header-ref";
const tableTemplate = ({ columns, rows, noFoundMessage, edit, multi, selectable, loading, loadingMessage, pagination, bordered, borderless, striped, hover, fixedHeader, sm, sortIconTemplate, classes, }) => {
    const rowsTemplate = (0, rows_1.default)({
        rows,
        columns,
        noFoundMessage,
        edit,
        loading,
        selectable,
        bordered,
        borderless,
        striped,
        hover,
        sm,
        classes,
    });
    const columnsTemplate = (0, columns_1.default)(columns, selectable, multi, bordered, sm, loading, sortIconTemplate, classes);
    const table = `
<div class="${classes.color}" ${ATTR_BODY}>
  <table class="${classes.table}">
    <thead class="${classes.tableHeader} ${bordered ? `${classes.tableBordered}` : ""} ${borderless ? `${classes.borderless}` : ""} ${classes.borderColor}" ${ATTR_HEADER}>
      <tr>
        ${columnsTemplate}
      </tr>
    </thead>
    <tbody class="${fixedHeader ? `${classes.fixedHeaderBody}` : ""}">
      ${loading ? "" : rowsTemplate}
    </tbody>
  </table>
</div>
${loading
        ? `
  <div class="${classes.loadingItemsWrapper}">
    <div class="${classes.loadingProgressBarWrapper}">
      <div class="${classes.loadingProgressBar}"></div>
    </div>
  </div>
<p class="${classes.loadingMessage}">${loadingMessage}</p>
`
        : ""}
${pagination.enable ? (0, pagination_1.default)(pagination, loading, bordered) : ""}
  `;
    return { table, rows: rowsTemplate, column: columnsTemplate };
};
exports.default = tableTemplate;
//# sourceMappingURL=table.js.map