'use client'

import { ChevronDown, Menu, Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

type ProductCategory = {
  id: string | number
  slug?: string | null
  title?: string | null
}

const navItems = [
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/du-an', label: 'Dự án' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export function HeaderClient({
  logoAlt,
  logoUrl,
  productCategories,
  siteName,
}: {
  logoAlt?: string | null
  logoUrl?: string | null
  productCategories?: ProductCategory[]
  siteName?: string | null
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isHome = pathname === '/'
  const brandName = siteName || 'Tùng Linh'
  const categories = useMemo(
    () =>
      (productCategories || []).filter(
        (item): item is ProductCategory & { slug: string; title: string } =>
          Boolean(item.slug && item.title),
      ),
    [productCategories],
  )
  const logoSizeClass = isHome
    ? 'h-[144px] w-[144px] md:h-[160px] md:w-[160px]'
    : 'h-[72px] w-[72px] md:h-20 md:w-20'
  const logoSizes = isHome ? '(min-width: 768px) 160px, 144px' : '(min-width: 768px) 80px, 72px'
  const desktopDropdownClasses =
    'pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-[255px] -translate-x-1/2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100'

  return (
    <header
      className={
        isHome
          ? 'absolute left-0 top-0 z-50 w-full text-white'
          : 'sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-950 shadow-sm'
      }
    >
      <div className="mx-auto flex min-h-[72px] max-w-[1180px] items-center justify-between px-4 py-3">
        <Link className="inline-flex items-center" href="/">
          {logoUrl ? (
            <span className={`relative block overflow-hidden ${logoSizeClass}`}>
              <Image
                alt={logoAlt || brandName}
                className="object-contain"
                fill
                sizes={logoSizes}
                src={logoUrl}
              />
            </span>
          ) : (
            <span
              className={`grid place-items-center rounded-full bg-[#e51e31] text-xl font-black text-white ${logoSizeClass}`}
            >
              TL
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 text-base font-extrabold uppercase tracking-wide lg:flex">
          <div className="group relative">
            <Link
              className="inline-flex items-center gap-1 transition-colors hover:text-[#e51e31]"
              href="/san-pham"
            >
              <span>Sản phẩm</span>
              {categories.length > 0 ? (
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
              ) : null}
            </Link>

            {categories.length > 0 ? (
              <div className={desktopDropdownClasses}>
                <div className="border-t-2 border-[#e51e31] bg-white py-1 text-left normal-case shadow-xl">
                  {categories.map((category) => (
                    <Link
                      className="block border-b border-slate-200 px-5 py-3 text-base font-semibold text-slate-800 transition-colors last:border-b-0 hover:bg-slate-50 hover:text-[#e51e31]"
                      href={`/san-pham?category=${encodeURIComponent(category.slug)}`}
                      key={category.id}
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {navItems.map((item) => (
            <Link className="transition-colors hover:text-[#e51e31]" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link aria-label="Tìm kiếm" className="transition-colors hover:text-[#e51e31]" href="/search">
            <Search className="h-4 w-4" />
          </Link>
        </nav>

        <button
          aria-label="Mở menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-current/30 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-4 mb-4 rounded-sm bg-white p-4 text-slate-950 shadow-xl lg:hidden">
          <nav className="grid gap-3 text-sm font-bold uppercase">
            <Link href="/san-pham" onClick={() => setOpen(false)}>
              Sản phẩm
            </Link>
            {categories.length > 0
              ? categories.map((category) => (
                  <Link
                    className="pl-4 text-xs font-semibold normal-case text-slate-700"
                    href={`/san-pham?category=${encodeURIComponent(category.slug)}`}
                    key={category.id}
                    onClick={() => setOpen(false)}
                  >
                    {category.title}
                  </Link>
                ))
              : null}

            {navItems.map((item) => (
              <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link className="inline-flex items-center gap-2" href="/search" onClick={() => setOpen(false)}>
              <Search className="h-4 w-4" />
              Tìm kiếm
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
