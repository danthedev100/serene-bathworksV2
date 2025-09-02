// app/not-found.tsx
import Link from 'next/link'
export default function NotFound(){
  return (
    <main className="container mx-auto p-10 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-gray-600 mt-2">Try the shop instead?</p>
      <Link href="/shop" className="inline-block mt-5 underline">Go to Shop</Link>
    </main>
  )
}

