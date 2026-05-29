import prisma from "./prisma";

const categories = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Children", "Academic", "Self-Help"];
const languages = ["English", "Amharic", "French", "Spanish", "German"];
const authors = ["George Orwell", "Agatha Christie", "J.K. Rowling", "Ernest Hemingway", "Abe Gubegna", "Hadis Alemayehu", "Tsegaye Gebre-Medhin"];
const editions = ["1st Edition", "2nd Edition", "Revised Edition", "Special Edition"];

const roleTypes = [
  { rolename: "Viewing Books", role_detail: "View books" },
  { rolename: "Editing Books", role_detail: "Edit book details" },
  { rolename: "Adding Books", role_detail: "Add new books" },
  { rolename: "Deleting Books", role_detail: "Delete books" },
  { rolename: "Adding Stores", role_detail: "Add new stores" },
  { rolename: "Viewing Stores", role_detail: "View stores" },
  { rolename: "Editing Stores", role_detail: "Edit store details" },
  { rolename: "Deleting Stores", role_detail: "Delete stores" },
  { rolename: "Add DamagedBooks", role_detail: "Add damaged books" },
  { rolename: "Delete DamagedBooks", role_detail: "Delete damaged book records" },
  { rolename: "Edit DamagedBooks", role_detail: "Edit damaged book records" },
  { rolename: "View DamagedBooks", role_detail: "View damaged books" },
  { rolename: "Adding BookShop", role_detail: "Add new book shops" },
  { rolename: "Viewing BookShops", role_detail: "View book shops" },
  { rolename: "Editing BookShops", role_detail: "Edit book shop details" },
  { rolename: "Deleting BookShops", role_detail: "Delete book shops" },
  { rolename: "Record Payment", role_detail: "Record payments" },
  { rolename: "Create Check", role_detail: "Create checks" },
  { rolename: "Register Printer", role_detail: "Register new printers" },
  { rolename: "Edit Printers", role_detail: "Edit printer details" },
  { rolename: "Delete Printer", role_detail: "Delete printers" },
  { rolename: "Viewing Contract Documents", role_detail: "View contract documents" },
  { rolename: "Editing Contract Documents", role_detail: "Edit contract documents" },
  { rolename: "Creating Contract Documents", role_detail: "Create contract documents" },
  { rolename: "Deleting Contract Documents", role_detail: "Delete contract documents" },
  { rolename: "Viewing Print Agreements", role_detail: "View print agreements" },
  { rolename: "Editing Print Agreements", role_detail: "Edit print agreements" },
  { rolename: "Creating Print Agreements", role_detail: "Create print agreements" },
  { rolename: "Deleting Print Agreements", role_detail: "Delete print agreements" },
  { rolename: "Creating Delivery Notes", role_detail: "Create delivery notes" },
  { rolename: "Editing Delivery Notes", role_detail: "Edit delivery notes" },
  { rolename: "Viewing Delivery Notes", role_detail: "View delivery notes" },
  { rolename: "Deleting Delivery Notes", role_detail: "Delete delivery notes" },
  { rolename: "Creating Invoice Document", role_detail: "Create invoice documents" },
  { rolename: "Viewing Invoice Document", role_detail: "View invoice documents" },
  { rolename: "Editing Invoice Document", role_detail: "Edit invoice documents" },
  { rolename: "Deleting Invoice Document", role_detail: "Delete invoice documents" },
  { rolename: "Creating Approval Document", role_detail: "Create approval documents" },
  { rolename: "Editing Approval Document", role_detail: "Edit approval documents" },
  { rolename: "Viewing Approval Document", role_detail: "View approval documents" },
  { rolename: "Deleting Approval Document", role_detail: "Delete approval documents" },
  { rolename: "Creating Notes", role_detail: "Create notes" },
  { rolename: "Viewing Notes", role_detail: "View notes" },
  { rolename: "Updating Notes", role_detail: "Update notes" },
  { rolename: "Deleting Notes", role_detail: "Delete notes" },
  { rolename: "Editing Profile", role_detail: "Edit own profile" },
  { rolename: "Editing Password", role_detail: "Edit own password" },
];

const menuTree = [
  { name: "Home", order: 1 },
  { name: "Notifications", order: 2 },
  { name: "Notes", order: 3 },
  { name: "Profile", order: 4 },
  { name: "Books", order: 5 },
  { name: "Book Shelf", order: 6 },
  { name: "Stores", order: 7 },
  { name: "Damaged Books", order: 8 },
  { name: "Book Shop", order: 9 },
  { name: "Manage Orders", order: 10 },
  { name: "Manage Payments", order: 11 },
  { name: "Manage Checks", order: 12 },
  { name: "Retail Management", order: 13 },
  { name: "Activity Log", order: 14 },
  { name: "Production - Books", order: 15 },
  { name: "Translations", order: 16, children: [
    { name: "Translation List", order: 1 },
    { name: "Translation Work", order: 2 },
  ]},
  { name: "Printing", order: 17, children: [
    { name: "Printers", order: 1 },
    { name: "Manage Printing", order: 2 },
  ]},
  { name: "Document Management", order: 18, children: [
    { name: "Contracts", order: 1 },
    { name: "Print Agreements", order: 2 },
    { name: "Delivery Notes", order: 3 },
    { name: "Invoices", order: 4 },
    { name: "Approval Documents", order: 5 },
  ]},
  { name: "Finance", order: 19, children: [
    { name: "Finance - Book Shop", order: 1 },
    { name: "Finance - Books", order: 2 },
    { name: "Finance - Shop Table", order: 3 },
    { name: "Finance - Edition Table", order: 4 },
    { name: "Finance - Costs", order: 5 },
  ]},
  { name: "Reports", order: 20, children: [
    { name: "Completed Deliveries", order: 1 },
    { name: "Pending Deliveries", order: 2 },
  ]},
  { name: "Settings", order: 21, children: [
    { name: "Accounts", order: 1 },
    { name: "Menu Management", order: 2 },
    { name: "Theme Customization", order: 3 },
  ]},
  { name: "Delivery Sample", order: 22 },
];

async function seedMenus() {
  console.log("Seeding menus...");
  for (const item of menuTree) {
    const parent = await prisma.menus.upsert({
      where: { name: item.name },
      update: { order: item.order },
      create: {
        name: item.name,
        order: item.order,
        updatedAt: new Date(),
      },
    });
    if (item.children) {
      for (const child of item.children) {
        await prisma.menus.upsert({
          where: { name: child.name },
          update: { order: child.order, parentId: parent.id },
          create: {
            name: child.name,
            order: child.order,
            parentId: parent.id,
            updatedAt: new Date(),
          },
        });
      }
    }
  }
  const count = await prisma.menus.count();
  console.log(`Seeded ${count} menu items.`);
}

async function main() {
  console.log("Starting seeding...");

  // Seed menu items
  await seedMenus();

  // Seed role types
  for (const rt of roleTypes) {
    await prisma.roletypes.upsert({
      where: { rolename: rt.rolename },
      update: {},
      create: {
        rolename: rt.rolename,
        role_detail: rt.role_detail,
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${roleTypes.length} role types.`);

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
