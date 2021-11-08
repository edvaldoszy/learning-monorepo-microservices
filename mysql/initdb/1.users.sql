CREATE DATABASE `todos`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `todos`;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED auto_increment,
  `name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(70) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT users_pk PRIMARY KEY(`id`),
  CONSTRAINT users_email_unique UNIQUE (`email`)
);
