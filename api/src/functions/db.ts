import { Pool } from "pg";

export const db = new Pool({
    user: "postgres",           // your PostgreSQL username
    host: "127.0.0.1",
    database: "postgres",   // your database name
    password: "postgres",   // your PostgreSQL password
    port: 5432,
});
