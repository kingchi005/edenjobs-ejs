"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../util/index");
const data_1 = __importDefault(require("../../dom/data"));
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const chartDefaults_1 = require("./chartDefaults");
const deepmerge_1 = __importDefault(require("deepmerge"));
const NAME = "chart";
const DATA_KEY = "te.chart";
const CLASSNAME_CHARTS = "chart";
const GENERATE_DATA = (options, type, defaultType) => {
    const mergeObjects = (target, source, options) => {
        const destination = target.slice();
        source.forEach((item, index) => {
            if (typeof destination[index] === "undefined") {
                destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
            }
            else if (options.isMergeableObject(item)) {
                destination[index] = (0, deepmerge_1.default)(target[index], item, options);
            }
            else if (target.indexOf(item) === -1) {
                destination.push(item);
            }
        });
        return destination;
    };
    return (0, deepmerge_1.default)(defaultType[type], options, {
        arrayMerge: mergeObjects,
    });
};
const DEFAULT_DARK_OPTIONS = {
    darkTicksColor: "#fff",
    darkLabelColor: "#fff",
    darkGridLinesColor: "#555",
    darkmodeOff: "undefined",
    darkMode: null,
    darkBgColor: "#262626",
    darkBgColorLight: "#fff",
    options: null,
};
const DARK_OPTIONS_TYPE = {
    darkTicksColor: "string",
    darkLabelColor: "string",
    darkGridLinesColor: "string",
    darkmodeOff: "(string|null)",
    darkMode: "(string|null)",
    darkBgColor: "string",
    darkBgColorLight: "string",
    options: "(object|null)",
};
class Chart {
    constructor(element, data, options = {}, darkOptions = {}) {
        this._waitForCharts(element, data, options, darkOptions);
    }
    _getChartjs() {
        return __awaiter(this, void 0, void 0, function* () {
            const { Chart: Chartjs, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle, } = yield Promise.resolve().then(() => __importStar(require("chart.js")));
            Chartjs.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle);
            return Chartjs;
        });
    }
    _getChartDataLabels() {
        return __awaiter(this, void 0, void 0, function* () {
            const ChartDataLabels = yield Promise.resolve().then(() => __importStar(require("chartjs-plugin-datalabels")));
            return ChartDataLabels;
        });
    }
    _waitForCharts(element, data, options = {}, darkOptions = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this._Chartjs = yield this._getChartjs();
            this._ChartDataLabels = yield this._getChartDataLabels();
            this._element = element;
            this._data = data;
            this._options = options;
            this._type = data.type;
            this._canvas = null;
            this._chart = null;
            this._darkOptions = this._getDarkConfig(darkOptions);
            this._darkModeClassContainer = document.querySelector("html");
            this._prevConfig = null;
            this._observer = null;
            if (this._element) {
                data_1.default.setData(element, DATA_KEY, this);
                manipulator_1.default.addClass(this._element, CLASSNAME_CHARTS);
                this._chartConstructor();
            }
            if (this._darkOptions.darkmodeOff !== null) {
                const mode = this._darkOptions.darkMode === "dark"
                    ? "dark"
                    : this._darkOptions.darkMode === "light"
                        ? "light"
                        : this.systemColorMode;
                this._handleMode(mode);
                this._observer = new MutationObserver(this._observerCallback.bind(this));
                this._observer.observe(this._darkModeClassContainer, {
                    attributes: true,
                });
            }
        });
    }
    static get NAME() {
        return NAME;
    }
    get systemColorMode() {
        return (localStorage.theme ||
            (this._darkModeClassContainer.classList.contains("dark")
                ? "dark"
                : "light"));
    }
    dispose() {
        this._observer.disconnect();
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    update(data, config) {
        if (data) {
            this._data = Object.assign(Object.assign({}, this._data), data);
            this._chart.data = this._data;
        }
        const configOptions = Object.prototype.hasOwnProperty.call(config, "options")
            ? config
            : { options: Object.assign({}, config) };
        this._options = (0, deepmerge_1.default)(this._options, configOptions);
        this._chart.options = GENERATE_DATA(this._options, this._type, chartDefaults_1.DEFAULT_OPTIONS).options;
        this._chart.update();
    }
    setTheme(theme) {
        if ((theme !== "dark" && theme !== "light") || !this._data) {
            return;
        }
        this._handleMode(theme);
    }
    _getDarkConfig(config) {
        let dataAttributes = {};
        const dataAttr = manipulator_1.default.getDataAttributes(this._element);
        Object.keys(dataAttr).forEach((key) => key.startsWith("dark") && (dataAttributes[key] = dataAttr[key]));
        dataAttributes = Object.assign(Object.assign({}, DEFAULT_DARK_OPTIONS), dataAttributes);
        const xyScale = {
            y: {
                ticks: {
                    color: dataAttributes.darkTicksColor,
                },
                grid: {
                    color: dataAttributes.darkGridLinesColor,
                },
            },
            x: {
                ticks: {
                    color: dataAttributes.darkTicksColor,
                },
                grid: {
                    color: dataAttributes.darkGridLinesColor,
                },
            },
        };
        const rScale = {
            r: {
                ticks: {
                    color: dataAttributes.darkTicksColor,
                    backdropColor: dataAttributes.darkBgColor,
                },
                grid: {
                    color: dataAttributes.darkGridLinesColor,
                },
                pointLabels: {
                    color: dataAttributes.darkTicksColor,
                },
            },
        };
        const radials = ["pie", "doughnut", "polarArea", "radar"];
        const scales = !radials.includes(this._type)
            ? xyScale
            : ["polarArea", "radar"].includes(this._type)
                ? rScale
                : {};
        const opt = {
            scales,
            plugins: {
                legend: {
                    labels: {
                        color: dataAttributes.darkLabelColor,
                    },
                },
            },
        };
        config = Object.assign(Object.assign(Object.assign({}, dataAttributes), { options: Object.assign({}, opt) }), config);
        (0, index_1.typeCheckConfig)(NAME, config, DARK_OPTIONS_TYPE);
        return config;
    }
    _chartConstructor() {
        if (this._data) {
            this._createCanvas();
            const options = GENERATE_DATA(this._options, this._type, chartDefaults_1.DEFAULT_OPTIONS);
            const plugins = [];
            if (options.dataLabelsPlugin) {
                plugins.push(this._ChartDataLabels.default);
            }
            this._prevConfig = options;
            this._chart = new this._Chartjs(this._canvas, Object.assign(Object.assign(Object.assign({}, this._data), options), { plugins }));
        }
    }
    _createCanvas() {
        if (this._canvas)
            return;
        if (this._element.nodeName === "CANVAS") {
            this._canvas = this._element;
        }
        else {
            this._canvas = (0, index_1.element)("canvas");
            this._element.appendChild(this._canvas);
        }
    }
    _handleMode(systemColor) {
        if (systemColor === "dark") {
            this._changeDatasetBorderColor();
            this.update(null, this._darkOptions.options);
        }
        else {
            this._changeDatasetBorderColor(false);
            this._prevConfig && this.update(null, this._prevConfig);
        }
    }
    _observerCallback(mutationList) {
        for (const mutation of mutationList) {
            if (mutation.type === "attributes") {
                this._handleMode(this.systemColorMode);
            }
        }
    }
    _changeDatasetBorderColor(dark = true) {
        [...this._data.data.datasets].forEach((set) => ["pie", "doughnut", "polarArea"].includes(this._type) &&
            (set.borderColor = dark
                ? this._darkOptions.darkBgColor
                : this._darkOptions.darkBgColorLight));
    }
    static jQueryInterface(data, options, type) {
        return this.each(function () {
            let chartData = data_1.default.getData(this, DATA_KEY);
            if (!chartData && /dispose/.test(data)) {
                return;
            }
            if (!chartData) {
                const chartOptions = options
                    ? GENERATE_DATA(options, type, chartDefaults_1.DEFAULT_OPTIONS)
                    : chartDefaults_1.DEFAULT_OPTIONS[type];
                chartData = new Chart(this, Object.assign(Object.assign({}, data), chartOptions));
            }
            if (typeof data === "string") {
                if (typeof chartData[data] === "undefined") {
                    throw new TypeError(`No method named "${data}"`);
                }
                chartData[data](options, type);
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
exports.default = Chart;
//# sourceMappingURL=charts.js.map