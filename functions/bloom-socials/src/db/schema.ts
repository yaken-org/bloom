import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  // nanoid を使うので、整数型ではなく文字列型で ID を管理
  id: text("id").primaryKey(),
  // R2 に保存している画像の ID(key)
  imageId: text("image_id").notNull(),
  // 投稿者の名前（クライアントを識別しているわけではないので適当な名前を作成時に発行する）
  // アカウントも用意する予定はないのでこれでお茶をにごす
  authorName: text("author_name").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const reactions = sqliteTable("reactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // クライアントに発行している ID
  clientId: text("client_id").notNull(),
  // Post
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  // リアクションの種類
  type: text("type").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const schema = {
  posts,
  reactions,
};
