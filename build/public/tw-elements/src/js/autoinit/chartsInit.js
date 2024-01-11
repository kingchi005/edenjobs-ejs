"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartsCallback = void 0;
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const chartDefaults_1 = require("../data/chart/chartDefaults");
const chartsCallback = (component, initSelector) => {
    const IS_COMPLEX = (data) => {
        return ((data[0] === "{" && data[data.length - 1] === "}") ||
            (data[0] === "[" && data[data.length - 1] === "]"));
    };
    const CONVERT_DATA_TYPE = (data) => {
        if (typeof data !== "string")
            return data;
        if (IS_COMPLEX(data)) {
            return JSON.parse(data.replace(/'/g, '"'));
        }
        return data;
    };
    const PARSE_DATA = (data) => {
        const dataset = {};
        Object.keys(data).forEach((property) => {
            if (property.match(/dataset.*/)) {
                const chartProperty = property
                    .slice(7, 8)
                    .toLowerCase()
                    .concat(property.slice(8));
                dataset[chartProperty] = CONVERT_DATA_TYPE(data[property]);
            }
        });
        return dataset;
    };
    selector_engine_1.default.find(initSelector).forEach((el) => {
        if (manipulator_1.default.getDataAttribute(el, "chart") !== "bubble" &&
            manipulator_1.default.getDataAttribute(el, "chart") !== "scatter") {
            const dataSet = manipulator_1.default.getDataAttributes(el);
            const dataAttr = {
                data: {
                    datasets: [PARSE_DATA(dataSet)],
                },
            };
            if (dataSet.chart) {
                dataAttr.type = dataSet.chart;
            }
            if (dataSet.labels) {
                dataAttr.data.labels = JSON.parse(dataSet.labels.replace(/'/g, '"'));
            }
            return new component(el, Object.assign(Object.assign({}, dataAttr), chartDefaults_1.DEFAULT_OPTIONS[dataAttr.type]));
        }
        return null;
    });
};
exports.chartsCallback = chartsCallback;
//# sourceMappingURL=chartsInit.js.map