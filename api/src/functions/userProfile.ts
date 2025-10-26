import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import { extractBearer, verifyToken } from "../utils/validateToken";

interface UserProfile {
	bio?: string;
	displayName?: string;
}

interface ProfileRequestBody {
	bio?: string;
	displayName?: string;
}

const users: Record<string, { password: string; profile: UserProfile }> = {};

async function authenticate(request: HttpRequest): Promise<string | null> {
	const auth = request.headers.get("authorization");
	const token = extractBearer(auth);
	if (!token) return null;
	try {
		const payload: any = await verifyToken(token);
		// Prefer 'preferred_username' or 'email' or 'sub' claim
		return (payload.preferred_username ||
			payload.email ||
			payload.sub ||
			null) as string | null;
	} catch (err) {
		// verification failed
		return null;
	}
}

export async function profile(
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
			body: JSON.stringify({ profile: user.profile || {} }),
		};
	}

	if (request.method === "PUT") {
		const { bio, displayName } = (await request.json()) as ProfileRequestBody;
		user.profile = user.profile || {};
		if (bio !== undefined) user.profile.bio = bio;
		if (displayName !== undefined) user.profile.displayName = displayName;
		return { status: 200, body: JSON.stringify({ profile: user.profile }) };
	}

	return { status: 405, body: "Method not allowed" };
}

app.http("profile", {
	methods: ["GET", "PUT"],
	authLevel: "anonymous",
	handler: profile,
});
