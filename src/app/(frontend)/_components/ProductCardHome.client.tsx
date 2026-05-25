'use client'

import Image from 'next/image'
import Link from 'next/link'

export type ProductCardHomeItem = {
  description?: string | null
  href: string
  imageAlt?: string
  imageUrl?: string
  title: string
}

export function ProductCardHome({ product }: { product: ProductCardHomeItem }) {
  return (
    <Link
      aria-label={`Xem sản phẩm ${product.title}`}
      className="group block h-full cursor-pointer overflow-hidden rounded-sm bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      href={product.href}
    >
      <div className="relative aspect-[5/6] overflow-hidden bg-[#f3f4f6]">
        <div className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-[10px] font-extrabold text-[#e51e31] shadow-sm">
          TL
        </div>
        {product.imageUrl ? (
          <Image
            alt={product.imageAlt || product.title}
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            src={product.imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
            Chưa có hình ảnh
          </div>
        )}
      </div>
      <div className="p-5 text-center">
        <h3 className="text-sm font-extrabold uppercase leading-snug text-slate-950">{product.title}</h3>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{product.description}</p>
        )}
      </div>
    </Link>
  )
}
