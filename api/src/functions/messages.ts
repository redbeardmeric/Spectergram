import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { getPool } from "../db";
import * as sql from "mssql";

interface MessageRequestBody {
  sender: string;
  receiver: string;
  message: string;
}

export async function messages(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
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
        .query(`
          SELECT sender, receiver, message, timestamp 
          FROM [messages]
          WHERE receiver = @username OR sender = @username
          ORDER BY timestamp DESC
        `);

      return { status: 200, body: JSON.stringify(result.recordset) };
    }

    
    if (request.method === "POST") {
      const { sender, receiver, message } = (await request.json()) as MessageRequestBody;

      if (!sender || !receiver || !message) {
        return { status: 400, body: "Sender, receiver, and message are required" };
      }

      await pool
        .request()
        .input("sender", sql.VarChar, sender)
        .input("receiver", sql.VarChar, receiver)
        .input("message", sql.VarChar, message)
        .query(`
          INSERT INTO [messages] (sender, receiver, message)
          VALUES (@sender, @receiver, @message)
        `);

      return { status: 201, body: "Message sent successfully" };
    }

    return { status: 405, body: "Method not allowed" };
  } catch (error) {
    console.error("Message API error:", error);
    return { status: 500, body: "Internal server error" };
  }
}

app.http("messages", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: messages,
});
