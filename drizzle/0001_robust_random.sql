CREATE TABLE `generatedTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stage` varchar(32) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`estimate` int NOT NULL,
	`risk` varchar(32) NOT NULL,
	`priority` varchar(32) NOT NULL,
	`userGoal` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generatedTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ruleExplanations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ruleTitle` varchar(128) NOT NULL,
	`ruleDescription` text NOT NULL,
	`explanation` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ruleExplanations_id` PRIMARY KEY(`id`),
	CONSTRAINT `ruleExplanations_ruleTitle_unique` UNIQUE(`ruleTitle`)
);
