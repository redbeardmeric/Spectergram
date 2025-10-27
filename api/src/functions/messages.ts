import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import { extractBearer, verifyToken } from "../utils/validateToken";

interface MessageRequestBody {
	to: string;
	message: string;
}

interface UserStore {
	password: string;
	friends: Set<string>;
	messages: { from: string; message: string; timestamp: string }[];
}

const users: Record<string, UserStore> = {};

async function authenticate(request: HttpRequest): Promise<string | null> {
	const auth = request.headers.get("authorization");
	const token = extractBearer(auth);
	if (!token) return null;
	try {
		const payload: any = await verifyToken(token);
		// Support both custom JWT (username) and Entra ID tokens
		return (payload.username ||
			payload.preferred_username ||
			payload.email ||
			payload.sub ||
			null) as string | null;
	} catch {
		return null;
	}
}

export async function messages(
	request: HttpRequest,
	_context: InvocationContext,
): Promise<HttpResponseInit> {
	const username = await authenticate(request);
	if (!username) return { status: 401, body: "Unauthorized" };
	const user = users[username];
	if (!user) return { status: 404, body: "User not found" };

	if (request.method === "GET") {
		return {
			status: 200,
			body: JSON.stringify({ messages: user.messages || [] }),
		};
	}

	if (request.method === "POST") {
		const { to, message } = (await request.json()) as MessageRequestBody;
		if (!users[to]) return { status: 404, body: "Recipient not found" };
		if (!user.friends || !user.friends.has(to))
			return { status: 400, body: "Recipient is not your friend" };
		users[to].messages = users[to].messages || [];
		users[to].messages.push({
			from: username,
			message,
			timestamp: new Date().toISOString(),
		});
		return { status: 200, body: "Message sent" };
	}

	return { status: 405, body: "Method not allowed" };
}

app.http("messages", {
	methods: ["GET", "POST"],
	authLevel: "anonymous",
	handler: messages,
});
