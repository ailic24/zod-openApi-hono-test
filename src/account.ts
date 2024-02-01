import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

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

export { accountApi };
