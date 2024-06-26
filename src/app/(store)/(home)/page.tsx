import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import formattedPrice from '@/utils/formatted-price'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api('/products/featured', {
    next: {
      revalidate: 60 * 60, // cache changes & revalidate after 1 hour
    },
  })

  const products = await response.json()

  return products
}

export const metadata: Metadata = {
  title: 'home',
}

export default async function Home() {
  const [highligtedProduct, ...otherProducts] = await getFeaturedProducts()

  return (
    <div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
      <Link
        href={`product/${highligtedProduct.slug}`}
        className="group relative col-span-6 row-span-6 flex justify-center overflow-hidden rounded-lg bg-zinc-900"
      >
        <Image
          src={highligtedProduct.image}
          width={1000}
          height={1000}
          quality={100}
          alt={highligtedProduct.title}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute bottom-28 right-28 flex h-12 max-w-[280px] items-center gap-2 rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="truncate text-sm">{highligtedProduct.title}</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
            {formattedPrice(highligtedProduct.price)}
          </span>
        </div>
      </Link>

      {otherProducts.map((product) => {
        return (
          <Link
            key={product.id}
            href={`product/${product.slug}`}
            className="group relative col-span-3 row-span-3 flex justify-center overflow-hidden rounded-lg bg-zinc-900"
          >
            <Image
              src={product.image}
              width={1000}
              height={1000}
              quality={100}
              alt={product.title}
              className="transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute bottom-10 right-10 flex h-12 max-w-[280px] items-center gap-2 rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
              <span className="truncate text-sm">{product.title}</span>
              <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
                {formattedPrice(product.price)}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
