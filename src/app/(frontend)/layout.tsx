import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'

import { FloatingActions } from './_components/FloatingActions.client'
import { getSiteSettings } from './_lib/cms'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getSiteSettings()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="vi" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="bg-white text-slate-950">
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header settings={settings} />
          {children}
          <Footer settings={settings} />
          <FloatingActions
            facebookUrl={settings?.facebookUrl}
            hotline={settings?.hotline}
            zaloUrl={settings?.zaloUrl}
          />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: 'Tùng Linh Company',
    template: '%s | Tùng Linh Company',
  },
  description:
    'Website doanh nghiệp sản xuất, gia công inox, nhôm, kính và vật liệu trang trí nội ngoại thất.',
  twitter: {
    card: 'summary_large_image',
  },
}
