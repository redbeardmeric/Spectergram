import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext,
} from "@azure/functions";
import jwt from "jsonwebtoken";

// Types for message structure and request body
interface MessageRequestBody {
    to: string;
    message: string;
}

interface UserStore {
    password: string;
    friends: Set<string>;
    messages: { from: string; message: string; timestamp: string }[];
}

// In-memory user/message storage (replace with a real DB in production!)
const users: Record<string, UserStore> = {};
const JWT_SECRET = "your_secret_key";

// JWT authentication
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

export async function messages(
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponseInit> {
    const username = authenticate(request);
    if (!username) return { status: 401, body: "Unauthorized" };
    const user = users[username];
    if (!user) return { status: 404, body: "User not found" };

    // GET: Fetch all received messages for this user
    if (request.method === "GET") {
        return { status: 200, body: JSON.stringify({ messages: user.messages || [] }) };
    }

    // POST: Send a message to a friend
    if (request.method === "POST") {
        const { to, message } = await request.json() as MessageRequestBody;
        if (!users[to]) return { status: 404, body: "Recipient not found" };
        if (!user.friends || !user.friends.has(to)) return { status: 400, body: "Recipient is not your friend" };
        users[to].messages = users[to].messages || [];
        users[to].messages.push({ from: username, message, timestamp: new Date().toISOString() });
        return { status: 200, body: "Message sent" };
    }

    // Unsupported method
    return { status: 405, body: "Method not allowed" };
}

app.http("messages", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: messages,
});
