// scripts/import-products-from-csv.js
const fs = require("fs")
const path = require("path")
const { parse } = require("csv-parse/sync")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const csvPath = path.resolve(process.cwd(), "data/products.csv")
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`)
  }

  const content = fs.readFileSync(csvPath, "utf8")
  const rows = parse(content, { columns: true, skip_empty_lines: true })

  for (const r of rows) {
    // --- Parse Product & Variant name ---
    // e.g. "Bath Salts - Rosemary"
    let productName = r.name
    let variantLabel = r.name
    if (r.name.includes("-")) {
      const parts = r.name.split("-")
      productName = parts[0].trim()
      variantLabel = parts.slice(1).join("-").trim()
    }

    // --- Category ---
    const categorySlug = r.category.trim().toLowerCase().replace(/\s+/g, "-")
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: { name: r.category.trim(), slug: categorySlug },
    })

    // --- Product ---
    const product = await prisma.product.upsert({
      where: { slug: r.slug },
      update: {
        description: r.description || null,
        categoryId: category.id,
        active: String(r.active).toLowerCase() === "true",
      },
      create: {
        name: productName,
        slug: r.slug,
        description: r.description || null,
        categoryId: category.id,
        active: String(r.active).toLowerCase() === "true",
      },
    })

    // --- Variant ---
    const tags = r.tags ? r.tags.split(/[|,]/).map(s => s.trim()).filter(Boolean) : []
    const filename = (r.images || "").trim()
    const imageUrl = filename.startsWith("/") ? filename : `/images/${filename}`

    await prisma.variant.create({
      data: {
        productId: product.id,
        label: variantLabel || "Unknown",
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
        where: { productId: product.id, label: variantLabel, size: r.size || null },
        data: {
          priceZAR: Number(r.priceZAR || 0),
          stock: Number(r.stock || 0),
          whatsappSku: r.whatsappSku || null,
          scentNotes: r.scentNotes || null,
          tags,
          imageUrl,
          active: String(r.active).toLowerCase() === "true",
        },
      })
    })
  }

  console.log("✅ CSV import complete")
}

main()
  .catch((e) => {
    console.error("❌ Import failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
