import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import { extractBearer, verifyToken } from "../utils/validateToken";

export async function tokenDebug(
	request: HttpRequest,
	_context: InvocationContext,
): Promise<HttpResponseInit> {
	const auth = request.headers.get("authorization");
	const token = extractBearer(auth);
	if (!token) return { status: 401, body: "Unauthorized: no bearer token" };

	try {
		const payload: any = await verifyToken(token);
		return {
			status: 200,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ok: true, claims: payload }, null, 2),
		};
	} catch (err: any) {
		return {
			status: 401,
			body: `Unauthorized: ${err?.message || String(err)}`,
		};
	}
}

app.http("tokenDebug", {
	methods: ["GET"],
	authLevel: "anonymous",
	handler: tokenDebug,
});
