
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import bcrypt from "bcryptjs";


interface RegisterRequestBody {
    username: string;
    password: string;
}

export async function register(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { username, password } = (await request.json()) as RegisterRequestBody;

        if (!username || !password) {
            return { status: 400, body: "Username and password required" };
        }

        // Check if user exists
        const existing = await db.query('SELECT * FROM "user" WHERE username = $1', [username]);
        if (existing.rows.length > 0) {
            return { status: 409, body: "Username already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, hashedPassword]);

        return { status: 201, body: "User registered successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, body: "Internal server error" };
    }
}

app.http("register", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: register,
});


