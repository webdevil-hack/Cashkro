import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient({ log: ["warn", "error"] });

async function main() {
  // Categories
  const categories = await prisma.$transaction([
    prisma.category.upsert({
      where: { slug: "fashion" },
      create: { name: "Fashion", slug: "fashion" },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "electronics" },
      create: { name: "Electronics", slug: "electronics" },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "travel" },
      create: { name: "Travel", slug: "travel" },
      update: {},
    }),
  ]);

  const [fashion, electronics, travel] = categories;

  // Merchants
  const merchants = await prisma.$transaction([
    prisma.merchant.upsert({
      where: { slug: "myntra" },
      create: {
        name: "Myntra",
        slug: "myntra",
        websiteUrl: "https://www.myntra.com",
        logoUrl: "/logos/myntra.png",
        categoryId: fashion.id,
        isFeatured: true,
      },
      update: {},
    }),
    prisma.merchant.upsert({
      where: { slug: "ajio" },
      create: {
        name: "AJIO",
        slug: "ajio",
        websiteUrl: "https://www.ajio.com",
        logoUrl: "/logos/ajio.png",
        categoryId: fashion.id,
        isFeatured: true,
      },
      update: {},
    }),
    prisma.merchant.upsert({
      where: { slug: "flipkart" },
      create: {
        name: "Flipkart",
        slug: "flipkart",
        websiteUrl: "https://www.flipkart.com",
        logoUrl: "/logos/flipkart.png",
        categoryId: electronics.id,
        isFeatured: true,
      },
      update: {},
    }),
    prisma.merchant.upsert({
      where: { slug: "makemytrip" },
      create: {
        name: "MakeMyTrip",
        slug: "makemytrip",
        websiteUrl: "https://www.makemytrip.com",
        logoUrl: "/logos/mmt.png",
        categoryId: travel.id,
        isFeatured: false,
      },
      update: {},
    }),
  ]);

  const [myntra, ajio, flipkart, mmt] = merchants;

  // Offers
  await prisma.$transaction([
    prisma.offer.upsert({
      where: { slug: "myntra-flat-200" },
      create: {
        merchantId: myntra.id,
        categoryId: fashion.id,
        title: "Flat ₹200 cashback on fashion",
        slug: "myntra-flat-200",
        description: "Valid on orders above ₹1500",
        cashbackType: "FLAT",
        cashbackValue: 20000, // ₹200 => 200*100
        couponCode: null,
        terms: "Cashback confirmed in 60-90 days",
        landingUrl: "https://www.myntra.com",
        affiliateUrl: "https://affiliate.example/myntra",
        validFrom: new Date(),
        validTo: null,
        isActive: true,
      },
      update: {},
    }),
    prisma.offer.upsert({
      where: { slug: "ajio-10-percent" },
      create: {
        merchantId: ajio.id,
        categoryId: fashion.id,
        title: "10% cashback on AJIO",
        slug: "ajio-10-percent",
        description: "No coupon required",
        cashbackType: "PERCENT",
        cashbackValue: 1000, // 10% => 1000 bps
        couponCode: null,
        terms: "Excludes certain brands",
        landingUrl: "https://www.ajio.com",
        affiliateUrl: "https://affiliate.example/ajio",
        validFrom: new Date(),
        validTo: null,
        isActive: true,
      },
      update: {},
    }),
    prisma.offer.upsert({
      where: { slug: "flipkart-5-percent" },
      create: {
        merchantId: flipkart.id,
        categoryId: electronics.id,
        title: "5% on electronics",
        slug: "flipkart-5-percent",
        description: "Mobiles excluded",
        cashbackType: "PERCENT",
        cashbackValue: 500,
        couponCode: null,
        terms: "See T&C",
        landingUrl: "https://www.flipkart.com",
        affiliateUrl: "https://affiliate.example/flipkart",
        validFrom: new Date(),
        validTo: null,
        isActive: true,
      },
      update: {},
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
