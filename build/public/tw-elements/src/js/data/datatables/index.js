"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perfect_scrollbar_1 = __importDefault(require("../../methods/perfect-scrollbar"));
const index_1 = require("../../util/index");
const data_1 = __importDefault(require("../../dom/data"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../../dom/selector-engine"));
const table_1 = __importDefault(require("./html/table"));
const util_1 = require("./util");
const select_1 = __importDefault(require("../../forms/select"));
const NAME = "datatable";
const ATTR_NAME = `data-te-${NAME}`;
const DATA_KEY = `te.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const ATTR_BODY = `[${ATTR_NAME}-inner-ref]`;
const ATTR_CELL = `[${ATTR_NAME}-cell-ref]`;
const ATTR_HEADER = `[${ATTR_NAME}-header-ref]`;
const ATTR_HEADER_CHECKBOX = `[${ATTR_NAME}-header-checkbox-ref]`;
const ATTR_PAGINATION_RIGHT = `[${ATTR_NAME}-pagination-right-ref]`;
const ATTR_PAGINATION_LEFT = `[${ATTR_NAME}-pagination-left-ref]`;
const ATTR_PAGINATION_START = `[${ATTR_NAME}-pagination-start-ref]`;
const ATTR_PAGINATION_END = `[${ATTR_NAME}-pagination-end-ref]`;
const ATTR_PAGINATION_NAV = `[${ATTR_NAME}-pagination-nav-ref]`;
const ATTR_SELECT = `[${ATTR_NAME}-select-ref]`;
const ATTR_SORT_ICON = `[${ATTR_NAME}-sort-icon-ref]`;
const ATTR_ROW = `[${ATTR_NAME}-row-ref]`;
const ATTR_ROW_CHECKBOX = `[${ATTR_NAME}-row-checkbox-ref]`;
const EVENT_SELECT = `selectRows${EVENT_KEY}`;
const EVENT_RENDER = `render${EVENT_KEY}`;
const EVENT_ROW_CLICK = `rowClick${EVENT_KEY}`;
const EVENT_UPDATE = `update${EVENT_KEY}`;
const sortIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
</svg>`;
const paginationStartIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
</svg>`;
const paginationLeftIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
</svg>`;
const paginationRightIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>`;
const paginationEndIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"/>
</svg>`;
const BORDER_COLOR_CLASSES = "border-neutral-200 dark:border-neutral-500";
const BORDERLESS_CLASSES = "border-none";
const CHECKBOX_HEADER_CLASSES = "relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:border-neutral-400";
const CHECKBOX_HEADER_WRAPPER_CLASSES = "mb-[0.125rem] min-h-[1.5rem] pl-[1.5rem] ml-3 flex items-center";
const CHECKBOX_ROW_CLASSES = "relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:border-neutral-400";
const CHECKBOX_ROW_WRAPPER_CLASSES = "mb-[0.125rem] min-h-[1.5rem] pl-[1.5rem] ml-3 flex items-center";
const COLOR_CLASSES = "bg-white dark:bg-neutral-800";
const COLUMNS_CLASSES = "py-4 pl-1 text-clip overflow-hidden text-[#212529] dark:text-white";
const EDIT_CLASSES = "focus:outline-none";
const FIXED_HEADER_CLASSES = "sticky top-0 z-30";
const FIXED_HEADER_BODY_CLASSES = "sticky z-10 bg-inherit";
const HOVER_ROW_CLASSES = "hover:bg-neutral-100 dark:hover:bg-neutral-700";
const LOADING_COLUMN_CLASSES = "pointer-events-none cursor-none text-neutral-400 dark:text-neutral-300";
const LOADING_ITEMS_WRAPPER_CLASSES = "h-[2px] relative w-full overflow-hidden";
const LOADING_MESSAGE_CLASSES = "text-center text-neutral-500 font-ligh text-sm my-4 dark:text-neutral-400";
const LOADING_PAGINATION_NAV_CLASSES = "text-neutral-500 dark:text-neutral-300";
const LOADING_PAGINATION_ROWS_TEXT_CLASSES = "text-neutral-500 dark:text-neutral-300";
const LOADING_PAGINATION_SELECT_WRAPPER_CLASSES = "pointer-events-none cursor-none";
const LOADING_PROGRESS_BAR_CLASSES = "h-full w-[45%] bg-primary-400 dark:bg-primary-600";
const LOADING_PROGRESS_BAR_WRAPPER_CLASSES = "h-full animate-[progress_3s_ease-in-out_infinite]";
const NO_FOUND_MESSAGE_CLASSES = "pl-2 py-3 font-light text-sm dark:text-neutral-300";
const NO_FOUND_MESSAGE_WRAPPER_CLASSES = "border-b";
const PAGINATION_CLASSES = "flex md:flex-row justify-end items-center py-2 space-x-4 text-sm flex-col leading-[1.6]";
const PAGINATION_BORDERED_CLASSES = "border border-t-0";
const PAGINATION_BUTTONS_WRAPPER_CLASSES = "order-1 my-3 md:order-none md:my-0 md:pr-1";
const PAGINATION_END_BUTTON_CLASSES = "inline-block rounded p-2.5 text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600";
const PAGINATION_LEFT_BUTTON_CLASSES = "inline-block rounded p-2.5 font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600";
const PAGINATION_NAV_CLASSES = "font-normal order-2 mb-3 md:order-none md:mb-0";
const PAGINATION_RIGHT_BUTTON_CLASSES = "inline-block rounded p-2.5 font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600";
const PAGINATION_ROWS_TEXT_CLASSES = "font-light";
const PAGINATION_START_BUTTON_CLASSES = "inline-block rounded p-2.5 font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600";
const ROW_CLASSES = "border-b";
const ROW_ANIMATION_CLASSES = "transition ease-in-out duration-300 motion-reduce:transition-none";
const ROW_ITEM_CLASSES = "whitespace-nowrap text-clip overflow-auto px-[1.4rem] py-4";
const SCROLL_CLASSES = "relative";
const SELECTABLE_ROW_CLASSES = "!bg-neutral-100 dark:!bg-neutral-600";
const SELECT_ITEMS_WRAPPER_CLASSES = "flex items-center space-x-4 order-3 md:order-none";
const SELECT_WRAPPER_CLASSES = "w-[70px]";
const SM_CLASSES = "!py-2";
const SORT_ICON_CLASSES = "w-[15px] h-[10px] origin-bottom font-black mr-1 opacity-0 text-neutral-500 group-hover:opacity-100 transition hover:ease-in-out transform ease-linear duration-300 motion-reduce:transition-none dark:text-neutral-400";
const SORT_ICON_WRAPPER_CLASSES = "flex flex-row group";
const STRIPED_CLASSES = "[&:nth-child(odd)]:bg-neutral-50 [&:nth-child(odd)]:dark:bg-neutral-700";
const TABLE_BORDERED_CLASSES = "border";
const TABLE_HEADER_CLASSES = "border-b font-normal px-[1.4rem]";
const TABLE_CLASSES = "text-left text-sm font-light w-full leading-[1.6]";
const TYPE_OPTIONS = {
    bordered: "boolean",
    borderless: "boolean",
    clickableRows: "boolean",
    defaultValue: "string",
    edit: "boolean",
    entries: "(number|string)",
    entriesOptions: "array",
    fullPagination: "boolean",
    hover: "boolean",
    loading: "boolean",
    loadingMessage: "string",
    maxWidth: "(null|number|string)",
    maxHeight: "(null|number|string)",
    multi: "boolean",
    noFoundMessage: "string",
    pagination: "boolean",
    selectable: "boolean",
    sm: "boolean",
    sortField: "(null|string)",
    sortOrder: "string",
    fixedHeader: "boolean",
    striped: "boolean",
    rowsText: "string",
    ofText: "string",
    allText: "string",
    forceSort: "boolean",
    sortIconTemplate: "string",
    paginationStartIconTemplate: "string",
    paginationEndIconTemplate: "string",
    paginationLeftIconTemplate: "string",
    paginationRightIconTemplate: "string",
};
const DEFAULT_OPTIONS = {
    bordered: false,
    borderless: false,
    clickableRows: false,
    defaultValue: "-",
    edit: false,
    entries: 10,
    entriesOptions: [10, 25, 50, 200],
    fixedHeader: false,
    fullPagination: false,
    hover: false,
    loading: false,
    loadingMessage: "Loading results...",
    maxWidth: null,
    maxHeight: null,
    multi: false,
    noFoundMessage: "No matching results found",
    pagination: true,
    selectable: false,
    sm: false,
    sortField: null,
    sortOrder: "asc",
    striped: false,
    rowsText: "Rows per page:",
    ofText: "of",
    allText: "All",
    forceSort: false,
    sortIconTemplate: sortIconTemplate,
    paginationStartIconTemplate: paginationStartIconTemplate,
    paginationEndIconTemplate: paginationEndIconTemplate,
    paginationLeftIconTemplate: paginationLeftIconTemplate,
    paginationRightIconTemplate: paginationRightIconTemplate,
};
const TYPE_COLUMN_FIELDS = {
    label: "string",
    field: "string",
    fixed: "(boolean|string)",
    format: "(function|null)",
    width: "(number|null)",
    sort: "boolean",
    columnIndex: "number",
};
const DEFAULT_COLUMN = {
    label: "",
    field: "",
    fixed: false,
    format: null,
    width: null,
    sort: true,
    columnIndex: 0,
};
const DefaultClasses = {
    table: TABLE_CLASSES,
    tableHeader: TABLE_HEADER_CLASSES,
    column: COLUMNS_CLASSES,
    pagination: PAGINATION_CLASSES,
    selectWrapper: SELECT_WRAPPER_CLASSES,
    scroll: SCROLL_CLASSES,
    tableBordered: TABLE_BORDERED_CLASSES,
    paginationBordered: PAGINATION_BORDERED_CLASSES,
    borderless: BORDERLESS_CLASSES,
    checkboxRowWrapper: CHECKBOX_ROW_WRAPPER_CLASSES,
    checkboxRow: CHECKBOX_ROW_CLASSES,
    checkboxHeaderWrapper: CHECKBOX_HEADER_WRAPPER_CLASSES,
    checkboxHeader: CHECKBOX_HEADER_CLASSES,
    row: ROW_CLASSES,
    rowItem: ROW_ITEM_CLASSES,
    striped: STRIPED_CLASSES,
    sortIconWrapper: SORT_ICON_WRAPPER_CLASSES,
    sortIcon: SORT_ICON_CLASSES,
    paginationRowsText: PAGINATION_ROWS_TEXT_CLASSES,
    paginationNav: PAGINATION_NAV_CLASSES,
    paginationButtonsWrapper: PAGINATION_BUTTONS_WRAPPER_CLASSES,
    hoverRow: HOVER_ROW_CLASSES,
    borderColor: BORDER_COLOR_CLASSES,
    color: COLOR_CLASSES,
    fixedHeader: FIXED_HEADER_CLASSES,
    fixedHeaderBody: FIXED_HEADER_BODY_CLASSES,
    selectableRow: SELECTABLE_ROW_CLASSES,
    rowAnimation: ROW_ANIMATION_CLASSES,
    sm: SM_CLASSES,
    edit: EDIT_CLASSES,
    selectItemsWrapper: SELECT_ITEMS_WRAPPER_CLASSES,
    paginationStartButton: PAGINATION_START_BUTTON_CLASSES,
    paginationLeftButton: PAGINATION_LEFT_BUTTON_CLASSES,
    paginationRightButton: PAGINATION_RIGHT_BUTTON_CLASSES,
    paginationEndButton: PAGINATION_END_BUTTON_CLASSES,
    loadingItemsWrapper: LOADING_ITEMS_WRAPPER_CLASSES,
    loadingProgressBarWrapper: LOADING_PROGRESS_BAR_WRAPPER_CLASSES,
    loadingProgressBar: LOADING_PROGRESS_BAR_CLASSES,
    loadingMessage: LOADING_MESSAGE_CLASSES,
    loadingPaginationRowsText: LOADING_PAGINATION_ROWS_TEXT_CLASSES,
    loadingPaginationSelectWrapper: LOADING_PAGINATION_SELECT_WRAPPER_CLASSES,
    loadingPaginationNav: LOADING_PAGINATION_NAV_CLASSES,
    loadingColumn: LOADING_COLUMN_CLASSES,
    noFoundMessageWrapper: NO_FOUND_MESSAGE_WRAPPER_CLASSES,
    noFoundMessage: NO_FOUND_MESSAGE_CLASSES,
};
const DefaultClassesType = {
    table: "string",
    tableHeader: "string",
    column: "string",
    pagination: "string",
    selectWrapper: "string",
    scroll: "string",
    tableBordered: "string",
    paginationBordered: "string",
    borderless: "string",
    checkboxRowWrapper: "string",
    checkboxRow: "string",
    checkboxHeaderWrapper: "string",
    checkboxHeader: "string",
    row: "string",
    rowItem: "string",
    striped: "string",
    sortIconWrapper: "string",
    sortIcon: "string",
    paginationRowsText: "string",
    paginationNav: "string",
    paginationButtonsWrapper: "string",
    hoverRow: "string",
    borderColor: "string",
    color: "string",
    fixedHeader: "string",
    fixedHeaderBody: "string",
    selectableRow: "string",
    rowAnimation: "string",
    sm: "string",
    edit: "string",
    selectItemsWrapper: "string",
    paginationStartButton: "string",
    paginationLeftButton: "string",
    paginationRightButton: "string",
    paginationEndButton: "string",
    loadingItemsWrapper: "string",
    loadingProgressBarWrapper: "string",
    loadingProgressBar: "string",
    loadingMessage: "string",
    loadingPaginationRowsText: "string",
    loadingPaginationSelectWrapper: "string",
    loadingPaginationNav: "string",
    loadingColumn: "string",
    noFoundMessageWrapper: "string",
    noFoundMessage: "string",
};
class Datatable {
    constructor(element, data = {}, options = {}, classes = {}) {
        this._element = element;
        this._options = this._getOptions(options);
        this._classes = this._getClasses(classes);
        this._sortReverse = false;
        this._activePage = 0;
        this._search = "";
        this._searchColumn = null;
        this._paginationLeft = null;
        this._paginationRight = null;
        this._paginationStart = null;
        this._paginationEnd = null;
        this._select = null;
        this._selectInstance = null;
        this._selected = [];
        this._checkboxes = null;
        this._headerCheckbox = null;
        this._rows = this._getRows(data.rows);
        this._columns = this._getColumns(data.columns);
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this._perfectScrollbar = null;
            this._setup();
        }
    }
    static get NAME() {
        return NAME;
    }
    get columns() {
        return this._columns.map((column, index) => {
            let template = Object.assign(Object.assign({}, DEFAULT_COLUMN), { field: `field_${index}`, columnIndex: index });
            if (typeof column === "string") {
                template.label = column;
            }
            else if (typeof column === "object") {
                template = Object.assign(Object.assign({}, template), column);
            }
            (0, index_1.typeCheckConfig)("column", template, TYPE_COLUMN_FIELDS);
            return template;
        });
    }
    get rows() {
        return this._rows.map((row, index) => {
            const output = {
                rowIndex: index,
            };
            if (Array.isArray(row)) {
                this.columns.forEach((column, i) => {
                    if (row[i] === 0) {
                        output[column.field] = row[i];
                    }
                    else {
                        output[column.field] = row[i] || this._options.defaultValue;
                    }
                });
            }
            else if (typeof row === "object") {
                this.columns.forEach((column) => {
                    if (row[column.field] === 0) {
                        output[column.field] = row[column.field];
                    }
                    else {
                        output[column.field] =
                            row[column.field] || this._options.defaultValue;
                    }
                });
            }
            return output;
        });
    }
    get searchResult() {
        return (0, util_1.search)(this.rows, this._search, this._searchColumn);
    }
    get computedRows() {
        let result = [...this.searchResult];
        if (this._options.sortOrder) {
            result = (0, util_1.sort)({
                rows: result,
                field: this._options.sortField,
                order: this._options.sortOrder,
            });
        }
        if (this._options.pagination) {
            if (this._options.entries === "All") {
                result = (0, util_1.paginate)({
                    rows: result,
                    entries: result.length,
                    activePage: this._activePage,
                });
            }
            else {
                result = (0, util_1.paginate)({
                    rows: result,
                    entries: this._options.entries,
                    activePage: this._activePage,
                });
            }
        }
        return result;
    }
    get pages() {
        if (this._options.entries === "All") {
            return 1;
        }
        return Math.ceil(this.searchResult.length / this._options.entries);
    }
    get navigationText() {
        const firstVisibleEntry = this._activePage * this._options.entries;
        if (this.searchResult.length === 0) {
            return `0 ${this._options.ofText} 0`;
        }
        if (this._options.entries === "All") {
            return `1 - ${this.searchResult.length} ${this._options.ofText} ${this.searchResult.length}`;
        }
        return `${firstVisibleEntry + 1} - ${this.computedRows.length + firstVisibleEntry} ${this._options.ofText} ${this.searchResult.length}`;
    }
    get tableOptions() {
        return {
            classes: this._classes,
            columns: this.columns,
            rows: this.computedRows,
            noFoundMessage: this._options.noFoundMessage,
            edit: this._options.edit,
            loading: this._options.loading,
            loaderClass: this._options.loaderClass,
            loadingMessage: this._options.loadingMessage,
            selectable: this._options.selectable,
            multi: this._options.multi,
            bordered: this._options.bordered,
            borderless: this._options.borderless,
            striped: this._options.striped,
            hover: this._options.hover,
            fixedHeader: this._options.fixedHeader,
            sm: this._options.sm,
            sortIconTemplate: this._options.sortIconTemplate,
            pagination: {
                enable: this._options.pagination,
                text: this.navigationText,
                entries: this._options.entries,
                entriesOptions: this._options.entriesOptions,
                fullPagination: this._options.fullPagination,
                rowsText: this._options.rowsText,
                ofText: this._options.ofText,
                allText: this._options.allText,
                paginationStartIconTemplate: this._options.paginationStartIconTemplate,
                paginationLeftIconTemplate: this._options.paginationLeftIconTemplate,
                paginationRightIconTemplate: this._options.paginationRightIconTemplate,
                paginationEndIconTemplate: this._options.paginationEndIconTemplate,
                classes: this._classes,
            },
            forceSort: this._options.forceSort,
        };
    }
    update(data, options = {}) {
        if (data && data.rows) {
            this._rows = data.rows;
        }
        if (data && data.columns) {
            this._columns = data.columns;
        }
        this._clearClassList(options);
        this._options = this._getOptions(Object.assign(Object.assign({}, this._options), options));
        this._setup();
        this._performSort();
    }
    dispose() {
        if (this._selectInstance) {
            this._selectInstance.dispose();
        }
        data_1.default.removeData(this._element, DATA_KEY);
        this._removeEventListeners();
        this._perfectScrollbar.destroy();
        this._element = null;
    }
    search(string, column) {
        this._search = string;
        this._searchColumn = column;
        this._activePage = 0;
        if (this._options.pagination) {
            this._toggleDisableState();
        }
        this._renderRows();
        if (this._options.maxHeight) {
            this._perfectScrollbar.element.scrollTop = 0;
            this._perfectScrollbar.update();
        }
    }
    sort(column, order = "asc") {
        this._options.sortOrder = order;
        if (typeof column === "string") {
            this._options.sortField = this.columns.find((header) => header.label === column).field;
        }
        else {
            this._options.sortField = column.field;
        }
        const icon = selector_engine_1.default.findOne(`[data-te-sort="${this._options.sortField}"]`, this._element);
        this._activePage = 0;
        this._toggleDisableState();
        this._renderRows();
        this._setActiveSortIcon(icon);
    }
    setActivePage(index) {
        if (index < this.pages) {
            this._changeActivePage(index);
        }
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _changeActivePage(index) {
        this._activePage = index;
        this._toggleDisableState();
        this._renderRows();
    }
    _clearClassList(options) {
        ["hover", "bordered", "borderless", "sm", "striped"].forEach((option) => {
            if (this._options[option] && !options[option]) {
                manipulator_1.default.removeDataAttribute(`data-te-${option}`);
            }
        });
    }
    _emitSelectEvent() {
        event_handler_1.default.trigger(this._element, EVENT_SELECT, {
            selectedRows: this.rows.filter((row) => this._selected.indexOf(row.rowIndex) !== -1),
            selectedIndexes: this._selected,
            allSelected: this._selected.length === this.rows.length,
        });
    }
    _getRows(rows = []) {
        const body = selector_engine_1.default.findOne("tbody", this._element);
        if (!body) {
            return rows;
        }
        const tableRows = selector_engine_1.default.find("tr", body).map((row) => {
            return selector_engine_1.default.find("td", row).map((cell) => cell.innerHTML);
        });
        return [...tableRows, ...rows];
    }
    _getColumns(columns = []) {
        const head = selector_engine_1.default.findOne("thead", this._element);
        if (!head) {
            return columns;
        }
        const headerRow = selector_engine_1.default.findOne("tr", head);
        const headers = selector_engine_1.default.find("th", headerRow).map((cell) => (Object.assign({ label: cell.innerHTML }, manipulator_1.default.getDataAttributes(cell))));
        return [...headers, ...columns];
    }
    _getCSSValue(size) {
        if (typeof size === "string") {
            return size;
        }
        return `${size}px`;
    }
    _getOptions(options) {
        const config = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), manipulator_1.default.getDataAttributes(this._element)), options);
        (0, index_1.typeCheckConfig)(NAME, config, TYPE_OPTIONS);
        return config;
    }
    _setActiveRows() {
        selector_engine_1.default.find(ATTR_ROW, this._element).forEach((row) => {
            if (this._selected.includes(manipulator_1.default.getDataAttribute(row, "index"))) {
                manipulator_1.default.addClass(row, `active ${this._classes.selectableRow}`);
            }
            else {
                manipulator_1.default.removeClass(row, `active ${this._classes.selectableRow}`);
            }
        });
    }
    _setEntries(e) {
        this._options = this._getOptions(Object.assign(Object.assign({}, this._options), { entries: e.target.value }));
        if (this._activePage > this.pages - 1) {
            this._activePage = this.pages - 1;
        }
        this._toggleDisableState();
        this._renderRows();
    }
    _setSelected() {
        selector_engine_1.default.find(ATTR_ROW_CHECKBOX, this._element).forEach((checkbox) => {
            const index = manipulator_1.default.getDataAttribute(checkbox, "rowIndex");
            checkbox.checked = this._selected.includes(index);
        });
        this._setActiveRows();
    }
    _setActiveSortIcon(active) {
        selector_engine_1.default.find(ATTR_SORT_ICON, this._element).forEach((icon) => {
            const angle = this._options.sortOrder === "desc" && icon === active ? 180 : 0;
            manipulator_1.default.style(icon, {
                transform: `rotate(${angle}deg)`,
            });
            if (icon === active && this._options.sortOrder) {
                manipulator_1.default.addClass(icon, `opacity-100`);
            }
            else {
                manipulator_1.default.removeClass(icon, `opacity-100`);
            }
        });
    }
    _setup() {
        this._renderTable();
        if (this._options.pagination) {
            this._setupPagination();
        }
        if (this._options.edit) {
            this._setupEditable();
        }
        if (this._options.clickableRows) {
            this._setupClickableRows();
        }
        if (this._options.selectable) {
            this._setupSelectable();
        }
        this._setupScroll();
        this._setupSort();
    }
    _setupClickableRows() {
        selector_engine_1.default.find(ATTR_ROW, this._element).forEach((row) => {
            const index = manipulator_1.default.getDataAttribute(row, "index");
            manipulator_1.default.addClass(row, `cursor-pointer`);
            event_handler_1.default.on(row, "click", (e) => {
                if (!selector_engine_1.default.matches(e.target, ATTR_ROW_CHECKBOX)) {
                    event_handler_1.default.trigger(this._element, EVENT_ROW_CLICK, {
                        index,
                        row: this.rows[index],
                    });
                }
            });
        });
    }
    _setupEditable() {
        selector_engine_1.default.find(ATTR_ROW, this._element).forEach((row) => {
            const index = manipulator_1.default.getDataAttribute(row, "index");
            selector_engine_1.default.find(ATTR_CELL, row).forEach((cell) => {
                event_handler_1.default.on(cell, "input", (e) => this._updateRow(e, index));
            });
        });
    }
    _setupScroll() {
        const datatableBody = selector_engine_1.default.findOne(ATTR_BODY, this._element);
        const style = {};
        if (this._options.maxHeight) {
            style.maxHeight = this._getCSSValue(this._options.maxHeight);
        }
        if (this._options.maxWidth) {
            const width = this._getCSSValue(this._options.maxWidth);
            style.maxWidth = width;
            manipulator_1.default.style(this._element, { maxWidth: width });
        }
        manipulator_1.default.style(datatableBody, style);
        manipulator_1.default.addClass(datatableBody, `${this._classes.scroll}`);
        if (this._options.fixedHeader) {
            let headers = selector_engine_1.default.find(ATTR_HEADER, this._element);
            if (this._options.selectable) {
                headers = headers.filter((header, index) => {
                    manipulator_1.default.addClass(header, `${this._classes.fixedHeader} ${this._classes.color}`);
                    return index !== 0;
                });
            }
            headers.forEach((header, i) => {
                manipulator_1.default.addClass(header, `${this._classes.fixedHeader} ${this._classes.color}`);
                if (this.columns[i].fixed) {
                    manipulator_1.default.addClass(header, `!z-40`);
                }
            });
        }
        this._perfectScrollbar = new perfect_scrollbar_1.default(datatableBody);
    }
    _setupSort() {
        selector_engine_1.default.find(ATTR_SORT_ICON, this._element).forEach((icon) => {
            const field = manipulator_1.default.getDataAttribute(icon, "sort");
            const [header] = selector_engine_1.default.parents(icon, "th");
            if (this.columns.sort) {
                manipulator_1.default.addClass(header, `cursor-pointer`);
            }
            else {
                return;
            }
            if (field === this._options.sortField) {
                this._setActiveSortIcon(icon);
            }
            event_handler_1.default.on(header, "click", () => {
                if (this._options.sortField === field &&
                    this._options.sortOrder === "asc") {
                    this._options.sortOrder = "desc";
                }
                else if (this._options.sortField === field &&
                    this._options.sortOrder === "desc") {
                    this._options.sortOrder = this._options.forceSort ? "asc" : null;
                }
                else {
                    this._options.sortOrder = "asc";
                }
                this._options.sortField = field;
                this._activePage = 0;
                this._performSort();
                this._setActiveSortIcon(icon);
            });
        });
    }
    _performSort() {
        this._toggleDisableState();
        this._renderRows();
    }
    _setupSelectable() {
        this._checkboxes = selector_engine_1.default.find(ATTR_ROW_CHECKBOX, this._element);
        this._headerCheckbox = selector_engine_1.default.findOne(ATTR_HEADER_CHECKBOX, this._element);
        event_handler_1.default.on(this._headerCheckbox, "input", (e) => this._toggleSelectAll(e));
        this._checkboxes.forEach((checkbox) => {
            const rowIndex = manipulator_1.default.getDataAttribute(checkbox, "rowIndex");
            event_handler_1.default.on(checkbox, "input", (e) => this._toggleSelectRow(e, rowIndex));
        });
    }
    _setupPagination() {
        this._paginationRight = selector_engine_1.default.findOne(ATTR_PAGINATION_RIGHT, this._element);
        this._paginationLeft = selector_engine_1.default.findOne(ATTR_PAGINATION_LEFT, this._element);
        event_handler_1.default.on(this._paginationRight, "click", () => this._changeActivePage(this._activePage + 1));
        event_handler_1.default.on(this._paginationLeft, "click", () => this._changeActivePage(this._activePage - 1));
        if (this._options.fullPagination) {
            this._paginationStart = selector_engine_1.default.findOne(ATTR_PAGINATION_START, this._element);
            this._paginationEnd = selector_engine_1.default.findOne(ATTR_PAGINATION_END, this._element);
            event_handler_1.default.on(this._paginationStart, "click", () => this._changeActivePage(0));
            event_handler_1.default.on(this._paginationEnd, "click", () => this._changeActivePage(this.pages - 1));
        }
        this._toggleDisableState();
        this._setupPaginationSelect();
    }
    _setupPaginationSelect() {
        this._select = selector_engine_1.default.findOne(ATTR_SELECT, this._element);
        this._selectInstance = new select_1.default(this._select);
        event_handler_1.default.on(this._select, "valueChange.te.select", (e) => this._setEntries(e));
    }
    _removeEventListeners() {
        if (this._options.pagination) {
            event_handler_1.default.off(this._paginationRight, "click");
            event_handler_1.default.off(this._paginationLeft, "click");
            event_handler_1.default.off(this._select, "valueChange.te.select");
            if (this._options.fullPagination) {
                event_handler_1.default.off(this._paginationStart, "click");
                event_handler_1.default.off(this._paginationEnd, "click");
            }
        }
        if (this._options.edit) {
            selector_engine_1.default.find(ATTR_CELL, this._element).forEach((cell) => {
                event_handler_1.default.off(cell, "input");
            });
        }
        if (this._options.clickableRows) {
            selector_engine_1.default.find(ATTR_ROW, this._element).forEach((row) => {
                event_handler_1.default.off(row, "click");
            });
        }
        selector_engine_1.default.find(ATTR_SORT_ICON, this._element).forEach((icon) => {
            const [header] = selector_engine_1.default.parents(icon, "th");
            event_handler_1.default.off(header, "click");
        });
        if (this._options.selectable) {
            event_handler_1.default.off(this._headerCheckbox, "input");
            this._checkboxes.forEach((checkbox) => {
                event_handler_1.default.off(checkbox, "input");
            });
        }
    }
    _renderTable() {
        this._element.innerHTML = (0, table_1.default)(this.tableOptions).table;
        this._formatCells();
        event_handler_1.default.trigger(this._element, EVENT_RENDER);
    }
    _renderRows() {
        const body = selector_engine_1.default.findOne("tbody", this._element);
        if (this._options.pagination) {
            const navigation = selector_engine_1.default.findOne(ATTR_PAGINATION_NAV, this._element);
            navigation.innerText = this.navigationText;
        }
        body.innerHTML = (0, table_1.default)(this.tableOptions).rows;
        this._formatCells();
        if (this._options.edit) {
            this._setupEditable();
        }
        if (this._options.selectable) {
            this._setupSelectable();
            this._setSelected();
        }
        if (this._options.clickableRows) {
            this._setupClickableRows();
        }
        event_handler_1.default.trigger(this._element, EVENT_RENDER);
    }
    _formatCells() {
        const rows = selector_engine_1.default.find(ATTR_ROW, this._element);
        rows.forEach((row) => {
            const index = manipulator_1.default.getDataAttribute(row, "index");
            const cells = selector_engine_1.default.find(ATTR_CELL, row);
            cells.forEach((cell) => {
                const field = manipulator_1.default.getDataAttribute(cell, "field");
                const column = this.columns.find((column) => column.field === field);
                if (column && column.format !== null) {
                    column.format(cell, this.rows[index][field]);
                }
            });
        });
    }
    _toggleDisableState() {
        if (this._options.pagination === false) {
            return;
        }
        if (this._activePage === 0 || this._options.loading) {
            this._paginationLeft.setAttribute("disabled", "");
            if (this._options.fullPagination) {
                this._paginationStart.setAttribute("disabled", "");
            }
        }
        else {
            this._paginationLeft.removeAttribute("disabled");
            if (this._options.fullPagination) {
                this._paginationStart.removeAttribute("disabled");
            }
        }
        if (this._activePage === this.pages - 1 ||
            this._options.loading ||
            this.pages === 0) {
            this._paginationRight.setAttribute("disabled", "");
            if (this._options.fullPagination) {
                this._paginationEnd.setAttribute("disabled", "");
            }
        }
        else {
            this._paginationRight.removeAttribute("disabled");
            if (this._options.fullPagination) {
                this._paginationEnd.removeAttribute("disabled");
            }
        }
    }
    _toggleSelectAll(e) {
        if (e.target.checked) {
            this._selected = this.rows.map((row) => row.rowIndex);
        }
        else
            this._selected = [];
        this._setSelected();
        this._emitSelectEvent();
    }
    _toggleSelectRow(e, rowIndex) {
        if (e.target.checked) {
            if (this._options.multi && !this._selected.includes(rowIndex)) {
                this._selected = [...this._selected, rowIndex];
            }
            else {
                this._selected = [rowIndex];
                this._checkboxes.forEach((checkbox) => {
                    if (checkbox !== e.target) {
                        checkbox.checked = false;
                    }
                });
            }
        }
        else {
            this._selected = this._selected.filter((index) => index !== rowIndex);
        }
        if (this._options.multi && !e.target.checked) {
            this._headerCheckbox.checked = false;
        }
        this._setActiveRows();
        this._emitSelectEvent();
    }
    _updateRow(event, index) {
        const field = manipulator_1.default.getDataAttribute(event.target, "field");
        const value = event.target.textContent;
        const row = this._rows[index];
        if (Array.isArray(row)) {
            const column = this.columns.find((column) => {
                return column.field === field;
            });
            const columnIndex = column.columnIndex;
            row[columnIndex] = value;
        }
        else {
            row[field] = value;
        }
        event_handler_1.default.trigger(this._element, EVENT_UPDATE, {
            rows: this._rows,
            columns: this._columns,
        });
    }
    static jQueryInterface(config, param1, param2) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Datatable(this, _config, param1);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](param1, param2);
            }
        });
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
exports.default = Datatable;
//# sourceMappingURL=index.js.map