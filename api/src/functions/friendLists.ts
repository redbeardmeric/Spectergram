import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { getPool } from "../db";
import * as sql from "mssql";

interface FriendRequestBody {
  username: string;
  friend: string;
}

export async function friendLists(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const pool = await getPool();

    
    if (request.method === "GET") {
      const username = request.query.get("username");
      if (!username) {
        return { status: 400, body: "Username query parameter is required" };
      }

      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .query("SELECT friend, createdAt FROM [friendships] WHERE username = @username ORDER BY createdAt DESC");

      return { status: 200, body: JSON.stringify(result.recordset) };
    }

    
    if (request.method === "POST") {
      const { username, friend } = (await request.json()) as FriendRequestBody;

      if (!username || !friend) {
        return { status: 400, body: "Username and friend are required" };
      }

      if (username === friend) {
        return { status: 400, body: "You cannot add yourself as a friend" };
      }

     
      const check = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("friend", sql.VarChar, friend)
        .query("SELECT * FROM [friendships] WHERE username = @username AND friend = @friend");

      if (check.recordset.length > 0) {
        return { status: 409, body: "Already friends" };
      }

      await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("friend", sql.VarChar, friend)
        .query("INSERT INTO [friendships] (username, friend) VALUES (@username, @friend)");

      return { status: 201, body: "Friend added successfully" };
    }

    
    if (request.method === "DELETE") {
      const { username, friend } = (await request.json()) as FriendRequestBody;

      if (!username || !friend) {
        return { status: 400, body: "Username and friend are required" };
      }

      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("friend", sql.VarChar, friend)
        .query("DELETE FROM [friendships] WHERE username = @username AND friend = @friend");

      if (result.rowsAffected[0] === 0) {
        return { status: 404, body: "Friend not found" };
      }

      return { status: 200, body: "Friend removed successfully" };
    }

    return { status: 405, body: "Method not allowed" };
  } catch (error) {
    console.error("Friend List API error:", error);
    return { status: 500, body: "Internal server error" };
  }
}

app.http("friendLists", {
  methods: ["GET", "POST", "DELETE"],
  authLevel: "anonymous",
  handler: friendLists,
});
