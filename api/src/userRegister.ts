import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext,
} from "@azure/functions";
import bcrypt from "bcryptjs";

// Define the shape of the registration request body
interface RegisterRequestBody {
    username: string;
    password: string;
}

// In-memory user store (replace with DB in production)
const users: Record<string, { password: string }> = {};

export async function register(
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponseInit> {
    // Type the parsed body
    const { username, password } = await request.json() as RegisterRequestBody;

    // Validate username and password are present
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
