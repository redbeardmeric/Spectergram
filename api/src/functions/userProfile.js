"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = void 0;
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
async function profile(request, _context) {
    const username = authenticate(request);
    if (!username)
        return { status: 401, body: "Unauthorized" };
    const user = users[username];
    if (!user)
        return { status: 404, body: "User not found" };
    if (request.method === "GET") {
        return { status: 200, body: JSON.stringify({ profile: user.profile || {} }) };
    }
    if (request.method === "PUT") {
        const { bio, displayName } = await request.json();
        user.profile = user.profile || {};
        if (bio !== undefined)
            user.profile.bio = bio;
        if (displayName !== undefined)
            user.profile.displayName = displayName;
        return { status: 200, body: JSON.stringify({ profile: user.profile }) };
    }
    return { status: 405, body: "Method not allowed" };
}
exports.profile = profile;
functions_1.app.http("profile", {
    methods: ["GET", "PUT"],
    authLevel: "anonymous",
    handler: profile,
});
