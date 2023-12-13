import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "../env";
import errorController, {
	ValidationError,
} from "./controllers/response.controller";
import { apiRoute, pageRoute } from "./routes";
import path from "path";
import { z } from "zod";
import { getStringValidation } from "./validations/schema";

const PORT = process.env.PORT || 500;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

app.set("view engine", "ejs");
app.use(express.static(path.join(path.resolve("public"))));
app.use(express.static(path.join(path.resolve("node_modules"))));

app.use(pageRoute);
app.use("/api", apiRoute);

// error handler
app.use(errorController);

// Read the Base64 encoded file from the backend

app.listen(PORT, async () => {
	console.log(`Serving at localhost:${PORT}`);
});
