import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ErrorSchema } from "./shared";
const ParamsSchema = z.object({
	id: z
		.string()
		.min(1)
		.openapi({
			param: {
				name: "id",
				in: "path",
			},
			description: "The id of the account",
			example: "1",
		}),
});

const AccountSchema = z
	.object({
		id: z.string().openapi({
			example: "1",
		}),
		name: z.string().openapi({
			example: "John Doe",
		}),
		age: z.number().openapi({
			example: 42,
		}),
	})
	.openapi("Account");

const accountApi = new OpenAPIHono();

const getRoute = createRoute({
	method: "get",
	path: "/{id}",
	description: "Get Account",
	tags: ["account"],
	request: {
		params: ParamsSchema,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: AccountSchema,
				},
			},
			description: "Retrieve the account",
		},
	},
});

accountApi.openapi(getRoute, (c) => {
	const { id } = c.req.valid("param");
	return c.json({
		id,
		age: 20,
		name: "Ultra-man",
	});
});

const postRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["account"],
	description: "Create account",
	request: {
		body: {
			description: "Account data",
			content: {
				"application/json": {
					schema: AccountSchema,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: AccountSchema,
				},
			},
			description: "Account data received",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Returns an error",
		},
		403: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Returns an error",
		},
	},
});

accountApi.openapi(postRoute, (c) => {
	const { id, name, age } = c.req.valid("json");
	return c.json({
		id,
		age,
		name,
	});
});

export { accountApi };
