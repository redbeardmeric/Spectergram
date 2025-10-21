
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { log } from "console";
import { resolveAny } from "dns";

interface LoginRequestBody {
    username: string;
    gmail?: string;
    password: string;
}


const JWT_SECRET = "samyog";

export async function login(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { username, gmail, password } = (await request.json()) as LoginRequestBody;

        if (!username && !gmail || !password) {
            return { status: 400, body: "Username or gmail and password required" };
        }
        let userQuery;
        let queryParam;

        // Check whether user is logging in via Gmail or Username
        if (gmail) {
            userQuery = 'SELECT * FROM "user" WHERE gmail = $1';
            queryParam = gmail;
        } else {
            userQuery = 'SELECT * FROM "user" WHERE username = $1';
            queryParam = username!;
        }

        // Check if user exists
        const result = await db.query(userQuery, [queryParam]);
        const user = result.rows[0];
        log(user);
        if (!user) {
            return { status: 401, body: "Invalid username or gmail" };
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
            body: JSON.stringify({ message: "Login successful", token, user: {id: user.id, username: user.username, gmail: user.gmail} }),
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