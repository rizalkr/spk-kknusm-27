import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error("DB_URL environment variable is not set.");
}

const client = neon(connectionString);

export const db = drizzle(client, { schema });
export type Database = typeof db;
export { schema };
