import express from "express";
import { PrismaStudioMiddleware } from "express-prisma-studio";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();
app.use(
	"/prisma",
	PrismaStudioMiddleware(prisma, {
		schemaPath: "./node_modules/.prisma/client/schema.prisma",
		assetPath: "./node_modules/@prisma/studio/dist",
		basePath: "/client",
	})
);

app.listen(3000, () => {
	console.log("Server is ready: http://localhost:3000");
});
