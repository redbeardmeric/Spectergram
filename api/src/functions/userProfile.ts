import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { getPool } from "../db";
import * as sql from "mssql";

interface ProfileRequestBody {
  bio?: string;
  displayName?: string;
}

export async function profile(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
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
        .query("SELECT username, displayName, bio FROM [profiles] WHERE username = @username");

      if (result.recordset.length === 0) {
        return { status: 404, body: "Profile not found" };
      }

      return { status: 200, body: JSON.stringify(result.recordset[0]) };
    }

   
    if (request.method === "PUT") {
      const { bio, displayName } = (await request.json()) as ProfileRequestBody;
      const username = request.query.get("username");

      if (!username) {
        return { status: 400, body: "Username query parameter is required" };
      }

     
      const existing = await pool
        .request()
        .input("username", sql.VarChar, username)
        .query("SELECT * FROM [profiles] WHERE username = @username");

      if (existing.recordset.length > 0) {
        
        await pool
          .request()
          .input("username", sql.VarChar, username)
          .input("displayName", sql.VarChar, displayName || null)
          .input("bio", sql.VarChar, bio || null)
          .query("UPDATE [profiles] SET displayName = @displayName, bio = @bio WHERE username = @username");

        return { status: 200, body: "Profile updated successfully" };
      } else {
        
        await pool
          .request()
          .input("username", sql.VarChar, username)
          .input("displayName", sql.VarChar, displayName || null)
          .input("bio", sql.VarChar, bio || null)
          .query("INSERT INTO [profiles] (username, displayName, bio) VALUES (@username, @displayName, @bio)");

        return { status: 201, body: "Profile created successfully" };
      }
    }

    return { status: 405, body: "Method not allowed" };
  } catch (error) {
    console.error("Profile API error:", error);
    return { status: 500, body: "Internal server error" };
  }
}

app.http("profile", {
  methods: ["GET", "PUT"],
  authLevel: "anonymous",
  handler: profile,
});
