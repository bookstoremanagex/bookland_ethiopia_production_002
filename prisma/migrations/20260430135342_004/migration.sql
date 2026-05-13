-- CreateTable
CREATE TABLE `Accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_type` VARCHAR(191) NOT NULL,
    `account_email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `account_status` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_status` BOOLEAN NOT NULL DEFAULT false,
    `role_name` VARCHAR(191) NOT NULL,
    `accountId` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Roles` ADD CONSTRAINT `Roles_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
