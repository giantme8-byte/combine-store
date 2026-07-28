import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const brands = [
  "Louis Vuitton",
  "Dior",
  "Chanel",
  "Hermès",
  "Gucci",
  "Prada",
  "Fendi",
  "Celine",
  "Loewe",
  "Miu Miu",
  "Balenciaga",
  "Bottega Veneta",
  "Saint Laurent",
  "Givenchy",
  "Burberry",
  "Coach",
  "Goyard",
  "Valentino",
  "Rimowa",

  // Watches
  "Rolex",
  "Omega",
  "Patek Philippe",
  "Audemars Piguet",
  "Richard Mille",

  // Jewelry
  "Cartier",
  "Van Cleef & Arpels",
  "Tiffany & Co.",
  "Bvlgari",
  "Piaget",
];

const categories = [
  "Bags",
  "Wallets",
  "Watches",
  "Jewelry",
  "Shoes",
  "Accessories",
  "Ready-to-Wear",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Seeding Admin User...");

  const hashedPassword = await bcrypt.hash(
    "admin123",
    10
  );

  await prisma.user.upsert({
    where: {
      email: "admin@combine.com",
    },
    update: {
      name: "Administrator",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    create: {
      name: "Administrator",
      email: "admin@combine.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("🌱 Seeding Brands...");

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: {
        slug: slugify(brand),
      },
      update: {},
      create: {
        name: brand,
        slug: slugify(brand),
      },
    });
  }

  console.log("🌱 Seeding Categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: slugify(category),
      },
      update: {},
      create: {
        name: category,
        slug: slugify(category),
      },
    });
  }

  console.log("✅ Database Seed Completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });