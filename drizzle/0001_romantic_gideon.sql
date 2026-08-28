CREATE TABLE `musicLyrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trackId` int NOT NULL,
	`userId` int NOT NULL,
	`lyricsText` text NOT NULL,
	`language` varchar(16) NOT NULL,
	`durationSeconds` int NOT NULL,
	`cues` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `musicLyrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `musicLyrics_trackId_unique` UNIQUE(`trackId`)
);
--> statement-breakpoint
ALTER TABLE `musicLyrics` ADD CONSTRAINT `musicLyrics_trackId_musicTracks_id_fk` FOREIGN KEY (`trackId`) REFERENCES `musicTracks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `musicLyrics` ADD CONSTRAINT `musicLyrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;