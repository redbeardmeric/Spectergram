import { DefaultAzureCredential } from "@azure/identity";
import * as sql from "mssql";

const credential = new DefaultAzureCredential();
let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool) return pool;

  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (connectionString) {
    pool = await sql.connect(connectionString);
    return pool;
  }

  const server = process.env.SQL_SERVER;
  const database = process.env.SQL_DATABASE;
  if (!server || !database) {
    throw new Error("SQL_SERVER and SQL_DATABASE must be set when using managed identity");
  }

  const tokenResponse = await credential.getToken("https://database.windows.net//.default");
  if (!tokenResponse?.token) {
    throw new Error("Failed to acquire access token for Azure SQL");
  }

  const config: sql.config = {
    server,
    database,
    options: { encrypt: true },
    authentication: {
      type: "azure-active-directory-access-token",
      options: { token: tokenResponse.token },
    },
  };

  pool = await new sql.ConnectionPool(config).connect();
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}