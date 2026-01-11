CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`program` text NOT NULL,
	`status` text NOT NULL,
	`experience` text NOT NULL,
	`motivation` text NOT NULL,
	`commitment` integer NOT NULL,
	`submittedAt` text NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`phone` text,
	`createdAt` text,
	`updatedAt` text
);
