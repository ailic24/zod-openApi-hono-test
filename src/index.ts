import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { api } from "./api";

const app = new Hono({ strict: false });

app.route("/", api);
app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
