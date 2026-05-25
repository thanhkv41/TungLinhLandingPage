import { Mail, MapPin, Phone } from 'lucide-react'
import type React from 'react'

import { buildMetadata, getSiteSettings } from '../_lib/cms'
import { ContactConsultationForm } from './ContactConsultationForm.client'
import { ButtonLink, PageHeader, Section } from '../_components/website'

export const revalidate = 300

export const generateMetadata = () =>
  buildMetadata({
    title: 'Liên hệ',
    description: 'Thông tin liên hệ và tư vấn nhôm kính công trình.',
  })

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <PageHeader
        description="Gửi thông tin để được tư vấn giải pháp nhôm kính phù hợp cho công trình."
        title="Liên hệ"
      />
      <Section>
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <ContactLine icon={<Phone className="h-5 w-5" />} label="Hotline" value={settings?.hotline} />
            <ContactLine icon={<Mail className="h-5 w-5" />} label="Email" value={settings?.email} />
            <ContactLine icon={<MapPin className="h-5 w-5" />} label="Địa chỉ" value={settings?.address} />
            <ContactLine label="Xưởng sản xuất" value={settings?.factoryAddress} />
            <ContactLine label="Showroom" value={settings?.showroomAddress} />
            <div className="flex flex-wrap gap-3 pt-3">
              {settings?.facebookUrl && (
                <ButtonLink href={settings.facebookUrl} variant="secondary">
                  Facebook
                </ButtonLink>
              )}
              {settings?.zaloUrl && (
                <ButtonLink href={settings.zaloUrl} variant="secondary">
                  Zalo
                </ButtonLink>
              )}
              {settings?.youtubeUrl && (
                <ButtonLink href={settings.youtubeUrl} variant="secondary">
                  YouTube
                </ButtonLink>
              )}
            </div>
          </div>

          <ContactConsultationForm />
        </div>
      </Section>
      {settings?.googleMapEmbedUrl && (
        <section className="bg-white pb-16">
          <div className="container">
            <MapEmbed value={settings.googleMapEmbedUrl} />
          </div>
        </section>
      )}
    </>
  )
}

function MapEmbed({ value }: { value: string }) {
  if (value.includes('<iframe')) {
    return (
      <div
        className="aspect-[16/7] overflow-hidden rounded-md border border-slate-200 [&_iframe]:h-full [&_iframe]:w-full"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }

  return (
    <iframe
      className="aspect-[16/7] w-full rounded-md border border-slate-200"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={value}
      title="Bản đồ"
    />
  )
}

function ContactLine({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value?: string | null
}) {
  if (!value) return null

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3 text-sky-900">
        {icon}
        <h2 className="font-semibold text-slate-950">{label}</h2>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{value}</p>
    </div>
  )
}
