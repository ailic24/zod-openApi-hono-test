import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ErrorSchema } from "./shared";

enum AccountTypeEnum {
	BANK_ACCOUNT = "BANK_ACCOUNT",
	RETIREMENT_ACCOUNT = "RETIREMENT_ACCOUNT",
}

const BankAccountSchema = z
	.object({
		id: z.string().openapi({
			example: "1",
		}),
		name: z.string().openapi({
			example: "John Doe",
		}),
		accountType: z.literal("BANK_ACCOUNT"),
	})
	.openapi("BankAccountSchema");

const RetirementAccountSchema = z
	.object({
		id: z.string().openapi({
			example: "1",
		}),
		name: z.string().openapi({
			example: "John Doe",
		}),
		age: z.number().openapi({
			example: 24,
		}),
		accountType: z.literal("RETIREMENT_ACCOUNT"),
	})
	.openapi("RetirementAccountSchema");

const AccountSchema = z.discriminatedUnion("accountType", [
	BankAccountSchema,
	RetirementAccountSchema,
]);

const accountApi = new OpenAPIHono();

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
	const data = c.req.valid("json");
	return c.json(data);
});

export { accountApi };
