// prisma/seed.js (CommonJS)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// helpers
const cents = (r) => Math.round(r * 100);
const SKU = (...parts) => parts.join('-').toUpperCase();

async function resetCatalog() {
  // Safe reset of catalog-only data (orders first just in case)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
}

async function upsertCategory(name, slug) {
  return prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });
}

async function upsertProduct({ name, slug, categoryId, description, images }) {
  return prisma.product.upsert({
    where: { slug },
    update: {},
    create: { name, slug, categoryId, description, images },
  });
}

// Use composite unique for upsert: productId + size + scent
async function upsertVariantByCombo(productId, v) {
  return prisma.variant.upsert({
    where: {
      productId_size_scent: {
        productId,
        size: v.size,
        scent: v.scent,
      },
    },
    update: {
      sku: v.sku,
      priceCents: v.priceCents,
      stock: v.stock,
      active: v.active,
      image: v.image,
    },
    create: {
      productId,
      sku: v.sku,
      size: v.size,
      scent: v.scent,
      priceCents: v.priceCents,
      stock: v.stock,
      active: v.active,
      image: v.image,
    },
  });
}

async function main() {
  // OPTIONAL: wipe and seed clean to avoid old duplicates while developing
  await resetCatalog();

  // --- Categories ---
  const catSalts    = await upsertCategory('Bath Salts', 'bath-salts');
  const catBombs    = await upsertCategory('Bath Bombs', 'bath-bombs');
  const catSteamers = await upsertCategory('Shower Steamers', 'shower-steamers');
  const catGifts    = await upsertCategory('Gift Sets', 'gift-sets');

  // --- Bath Salts ---
  const salts = await upsertProduct({
    name: 'Bath Salts',
    slug: 'bath-salts',
    categoryId: catSalts.id,
    description: 'Mineral-rich Epsom & Himalayan salt blend infused with essential oils.',
    images: ['/images/bath-salts-hero.jpg'],
  });

  const saltScents = ['Rosemary','Rose','Lavender','Eucalyptus','Lemon','Lemongrass'];
  const saltSizes  = [
    { size: '100g', price: cents(65) },
    { size: '500g', price: cents(250) },
  ];
  for (const scent of saltScents) {
    for (const { size, price } of saltSizes) {
      await upsertVariantByCombo(salts.id, {
        sku: SKU('SALTS', size, scent),
        size,
        scent,
        priceCents: price,
        stock: 12,
        active: true,
        image: `/images/bath-salts-${scent.toLowerCase()}.jpg`,
      });
    }
  }

  // --- Bath Bombs ---
  const bombs = await upsertProduct({
    name: 'Bath Bombs',
    slug: 'bath-bombs',
    categoryId: catBombs.id,
    description: 'Fizzy, skin-loving bath bombs — cocoa butter + kaolin clay.',
    images: ['/images/bath-bombs-hero.jpg'],
  });

  const bombScents = ['Rose', 'Lavender', 'Citrus', 'Vanilla'];
  for (const [i, scent] of bombScents.entries()) {
    await upsertVariantByCombo(bombs.id, {
      sku: SKU('BOMB', '1PC', scent),
      size: '1 pc',
      scent,
      priceCents: cents(55 + i * 5),
      stock: 20,
      active: true,
      image: `/images/bath-bomb-${scent.toLowerCase()}.jpg`,
    });
  }
  await upsertVariantByCombo(bombs.id, {
    sku: 'BOMB-4PACK-MIX',
    size: '4 pack',
    scent: 'Mixed',
    priceCents: cents(199),
    stock: 10,
    active: true,
    image: '/images/bath-bomb-mix.jpg',
  });

  // --- Shower Steamers ---
  const steamers = await upsertProduct({
    name: 'Shower Steamers',
    slug: 'shower-steamers',
    categoryId: catSteamers.id,
    description: 'Aromatherapy steamers for the shower — menthol boosted.',
    images: ['/images/shower-steamers-hero.jpg'],
  });

  const steamerScents = ['Eucalyptus', 'Peppermint', 'Citrus'];
  for (const scent of steamerScents) {
    await upsertVariantByCombo(steamers.id, {
      sku: SKU('STEAMER', '3PK', scent),
      size: '3 pack',
      scent,
      priceCents: cents(120),
      stock: 15,
      active: true,
      image: `/images/shower-steamer-${scent.toLowerCase()}.jpg`,
    });
    await upsertVariantByCombo(steamers.id, {
      sku: SKU('STEAMER', '6PK', scent),
      size: '6 pack',
      scent,
      priceCents: cents(220),
      stock: 8,
      active: true,
      image: `/images/shower-steamer-${scent.toLowerCase()}.jpg`,
    });
  }

  // --- Gift Sets ---
  const giftset = await upsertProduct({
    name: 'Relax Gift Set',
    slug: 'relax-gift-set',
    categoryId: catGifts.id,
    description: 'A curated gift set: 500g salts + 2 bath bombs + 3 steamers.',
    images: ['/images/gift-set-relax.jpg'],
  });

  await upsertVariantByCombo(giftset.id, {
    sku: 'GIFT-RELAX-LAVENDER',
    size: 'One size',
    scent: 'Lavender Suite',
    priceCents: cents(399),
    stock: 6,
    active: true,
    image: '/images/gift-set-relax.jpg',
  });
  await upsertVariantByCombo(giftset.id, {
    sku: 'GIFT-RELAX-ROSE',
    size: 'One size',
    scent: 'Rose Suite',
    priceCents: cents(399),
    stock: 6,
    active: true,
    image: '/images/gift-set-relax-rose.jpg',
  });

  console.log('✅ Seed completed with full catalog');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('❌ Seed failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });
