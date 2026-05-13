-- CreateTable
CREATE TABLE `DamagedBooks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('STORE', 'PRINTING', 'DESIGN', 'PREPRINTING', 'DISTRIBUTION', 'SALES') NULL,
    `book_id` INTEGER NULL,
    `store_id` INTEGER NULL,
    `edition_id` INTEGER NULL,
    `count` INTEGER NULL,
    `memo` VARCHAR(191) NULL,
    `account_id` INTEGER NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DamagedBooks` ADD CONSTRAINT `DamagedBooks_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Books`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamagedBooks` ADD CONSTRAINT `DamagedBooks_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `Stores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamagedBooks` ADD CONSTRAINT `DamagedBooks_edition_id_fkey` FOREIGN KEY (`edition_id`) REFERENCES `BookEdition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamagedBooks` ADD CONSTRAINT `DamagedBooks_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
