-- AlterTable
ALTER TABLE `books` ADD COLUMN `default_edition_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `BookEdition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `edition_name` VARCHAR(191) NOT NULL,
    `selling_price` DOUBLE NULL,
    `production_price` DOUBLE NULL,
    `printing_cost` DOUBLE NULL,
    `binding_cost` DOUBLE NULL,
    `design_cost` DOUBLE NULL,
    `translation_cost` DOUBLE NULL,
    `memo` VARCHAR(191) NULL,
    `book_image_url` VARCHAR(191) NULL,
    `total_print_count` INTEGER NULL,
    `book_id` INTEGER NULL,
    `number_of_pages` INTEGER NULL,
    `bookId` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookEdition` ADD CONSTRAINT `BookEdition_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
