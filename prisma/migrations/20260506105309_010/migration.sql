-- CreateTable
CREATE TABLE `BookShopes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookShopEditions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookShopId` INTEGER NOT NULL,
    `bookEditionId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `price_per_peice` DOUBLE NULL,
    `total_price` DOUBLE NULL,
    `memo` VARCHAR(191) NULL,
    `already_paid` DOUBLE NULL,
    `remaining_amount` DOUBLE NULL DEFAULT 0,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookShopEditions` ADD CONSTRAINT `BookShopEditions_bookShopId_fkey` FOREIGN KEY (`bookShopId`) REFERENCES `BookShopes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookShopEditions` ADD CONSTRAINT `BookShopEditions_bookEditionId_fkey` FOREIGN KEY (`bookEditionId`) REFERENCES `BookEdition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
