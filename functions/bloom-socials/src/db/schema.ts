import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reactions = sqliteTable("reactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // クライアントに発行している ID
  clientId: text("client_id").notNull(),
  // R2 に保存している画像の ID(key)
  imageId: text("image_id").notNull(),
  // リアクションの種類
  type: text("type").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const schema = {
  reactions,
};
