// components/navigation/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto py-10 text-sm text-gray-600 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold">Serene Bathworks</div>
          <p className="mt-2">Handcrafted in South Africa.</p>
        </div>
        <div className="space-y-2">
          <Link href="/shop" className="block hover:underline">Shop</Link>
          <Link href="/contact" className="block hover:underline">Contact</Link>
          <Link href="/ingredients" className="block hover:underline">Ingredients</Link>
        </div>
        <div className="text-gray-500">
          © {new Date().getFullYear()} Serene Bathworks. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
