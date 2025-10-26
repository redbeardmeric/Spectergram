import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import bcrypt from "bcryptjs";
import  { getPool }  from "../db";
import * as sql from "mssql";

interface RegisterRequestBody {
  username: string;
  gmail?: string;
  password: string;
}

export async function register(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { username, gmail, password } = (await request.json()) as RegisterRequestBody;

    if (!username || !password) {
      return { status: 400, body: "Username or Gmail, and Password are required" };
    }

    if (gmail) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(gmail)) {
      return { status: 400, body: "Please provide a valid Gmail address" };
    }
    }

    const pool = await getPool();

    
    const existing = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM [user] WHERE username = @username");

    if (existing.recordset.length > 0) {
      return { status: 409, body: "Username already exists" };
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, hashedPassword)
      .query("INSERT INTO [user] (username, password) VALUES (@username, @password)");

    return { status: 201, body: "User registered successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    return { status: 500, body: "Internal server error" };
  }
}

app.http("register", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: register,
});
