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

export async function userSearch(
	request: HttpRequest,
	_context: InvocationContext,
): Promise<HttpResponseInit> {
	try {
		// Read request data
		const { query } = (await request.json()) as SearchRequestBody;

		if (!query) {
			return { status: 400, body: "Search query is required" };
		}

		const pool = await getPool();

		// Search by username or gmail (case-insensitive)
		const result = await pool
			.request()
			.input("query", sql.VarChar, `%${query}%`)
			.query(
				"SELECT id, username, gmail FROM [user] WHERE username LIKE @query OR gmail LIKE @query",
			);

		if (result.recordset.length === 0) {
			return { status: 404, body: "No users found" };
		}

		return {
			status: 200,
			jsonBody: {
				message: "Users found successfully",
				count: result.recordset.length,
				users: result.recordset,
			},
		};
	} catch (error) {
		console.error("User search error:", error);
		return { status: 500, body: "Internal server error" };
	}
}

// Register the Azure Function endpoint
app.http("usersearch", {
	methods: ["POST"],
	authLevel: "anonymous",
	handler: userSearch,
});
