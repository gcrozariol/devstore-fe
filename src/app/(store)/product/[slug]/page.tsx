import { AddToCartButton } from '@/components/add-to-cart-button'
import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import formattedPrice from '@/utils/formatted-price'
import { Metadata } from 'next'
import Image from 'next/image'

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, // cache changes & revalidate after 1 hour
    },
  })

  const product = await response.json()

  return product
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return { title: product.title }
}

export async function generateStaticParams() {
  const reponse = await api('/products/featured')
  const products: Product[] = await reponse.json()

  return products.map((product) => {
    return { slug: product.slug }
  })
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image
          src={product.image}
          alt=""
          width={1000}
          height={1000}
          quality={100}
        />
      </div>

      <div className="flex flex-col justify-center px-12">
        <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>

        <p className="mt-2 leading-relaxed text-zinc-400">
          {product.description}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
            {formattedPrice(product.price)}
          </span>

          <span className="text-sm text-zinc-400">
            12x installments of {formattedPrice(product.price / 12)}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <span className="block font-semibold"></span>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold transition-colors hover:bg-zinc-700 focus:bg-zinc-900 active:bg-zinc-900"
            >
              S
            </button>

            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold transition-colors hover:bg-zinc-700 focus:bg-zinc-900 active:bg-zinc-900"
            >
              M
            </button>

            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold transition-colors hover:bg-zinc-700 focus:bg-zinc-900 active:bg-zinc-900"
            >
              L
            </button>

            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold transition-colors hover:bg-zinc-700 focus:bg-zinc-900 active:bg-zinc-900"
            >
              XL
            </button>

            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold transition-colors hover:bg-zinc-700 focus:bg-zinc-900 active:bg-zinc-900"
            >
              XXL
            </button>
          </div>
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  )
}
