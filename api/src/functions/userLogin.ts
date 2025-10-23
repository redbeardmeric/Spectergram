import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import bcrypt from "bcryptjs";
import { getPool } from "./db";
import * as sql from "mssql";

interface LoginRequestBody {
  gmail: string;
  password: string;
}

export async function login(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { gmail, password } = (await request.json()) as LoginRequestBody;

    if (!gmail || !password) {
      return { status: 400, body: "Gmail and password required" };
    }

    const pool = await getPool();
    const userResult = await pool
      .request()
      .input("gmail", sql.VarChar, gmail)
      .query("SELECT * FROM [user] WHERE gmail = @gmail");

    if (userResult.recordset.length === 0) {
      return { status: 401, body: "Invalid Gmail or password" };
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
