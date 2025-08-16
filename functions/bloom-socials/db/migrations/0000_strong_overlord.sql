CREATE TABLE `reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` text NOT NULL,
	`work_id` integer NOT NULL,
	`type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`work_id`) REFERENCES `work`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `work` (
	`id` integer PRIMARY KEY NOT NULL,
	`client_id` text,
	`image_key` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
