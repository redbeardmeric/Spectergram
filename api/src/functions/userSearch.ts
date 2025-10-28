import {
	app,
	type HttpRequest,
	type HttpResponseInit,
	type InvocationContext,
} from "@azure/functions";
import * as sql from "mssql";
import { getPool } from "../db";

export async function userSearch(
	request: HttpRequest,
	context: InvocationContext,
): Promise<HttpResponseInit> {
	try {
		const url = new URL(request.url);
		const query = url.searchParams.get("query") || "";
		const currentUserId = Number(request.headers.get("x-user-id"));

		if (!query.trim()) {
			return { status: 400, body: "Query parameter is required" };
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
                    ON ( (f.user_id = @currentUserId AND f.friend_id = u.id)
                      OR (f.friend_id = @currentUserId AND f.user_id = u.id) )
                LEFT JOIN user_presence p
                    ON p.user_id = u.id
                WHERE (u.username LIKE @query OR u.gmail LIKE @query)
                  AND u.id != @currentUserId
            `);

		const users = result.recordset.map((row) => ({
			id: row.id,
			name: row.name,
			gmail: row.gmail,
			online: row.online === "online",
			friendship_status: row.friendship_status,
		}));

		return {
			status: 200,
			jsonBody: users,
		};
	} catch (error) {
		context.error("Error searching users:", error);
		return { status: 500, body: "Internal server error" };
	}
}

app.http("users/search", {
	methods: ["GET"],
	authLevel: "anonymous",
	handler: userSearch,
});
