import { prisma } from "@/lib/prisma";
import { Palette } from "@/lib/palette";
import ClientProductCard from "@/components/ClientProductCard";

export default async function Page() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { active: true },
        include: { variants: { orderBy: { label: "asc" } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ background: Palette.pinkBg, minHeight: "100vh" }}>
      <header className="sticky top-0 z-10 backdrop-blur"
              style={{ background: `${Palette.pinkBg}cc`, borderBottom: `1px solid ${Palette.gold}` }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: Palette.gold }} />
            <span className="font-serif text-xl" style={{ color: Palette.text }}>Serene Bathworks</span>
          </div>
          <nav className="flex items-center gap-6" style={{ color: Palette.text }}>
            <a href="/">Shop</a>
            <a href="/contact">Contact</a>
            <button className="px-4 py-2 rounded-xl" style={{ background: Palette.text, color: Palette.pinkBg }}>
              Cart (0)
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <section className="rounded-3xl p-10 text-center bg-white" style={{ border: `1px solid ${Palette.gold}` }}>
          <h1 className="font-serif text-4xl" style={{ color: Palette.text }}>
            Transform Your Bath Into a Sanctuary
          </h1>
          <p className="mt-3 max-w-2xl mx-auto" style={{ color: Palette.text }}>
            Explore bath bombs, salts, and steamers. Choose a scent—images swap instantly.
          </p>
        </section>

        {categories.map(cat => (
          <section key={cat.id} className="space-y-6">
            <h2 className="font-serif text-3xl" style={{ color: Palette.text }}>{cat.name}</h2>
            {cat.products.map(p => (
              <ClientProductCard key={p.id} product={p as any} />
            ))}
          </section>
        ))}
      </main>

      <footer className="mt-20 py-10" style={{ borderTop: `1px solid ${Palette.gold}` }}>
        <div className="max-w-6xl mx-auto px-6 text-sm" style={{ color: Palette.text }}>
          © {new Date().getFullYear()} Serene Bathworks — Crafted with care.
        </div>
      </footer>
    </div>
  );
}
