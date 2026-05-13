import prisma from "./prisma";

const categories = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Children", "Academic", "Self-Help"];
const languages = ["English", "Amharic", "French", "Spanish", "German"];
const authors = ["George Orwell", "Agatha Christie", "J.K. Rowling", "Ernest Hemingway", "Abe Gubegna", "Hadis Alemayehu", "Tsegaye Gebre-Medhin"];
const editions = ["1st Edition", "2nd Edition", "Revised Edition", "Special Edition"];

async function main() {
  console.log("Starting seeding...");

  for (let i = 1; i <= 50; i++) {
    const title = `Book Title ${i}`;
    const author = authors[Math.floor(Math.random() * authors.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const language = languages[Math.floor(Math.random() * languages.length)];
    const edition = editions[Math.floor(Math.random() * editions.length)];
    const year = (2000 + Math.floor(Math.random() * 25)).toString();

    await prisma.books.create({
      data: {
        title: title,
        author: author,
        isbn: `978-${Math.floor(Math.random() * 1000000000)}`,
        language: language,
        edition: edition,
        category: category,
        publication_year: year,
        number_of_pages: Math.floor(Math.random() * 500) + 100,
        info: `This is a generated description for ${title} by ${author}. It's a great read in the ${category} category.`,
        status: i % 10 === 0 ? "out_of_stock" : "available",
        book_image_url: `https://picsum.photos/seed/book${i}/400/600`,
        unique_identification_code: `UIC-${i}-${Math.random().toString(36).substring(7)}`,
        book_sku: `SKU-${i}-${Math.random().toString(36).substring(7)}`,
        updatedAt: new Date(),
      },
    });
  }

  console.log("Seeding completed: 50 books created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
