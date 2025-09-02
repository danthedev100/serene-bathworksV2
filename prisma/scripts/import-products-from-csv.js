// Plain JS importer: node scripts/import-products-from-csv.js
const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const csvPath = path.resolve(process.cwd(), "data/products.csv");
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
    const tags = r.tags ? r.tags.split(/[|,]/).map(s=>s.trim()).filter(Boolean) : [];

    // availability = (active && stock > 0)
    await prisma.variant.create({
      data: {
        id: r.id && r.id.length ? r.id : undefined,
        productId: product.id,
        label: r.name,           // or map to scent if you have a dedicated column
        size: r.size || null,
        priceZAR: Number(r.priceZAR || 0),
        stock: Number(r.stock || 0),
        whatsappSku: r.whatsappSku || null,
        scentNotes: r.scentNotes || null,
        tags,
        imageUrl,
        active: String(r.active).toLowerCase() === "true",
      },
    }).catch(async e => {
      // if duplicate id in CSV, fallback to upsert by (productId, label, size) combo using a poor-man’s strategy
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

main().finally(()=>prisma.$disconnect());
