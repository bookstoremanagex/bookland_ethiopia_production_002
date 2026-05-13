-- CreateTable
CREATE TABLE `BookEditionStores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `editionId` INTEGER NOT NULL,
    `quantity` INTEGER NULL DEFAULT 0,
    `storeId` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookEditionStores` ADD CONSTRAINT `BookEditionStores_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookEditionStores` ADD CONSTRAINT `BookEditionStores_editionId_fkey` FOREIGN KEY (`editionId`) REFERENCES `BookEdition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
