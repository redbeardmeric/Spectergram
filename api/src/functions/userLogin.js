"use strict";
// /*import {
//     app,
//     type HttpRequest,
//     type HttpResponseInit,
//     type InvocationContext,
// } from "@azure/functions";
// import bcrypt = require("bcryptjs")
// import jwt from "jsonwebtoken";
// // Define user storage type
// interface UserRecord {
//     password: string;
// }
// // Define the expected request body structure
// interface LoginRequestBody {
//     username: string;
//     password: string;
// }
// const users: Record<string, UserRecord> = {};
// const JWT_SECRET = "your_secret_key";
// export async function login(
//     request: HttpRequest,
//     _context: InvocationContext,  
// ): Promise<HttpResponseInit> {
//     const { username, password } = (await request.json()) as LoginRequestBody;
//     const user = users[username];
//     if (!user) {
//         return { status: 401, body: "Invalid credentials" };
//     }
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//         return { status: 401, body: "Invalid credentials" };
//     }
//     // Generate JWT
//     const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
//     return {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token }),
//     };
// }
// app.http("login", {
//     methods: ["POST"],
//     authLevel: "anonymous",
//     handler: login,
// });*/
// import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import  {db}  from "./db";
// interface LoginRequestBody {
//     username: string;
//     password: string;
// }
// const JWT_SECRET = "your_secret_key";
// export async function login(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
//     try {
//         const { username, password } = (await request.json()) as LoginRequestBody;
//         const result = await db.query('SELECT * FROM "user" WHERE username = $1', [username]);
//         if (result.rows.length === 0) {
//             return { status: 401, body: "Invalid credentials" };
//         }
//         const user = result.rows[0];
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return { status: 401, body: "Invalid credentials" };
//         }
//         const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
//         return {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ token }),
//         };
//     } catch (error) {
//         console.error(error);
//         return { status: 500, body: "Internal server error" };
//     }
// }
// app.http("login", {
//     methods: ["POST"],
//     authLevel: "anonymous",
//     handler: login,
// });
