-- CreateTable
CREATE TABLE `Translator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TranslatorBook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `book_id` INTEGER NULL,
    `bookId` INTEGER NOT NULL,
    `translator_id` INTEGER NOT NULL,
    `Status` ENUM('NOT_STARTED', 'STARTED', 'ONPROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TranslatorBook` ADD CONSTRAINT `TranslatorBook_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TranslatorBook` ADD CONSTRAINT `TranslatorBook_translator_id_fkey` FOREIGN KEY (`translator_id`) REFERENCES `Translator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
