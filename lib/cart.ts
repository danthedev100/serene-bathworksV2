'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  variantId: string
  productSlug: string
  name: string
  size: string
  scent: string
  image?: string
  priceCents: number
  qty: number
}

type CartState = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (variantId: string) => void
  setQty: (variantId: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const ex = get().items.find(i => i.variantId === item.variantId)
        if (ex) set({ items: get().items.map(i => i.variantId === item.variantId ? { ...i, qty: i.qty + item.qty } : i) })
        else set({ items: [...get().items, item] })
      },
      remove: (id) => set({ items: get().items.filter(i => i.variantId !== id) }),
      setQty: (id, qty) => set({ items: get().items.map(i => i.variantId === id ? { ...i, qty: Math.max(1, qty) } : i) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'sbw-cart' }
  )
)

export const totals = (items: CartItem[]) => {
  const subtotal = items.reduce((s, i) => s + i.priceCents * i.qty, 0)
  const free = Number(process.env.NEXT_PUBLIC_FREE_SHIP ?? '60000')
  const ship = subtotal >= free ? 0 : Number(process.env.NEXT_PUBLIC_FLAT_SHIP ?? '6900')
  return { subtotal, shipping: ship, total: subtotal + ship }
}
