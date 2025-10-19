
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { log } from "console";
import { resolveAny } from "dns";

interface LoginRequestBody {
    username: string;
    password: string;
}


const JWT_SECRET = "samyog";

export async function login(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { username, password } = (await request.json()) as LoginRequestBody;

        if (!username || !password) {
            return { status: 400, body: "Username and password required" };
        }

        // Check if user exists
        const result = await db.query('SELECT * FROM "user" WHERE username = $1', [username]);
        const user = result.rows[0];
        log(user);
        if (!user) {
            return { status: 401, body: "Invalid username." };
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        log(isValidPassword);
        if (!isValidPassword) {
            return { status: 401, body: "Invalid username or password" };
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: "1h" });

        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Login successful", token }),
        };
    } catch (error) {
        console.error(error);
        return { status: 500, body: "Internal server error" };
    }
}

app.http("login", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: login,
});