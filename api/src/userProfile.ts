import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext,
} from "@azure/functions";
import jwt from "jsonwebtoken";

const users: Record<string, { password: string, profile: any }> = {};
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

export async function profile(
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponseInit> {
    const username = authenticate(request);
    if (!username) return { status: 401, body: "Unauthorized" };
    const user = users[username];
    if (!user) return { status: 404, body: "User not found" };

    if (request.method === "GET") {
        return { status: 200, body: JSON.stringify({ profile: user.profile || {} }) };
    }
    if (request.method === "PUT") {
        const { bio, displayName } = await request.json();
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

