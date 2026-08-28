CREATE TABLE `catalogAlbums` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`coverImage` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `catalogAlbums_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `catalogTracks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`albumId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`artist` varchar(255) NOT NULL,
	`audioUrl` text NOT NULL,
	`lyrics` json,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `catalogTracks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `catalogTracks` ADD CONSTRAINT `catalogTracks_albumId_catalogAlbums_id_fk` FOREIGN KEY (`albumId`) REFERENCES `catalogAlbums`(`id`) ON DELETE cascade ON UPDATE no action;