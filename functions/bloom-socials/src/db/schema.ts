import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 写真
export const work = sqliteTable("work", {
  id: integer("id").primaryKey(),

  // ユーザー登録なんてことはしていないのでクライアントIDだけを格納しておく
  clientId: text("client_id"),
  // R2 に保存している画像のKey
  imageKey: text("image_key"),

  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const reactions = sqliteTable("reactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: text("client_id").notNull(),
  workId: integer("work_id")
    .notNull()
    .references(() => work.id),
  type: text("type").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const schema = {
  work,
  reactions,
};
