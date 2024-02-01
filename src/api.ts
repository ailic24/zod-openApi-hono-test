import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { accountApi } from "./account";
import { swaggerUI } from "@hono/swagger-ui";

export const api = new OpenAPIHono();

api.doc("/openapi", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Test API",
	},
});

api.use("/*", logger());
api.route("/account", accountApi);
api.get(
	"/openapi/ui",
	swaggerUI({
		url: "/openapi",
	}),
);
