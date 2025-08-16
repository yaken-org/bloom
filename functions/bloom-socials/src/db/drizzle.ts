import { drizzle } from "drizzle-orm/d1";
import { schema } from "@/db/schema";

export const getDrizzleDB = (db: D1Database) => {
  return drizzle(db, {
    schema,
    logger: false,
  });
};

export type DrizzleDB = ReturnType<typeof getDrizzleDB>;
