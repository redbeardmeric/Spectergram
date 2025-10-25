import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import { extractBearer, verifyToken } from "../utils/validateToken";

interface FriendRequestBody {
	friendUsername: string;
}

const users: Record<string, { password: string; friends: Set<string> }> = {};

async function authenticate(request: HttpRequest): Promise<string | null> {
	const auth = request.headers.get("authorization");
	const token = extractBearer(auth);
	if (!token) return null;
	try {
		const payload: any = await verifyToken(token);
		return (payload.preferred_username ||
			payload.email ||
			payload.sub ||
			null) as string | null;
	} catch {
		return null;
	}
}

export async function friends(
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
			body: JSON.stringify({ friends: Array.from(user.friends || []) }),
		};
	}
	if (request.method === "POST") {
		const { friendUsername } = (await request.json()) as FriendRequestBody;
		if (!users[friendUsername])
			return { status: 404, body: "Friend not found" };
		user.friends = user.friends || new Set();
		user.friends.add(friendUsername);
		return { status: 200, body: "Friend added" };
	}
	if (request.method === "DELETE") {
		const { friendUsername } = (await request.json()) as FriendRequestBody;
		user.friends = user.friends || new Set();
		user.friends.delete(friendUsername);
		return { status: 200, body: "Friend removed" };
	}
	return { status: 405, body: "Method not allowed" };
}

app.http("friends", {
	methods: ["GET", "POST", "DELETE"],
	authLevel: "anonymous",
	handler: friends,
});
