import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import bcrypt from "bcryptjs";
import { getPool } from "../db";
import * as sql from "mssql";

interface LoginRequestBody {
  username: string;
  password: string;
}

export async function login(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { username, password } = (await request.json()) as LoginRequestBody;

    if (!username || !password) {
      return { status: 400, body: "Gmail and password required" };
    }

    const pool = await getPool();
    const userResult = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM [user] WHERE username = @username");

    if (userResult.recordset.length === 0) {
      return { status: 401, body: "Invalid username or password" };
    }

    const user = userResult.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: 401, body: "Invalid Gmail or password" };
    }

    return { status: 200, body: `Welcome, ${user.username}! Login successful.` };
  } catch (error) {
    console.error("Login error:", error);
    return { status: 500, body: "Internal server error" };
  }
}

app.http("login", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: login,
});
