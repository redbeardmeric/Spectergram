import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext,
} from "@azure/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: Record<string, { password: string }> = {};
const JWT_SECRET = "your_secret_key";

export async function login(
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponseInit> {
    const { username, password } = await request.json();
    const user = users[username];
    if (!user) {
        return { status: 401, body: "Invalid credentials" };
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { status: 401, body: "Invalid credentials" };
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    return { status: 200, body: JSON.stringify({ token }) };
}

app.http("login", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: login,
});
