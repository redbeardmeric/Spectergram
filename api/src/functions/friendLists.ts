import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import jwt from "jsonwebtoken";

interface FriendRequestBody {
	friendUsername: string;
}

const users: Record<string, { password: string; friends: Set<string> }> = {};
const JWT_SECRET = "your_secret_key";

function authenticate(request: HttpRequest): string | null {
	const auth = request.headers.get("authorization");
	if (!auth) return null;
	try {
		const token = auth.split(" ")[1];
		const payload = jwt.verify(token, JWT_SECRET) as { username: string };
		return payload.username;
	} catch {
		return null;
	}
}

export async function friends(
	request: HttpRequest,
	_context: InvocationContext,
): Promise<HttpResponseInit> {
	const username = authenticate(request);
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
