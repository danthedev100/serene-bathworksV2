// scripts/import-products-from-csv.js
const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const csvPath = path.resolve(process.cwd(), "data/products.csv");
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`);
  }

  const content = fs.readFileSync(csvPath, "utf8");
  const rows = parse(content, { columns: true, skip_empty_lines: true });

  for (const r of rows) {
    const categoryName = (r.category || "").trim();
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: { name: categoryName, slug: categorySlug },
    });

    const product = await prisma.product.upsert({
      where: { slug: r.slug },
      update: {
        description: r.description || null,
        categoryId: category.id,
        active: String(r.active).toLowerCase() === "true",
      },
      create: {
        name: r.name,
        slug: r.slug,
        description: r.description || null,
        categoryId: category.id,
        active: String(r.active).toLowerCase() === "true",
      },
    });

    const filename = (r.images || "").trim();
    const imageUrl = filename.startsWith("/") ? filename : `/images/${filename}`;
    const tags = r.tags ? r.tags.split(/[|,]/).map(s => s.trim()).filter(Boolean) : [];

    await prisma.variant.create({
      data: {
        productId: product.id,
        label: r.name,
        size: r.size || null,
        priceZAR: Number(r.priceZAR || 0),
        stock: Number(r.stock || 0),
        whatsappSku: r.whatsappSku || null,
        scentNotes: r.scentNotes || null,
        tags,
        imageUrl,
        active: String(r.active).toLowerCase() === "true",
      },
    }).catch(async () => {
      // fallback: update if already exists
      await prisma.variant.updateMany({
        where: { productId: product.id, label: r.name, size: r.size || null },
        data: {
          priceZAR: Number(r.priceZAR || 0),
          stock: Number(r.stock || 0),
          whatsappSku: r.whatsappSku || null,
          scentNotes: r.scentNotes || null,
          tags,
          imageUrl,
          active: String(r.active).toLowerCase() === "true",
        }
      });
    });
  }

  console.log("CSV import complete.");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
