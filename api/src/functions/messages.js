"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
const functions_1 = require("@azure/functions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users = {};
const JWT_SECRET = "your_secret_key";
function authenticate(request) {
    const auth = request.headers.get("authorization");
    if (!auth)
        return null;
    try {
        const token = auth.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return payload.username;
    }
    catch {
        return null;
    }
}
async function messages(request, _context) {
    const username = authenticate(request);
    if (!username)
        return { status: 401, body: "Unauthorized" };
    const user = users[username];
    if (!user)
        return { status: 404, body: "User not found" };
    if (request.method === "GET") {
        return { status: 200, body: JSON.stringify({ messages: user.messages || [] }) };
    }
    if (request.method === "POST") {
        const { to, message } = await request.json();
        if (!users[to])
            return { status: 404, body: "Recipient not found" };
        if (!user.friends || !user.friends.has(to))
            return { status: 400, body: "Recipient is not your friend" };
        users[to].messages = users[to].messages || [];
        users[to].messages.push({ from: username, message, timestamp: new Date().toISOString() });
        return { status: 200, body: "Message sent" };
    }
    return { status: 405, body: "Method not allowed" };
}
exports.messages = messages;
functions_1.app.http("messages", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: messages,
});
