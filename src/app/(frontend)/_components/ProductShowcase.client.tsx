'use client'

import { useMemo, useState } from 'react'

import { ProductCardHome, type ProductCardHomeItem } from './ProductCardHome.client'
import { ScrollReveal } from './ScrollReveal.client'

export type ProductShowcaseItem = ProductCardHomeItem & {
  categoryTitle?: string
  id: string
}

export function ProductShowcase({
  products,
  tabs,
}: {
  products: ProductShowcaseItem[]
  tabs: string[]
}) {
  const [activeTab, setActiveTab] = useState('Tất cả')
  const visibleProducts = useMemo(
    () => products.filter((product) => activeTab === 'Tất cả' || product.categoryTitle === activeTab),
    [activeTab, products],
  )
  const availableTabs = tabs.length > 0 ? ['Tất cả', ...tabs] : ['Tất cả']

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1180px] px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-center text-3xl font-black uppercase text-slate-950 md:text-4xl">SẢN PHẨM</h2>
        </ScrollReveal>

        <ScrollReveal className="mt-8 flex flex-wrap justify-center gap-2" delay={100}>
          {availableTabs.map((tab) => (
            <button
              aria-pressed={activeTab === tab}
              className={`min-h-9 cursor-pointer rounded-sm px-4 text-xs font-bold uppercase transition-colors ${
                activeTab === tab
                  ? 'bg-[#e51e31] text-white'
                  : 'bg-white text-slate-700 shadow-sm hover:text-[#e51e31]'
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </ScrollReveal>

        {visibleProducts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ScrollReveal delay={index * 55} key={product.id}>
                <ProductCardHome product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal className="mt-10 rounded-sm border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            Sản phẩm đang được cập nhật trong CMS.
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
