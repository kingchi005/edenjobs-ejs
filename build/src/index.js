"use strict";
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const response_controller_1 = __importDefault(require("./controllers/response.controller"));
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || 500;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.text());
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve("public"))));
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve("node_modules"))));
app.use(routes_1.pageRoute);
app.use("/api", routes_1.apiRoute);
app.use(response_controller_1.default);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Serving at localhost:${PORT}`);
}));
//# sourceMappingURL=index.js.map