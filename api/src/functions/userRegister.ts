
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import bcrypt from "bcryptjs";
import { db } from "./db"; 

interface RegisterRequestBody {
    username: string;
    gmail: string;
    password: string;
}

export async function register(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { username, gmail, password } = (await request.json()) as RegisterRequestBody;

        if (!username || !gmail || !password) {
            return { status: 400, body: "Username and password required" };
        }

        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(gmail)) {
            return { status: 400, body: "Please provide a valid Gmail address" };
        }


        // Check if user or gmail exists
        const existing = await db.query('SELECT * FROM "user" WHERE username = $1  OR gmail = $2', [username, gmail]);
        if (existing.rows.length > 0) {
            return { status: 409, body: "Username or gmail already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO "user" (username, gmail, password) VALUES ($1, $2, $3)', [username, gmail, hashedPassword]);

        return { status: 201, body: "User registered successfully" };
    } catch (error) {
        console.error("Registration error:", error);
        return { status: 500, body: "Internal server error" };
    }
}

app.http("register", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: register,
});


