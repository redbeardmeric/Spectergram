"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
/*import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext,
} from "@azure/functions";
import bcrypt = require("bcryptjs")

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
});*/
const functions_1 = require("@azure/functions");
import * as bcrypt from 'bcrypt'; // Or import * as bcrypt from 'bcryptjs';
const db_1 = require("../functions/db");
const { log } = require("console");
async function register(request, _context) {
    try {
        const { username, password } = (await request.json());
        if (!username || !password) {
            return { status: 400, body: "Username and password required" };
        }
        // Check if user exists
        const existing = await db_1.db.query('SELECT * FROM "user" WHERE username = $1', [username]);
        if (existing.rows.length > 0) {
            return { status: 409, body: "Username already exists" };
        }
        log(password);
        const hashedPassword = await bcrypt.hash(password, 10);
        log(hashedPassword);
        await db_1.db.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        return { status: 201, body: "User registered successfully" };
    }
    catch (error) {
        console.error(error);
        return { status: 500, body: "Internal server error" };
    }
}
exports.register = register;
functions_1.app.http("register", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: register,
});
