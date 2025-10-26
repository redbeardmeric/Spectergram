import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import * as sql from "mssql";
import { getPool } from "../db";
import { extractBearer, verifyToken } from "../utils/validateToken";

interface FriendRequestBody {
	friendUsername: string;
}

async function authenticate(request: HttpRequest): Promise<string | null> {
	const auth = request.headers.get("authorization");
	const token = extractBearer(auth);
	if (!token) return null;
	try {
		const payload: any = await verifyToken(token);
		// Support both custom JWT (username) and Entra ID tokens
		return (payload.username ||
			payload.preferred_username ||
			payload.email ||
			payload.sub ||
			null) as string | null;
	} catch {
		return null;
	}
}

export async function friends(
	request: HttpRequest,
	_context: InvocationContext,
): Promise<HttpResponseInit> {
	try {
		const username = await authenticate(request);
		if (!username) return { status: 401, body: "Unauthorized" };

		const pool = await getPool();

		// Get the user's ID from the database
		const userResult = await pool
			.request()
			.input("username", sql.VarChar, username)
			.query("SELECT id FROM [user] WHERE username = @username");

		if (userResult.recordset.length === 0) {
			return { status: 404, body: "User not found" };
		}

		const userId = userResult.recordset[0].id;

		if (request.method === "GET") {
			// Get all accepted friends for this user
			const friendsResult = await pool
				.request()
				.input("userId", sql.Int, userId)
				.query(`
					SELECT u.username, u.id
					FROM friendships f
					JOIN [user] u ON (f.friend_id = u.id)
					WHERE f.user_id = @userId AND f.status = 'accepted'
					UNION
					SELECT u.username, u.id
					FROM friendships f
					JOIN [user] u ON (f.user_id = u.id)
					WHERE f.friend_id = @userId AND f.status = 'accepted'
				`);

			const friends = friendsResult.recordset.map((f) => f.username);
			return {
				status: 200,
				jsonBody: { friends },
			};
		}

		if (request.method === "POST") {
			const { friendUsername } = (await request.json()) as FriendRequestBody;

			// Get friend's user ID
			const friendResult = await pool
				.request()
				.input("friendUsername", sql.VarChar, friendUsername)
				.query("SELECT id FROM [user] WHERE username = @friendUsername");

			if (friendResult.recordset.length === 0) {
				return { status: 404, body: "Friend not found" };
			}

			const friendId = friendResult.recordset[0].id;

			// Check if friendship already exists
			const existingResult = await pool
				.request()
				.input("userId", sql.Int, userId)
				.input("friendId", sql.Int, friendId)
				.query(`
					SELECT * FROM friendships
					WHERE (user_id = @userId AND friend_id = @friendId)
					OR (user_id = @friendId AND friend_id = @userId)
				`);

			if (existingResult.recordset.length > 0) {
				return { status: 400, body: "Friendship already exists" };
			}

			// Create friendship (auto-accepted for now, can be changed to pending)
			await pool
				.request()
				.input("userId", sql.Int, userId)
				.input("friendId", sql.Int, friendId)
				.query(`
					INSERT INTO friendships (user_id, friend_id, status)
					VALUES (@userId, @friendId, 'accepted')
				`);

			return {
				status: 200,
				jsonBody: { message: "Friend added successfully" },
			};
		}

		if (request.method === "DELETE") {
			const { friendUsername } = (await request.json()) as FriendRequestBody;

			// Get friend's user ID
			const friendResult = await pool
				.request()
				.input("friendUsername", sql.VarChar, friendUsername)
				.query("SELECT id FROM [user] WHERE username = @friendUsername");

			if (friendResult.recordset.length === 0) {
				return { status: 404, body: "Friend not found" };
			}

			const friendId = friendResult.recordset[0].id;

			// Delete friendship (bidirectional)
			await pool
				.request()
				.input("userId", sql.Int, userId)
				.input("friendId", sql.Int, friendId)
				.query(`
					DELETE FROM friendships
					WHERE (user_id = @userId AND friend_id = @friendId)
					OR (user_id = @friendId AND friend_id = @userId)
				`);

			return {
				status: 200,
				jsonBody: { message: "Friend removed successfully" },
			};
		}

		return { status: 405, body: "Method not allowed" };
	} catch (error) {
		console.error("Friends endpoint error:", error);
		return { status: 500, body: "Internal server error" };
	}
}

app.http("friends", {
	methods: ["GET", "POST", "DELETE"],
	authLevel: "anonymous",
	handler: friends,
});
