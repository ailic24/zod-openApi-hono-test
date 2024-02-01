import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { prettyJSON } from "hono/pretty-json";

const app = new OpenAPIHono();
app.use("/doc/*", prettyJSON());

const ParamsSchema = z.object({
	id: z
		.string()
		.min(3)
		.openapi({
			param: {
				name: "id",
				in: "path",
			},
			example: "1212121",
		}),
});

const UserSchema = z
	.object({
		id: z.string().openapi({
			example: "123",
		}),
		name: z.string().openapi({
			example: "John Doe",
		}),
		age: z.number().openapi({
			example: 42,
		}),
	})
	.openapi("User");

const route = createRoute({
	method: "get",
	path: "/users/{id}",
	request: {
		params: ParamsSchema,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: UserSchema,
				},
			},
			description: "Retrieve the user",
		},
	},
});

app.openapi(route, (c) => {
	const { id } = c.req.valid("param");
	return c.json({
		id,
		age: 20,
		name: "Ultra-man",
	});
});

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "test api",
	},
});

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
