"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friends = void 0;
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
async function friends(request, _context) {
    const username = authenticate(request);
    if (!username)
        return { status: 401, body: "Unauthorized" };
    const user = users[username];
    if (!user)
        return { status: 404, body: "User not found" };
    if (request.method === "GET") {
        return { status: 200, body: JSON.stringify({ friends: Array.from(user.friends || []) }) };
    }
    if (request.method === "POST") {
        const { friendUsername } = await request.json();
        if (!users[friendUsername])
            return { status: 404, body: "Friend not found" };
        user.friends = user.friends || new Set();
        user.friends.add(friendUsername);
        return { status: 200, body: "Friend added" };
    }
    if (request.method === "DELETE") {
        const { friendUsername } = await request.json();
        user.friends = user.friends || new Set();
        user.friends.delete(friendUsername);
        return { status: 200, body: "Friend removed" };
    }
    return { status: 405, body: "Method not allowed" };
}
exports.friends = friends;
functions_1.app.http("friends", {
    methods: ["GET", "POST", "DELETE"],
    authLevel: "anonymous",
    handler: friends,
});
