import { prisma } from "@/lib/prisma"
import PDPClient from "./pdp-client"

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      description: true,
      variants: {
        orderBy: { label: "asc" },
        select: {
          id: true,
          label: true,
          size: true,
          priceZAR: true,
          stock: true,
          whatsappSku: true,
          scentNotes: true,
          tags: true,
          imageUrl: true,
          active: true,
        },
      },
    },
  })

  if (!product) {
    return <div>Product not found</div>
  }

  return <PDPClient product={product as any} />
}
