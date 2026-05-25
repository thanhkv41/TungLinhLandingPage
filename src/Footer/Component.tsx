import Image from 'next/image'
import Link from 'next/link'

import { asMedia, mediaUrl, type SiteSettings } from '@/app/(frontend)/_lib/cms'

export async function Footer({ settings }: { settings?: SiteSettings | null }) {
  const logo = asMedia(settings?.logo)
  const logoUrl = mediaUrl(settings?.logo)
  const socialLinks = [
    { href: settings?.facebookUrl, label: 'f' },
    { href: settings?.zaloUrl, label: 'z' },
    { href: settings?.youtubeUrl, label: 'yt' },
  ].filter((item): item is { href: string; label: string } => Boolean(item.href))

  return (
    <footer className="relative mt-auto overflow-hidden bg-white py-12">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative mx-auto grid max-w-[1180px] gap-10 px-4 md:grid-cols-2">
        <div>
          <Link className="inline-flex items-center" href="/">
            {logoUrl ? (
              <span className="relative block h-[72px] w-[72px] overflow-hidden md:h-20 md:w-20">
                <Image
                  alt={logo?.alt || settings?.siteName || 'Tùng Linh'}
                  className="object-contain"
                  fill
                  sizes="(min-width: 768px) 80px, 72px"
                  src={logoUrl}
                />
              </span>
            ) : (
              <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#e51e31] text-xl font-black text-white md:h-20 md:w-20">
                TL
              </span>
            )}
            <span className="hidden">
              {settings?.siteName || 'Tùng Linh'}
            </span>
          </Link>
          <h2 className="mt-4 text-lg font-black uppercase text-slate-950">
            {settings?.siteName || 'Thông tin công ty đang cập nhật'}
          </h2>
          <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
            {settings?.address ? <p>{settings.address}</p> : <p>Địa chỉ đang cập nhật.</p>}
            {settings?.hotline && <p>Hotline: {settings.hotline}</p>}
            {settings?.email && <p>Email: {settings.email}</p>}
          </div>
        </div>
        <div className="md:text-right">
          <h3 className="font-extrabold uppercase text-slate-950">Văn phòng / showroom</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {settings?.showroomAddress || settings?.factoryAddress || 'Đang cập nhật trong CMS.'}
          </p>
          <div className="mt-5 flex gap-3 md:justify-end">
            {socialLinks.map((item) => (
              <Link
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-xs font-bold text-slate-700"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
