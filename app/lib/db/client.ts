import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

let dbInstance: (LibSQLDatabase<typeof schema> & { $client: Client }) | null =
  null;

export function getDb() {
  if (!dbInstance) {
    const url =
      process.env.DATABASE_URL?.trim() || "file:.data/nimbus-finance.db";
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
    const client = authToken
      ? createClient({ url, authToken })
      : createClient({ url });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}
