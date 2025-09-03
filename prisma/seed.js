// prisma/seed.js (CommonJS)
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// helpers
const cents = (r) => Math.round(r * 100)

// Reset catalog tables
async function resetCatalog() {
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.variant.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
}

// Category upsert
async function upsertCategory(name, slug) {
  return prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  })
}

// Product upsert
async function upsertProduct({ name, slug, categoryId, description }) {
  return prisma.product.upsert({
    where: { slug },
    update: {},
    create: { name, slug, categoryId, description },
  })
}

// Variant upsert (maps scent → label, priceCents → priceZAR, image → imageUrl)
async function upsertVariant(productId, v) {
  return prisma.variant.create({
    data: {
      productId,
      label: v.scent, // use scent as label
      size: v.size,
      priceZAR: Math.round(v.priceCents / 100),
      stock: v.stock,
      active: v.active,
      imageUrl: v.image,
    },
  })
}

async function main() {
  await resetCatalog()

  // --- Categories ---
  const catSalts = await upsertCategory('Bath Salts', 'bath-salts')
  const catBombs = await upsertCategory('Bath Bombs', 'bath-bombs')
  const catSteamers = await upsertCategory('Shower Steamers', 'shower-steamers')
  const catGifts = await upsertCategory('Gift Sets', 'gift-sets')

  // --- Bath Salts ---
  const salts = await upsertProduct({
    name: 'Bath Salts',
    slug: 'bath-salts',
    categoryId: catSalts.id,
    description: 'Mineral-rich Epsom & Himalayan salt blend infused with essential oils.',
  })

  const saltScents = ['Rosemary', 'Rose', 'Lavender', 'Eucalyptus', 'Lemon', 'Lemongrass']
  const saltSizes = [
    { size: '100g', price: cents(65) },
    { size: '500g', price: cents(250) },
  ]
  for (const scent of saltScents) {
    for (const { size, price } of saltSizes) {
      await upsertVariant(salts.id, {
        size,
        scent,
        priceCents: price,
        stock: 12,
        active: true,
        image: `/images/bath-salts-${scent.toLowerCase()}.jpg`,
      })
    }
  }

  // --- Bath Bombs ---
  const bombs = await upsertProduct({
    name: 'Bath Bombs',
    slug: 'bath-bombs',
    categoryId: catBombs.id,
    description: 'Fizzy, skin-loving bath bombs — cocoa butter + kaolin clay.',
  })

  const bombScents = ['Rose', 'Lavender', 'Citrus', 'Vanilla']
  for (const [i, scent] of bombScents.entries()) {
    await upsertVariant(bombs.id, {
      size: '1 pc',
      scent,
      priceCents: cents(55 + i * 5),
      stock: 20,
      active: true,
      image: `/images/bath-bomb-${scent.toLowerCase()}.jpg`,
    })
  }
  await upsertVariant(bombs.id, {
    size: '4 pack',
    scent: 'Mixed',
    priceCents: cents(199),
    stock: 10,
    active: true,
    image: '/images/bath-bomb-mix.jpg',
  })

  // --- Shower Steamers ---
  const steamers = await upsertProduct({
    name: 'Shower Steamers',
    slug: 'shower-steamers',
    categoryId: catSteamers.id,
    description: 'Aromatherapy steamers for the shower — menthol boosted.',
  })

  const steamerScents = ['Eucalyptus', 'Peppermint', 'Citrus']
  for (const scent of steamerScents) {
    await upsertVariant(steamers.id, {
      size: '3 pack',
      scent,
      priceCents: cents(120),
      stock: 15,
      active: true,
      image: `/images/shower-steamer-${scent.toLowerCase()}.jpg`,
    })
    await upsertVariant(steamers.id, {
      size: '6 pack',
      scent,
      priceCents: cents(220),
      stock: 8,
      active: true,
      image: `/images/shower-steamer-${scent.toLowerCase()}.jpg`,
    })
  }

  // --- Gift Sets ---
  const giftset = await upsertProduct({
    name: 'Relax Gift Set',
    slug: 'relax-gift-set',
    categoryId: catGifts.id,
    description: 'A curated gift set: 500g salts + 2 bath bombs + 3 steamers.',
  })

  await upsertVariant(giftset.id, {
    size: 'One size',
    scent: 'Lavender Suite',
    priceCents: cents(399),
    stock: 6,
    active: true,
    image: '/images/gift-set-relax.jpg',
  })
  await upsertVariant(giftset.id, {
    size: 'One size',
    scent: 'Rose Suite',
    priceCents: cents(399),
    stock: 6,
    active: true,
    image: '/images/gift-set-relax-rose.jpg',
  })

  console.log('✅ Seed completed with full catalog')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed', e)
    await prisma.$disconnect()
    process.exit(1)
  })
