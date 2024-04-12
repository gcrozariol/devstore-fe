import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import formattedPrice from '@/utils/formatted-price'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface SearchProps {
  searchParams: {
    q: string
  }
}

async function searchProducts(query: string): Promise<Product[]> {
  const response = await api(`/products/search?q=${query}`, {
    next: {
      revalidate: 60 * 60, // cache changes & revalidate after 1 hour
    },
  })

  const products = await response.json()

  return products
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  const products = await searchProducts(query)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Results for: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => {
          return (
            <Link
              key={product.id}
              href={`product/${product.slug}`}
              className="group relative flex justify-center overflow-hidden rounded-lg bg-zinc-900"
            >
              <Image
                src={product.image}
                width={480}
                height={480}
                quality={100}
                alt=""
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
    </div>
  )
}
