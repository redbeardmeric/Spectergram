import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext,
} from "@azure/functions";
import bcrypt from "bcryptjs";

interface RegisterRequestBody {
    username: string;
    password: string;
}

const users: Record<string, { password: string }> = {};

export async function register(
    request: HttpRequest,
    _context: InvocationContext, 
): Promise<HttpResponseInit> {
    const { username, password } = await request.json() as RegisterRequestBody;

    if (!username || !password) {
        return { status: 400, body: "Username and password required" };
    }
    if (users[username]) {
        return { status: 409, body: "Username already exists" };
    }
    const hashed = await bcrypt.hash(password, 10);
    users[username] = { password: hashed };
    return { status: 201, body: "User registered successfully" };
}

app.http("register", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: register,
});
