import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext,
} from "@azure/functions";
import bcrypt = require("bcryptjs")
import {jwt} from "jsonwebtoken";

// Define user storage type
interface UserRecord {
    password: string;
}

// Define the expected request body structure
interface LoginRequestBody {
    username: string;
    password: string;
}

const users: Record<string, UserRecord> = {};
const JWT_SECRET = "your_secret_key";

export async function login(
    request: HttpRequest,
    _context: InvocationContext,  
): Promise<HttpResponseInit> {
    
    const { username, password } = (await request.json()) as LoginRequestBody;

    const user = users[username];
    if (!user) {
        return { status: 401, body: "Invalid credentials" };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { status: 401, body: "Invalid credentials" };
    }

    // Generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    };
}


app.http("login", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: login,
});
