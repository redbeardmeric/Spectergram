import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import * as sql from "mssql";
import { getPool } from "../db";

interface SearchRequestBody {
	query: string; // Can be username or gmail
}

interface UserRecord {
	id: number;
	name: string;
	gmail: string;
	online: boolean;
	friendship_status: "friend" | "pending" | "not_friend";
}

export async function userSearch(
	request: HttpRequest,
	context: InvocationContext,
): Promise<HttpResponseInit> {
	try {
		let query: string | undefined =
			request.method === "GET"
				? (request.query.get("query") ?? undefined)
				: undefined;

		if (!query && request.method === "POST") {
			const body = (await request.json()) as SearchRequestBody;
			query = body.query;
		}

		if (!query || !query.trim()) {
			return { status: 400, body: "Search query is required" };
		}

		// 2️⃣ Get current user ID from headers
		const currentUserId = Number(request.headers.get("x-user-id") ?? 0);
		if (!currentUserId) {
			return {
				status: 400,
				body: "Current user ID is required in header x-user-id",
			};
		}

		const pool = await getPool();

		const result = await pool
			.request()
			.input("query", sql.NVarChar, `%${query}%`)
			.input("currentUserId", sql.Int, currentUserId)
			.query(`
                SELECT 
                    u.id,
                    u.username AS name,
                    u.gmail,
                    CASE 
                        WHEN f.status = 'accepted' THEN 'friend'
                        WHEN f.status = 'pending' THEN 'pending'
                        ELSE 'not_friend'
                    END AS friendship_status,
                    ISNULL(p.status, 'offline') AS online
                FROM [user] u
                LEFT JOIN friendships f
                    ON ((f.user_id = @currentUserId AND f.friend_id = u.id)
                        OR (f.friend_id = @currentUserId AND f.user_id = u.id))
                LEFT JOIN user_presence p
                    ON p.user_id = u.id
                WHERE (u.username LIKE @query OR u.gmail LIKE @query)
                  AND u.id != @currentUserId
            `);

		const users: UserRecord[] = result.recordset.map((row) => ({
			id: row.id,
			name: row.name,
			gmail: row.gmail,
			online: row.online === "online",
			friendship_status: row.friendship_status as
				| "friend"
				| "pending"
				| "not_friend",
		}));

		if (users.length === 0) {
			return {
				status: 404,
				jsonBody: {
					message: "No users found",
					count: 0,
					users: [],
				},
			};
		}

		return {
			status: 200,
			jsonBody: {
				message: "Users found successfully",
				count: users.length,
				users,
			},
		};
	} catch (error: unknown) {
		console.error("User search error:", error);
		context.error("Error searching users:", error);
		return { status: 500, body: "Internal server error" };
	}
}

app.http("users/search", {
	methods: ["GET", "POST"],
	authLevel: "anonymous",
	handler: userSearch,
});
