"use client"

import { useCart } from "@/app/providers/cart-provider"

export function CartButton() {
  const { items } = useCart()
  const count = items.reduce((sum, i) => sum + i.qty, 0)
  return (
    <a
      href="/cart"
      className="px-4 py-2 rounded-xl"
      style={{ background: "#82704d", color: "#faefed" }}
    >
      Cart ({count})
    </a>
  )
}
