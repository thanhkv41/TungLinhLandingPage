'use client'

import { ChevronUp, MessageCircle, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { cn } from '@/utilities/ui'

type ContactItem = {
  external?: boolean
  href: string
  icon: ReactNode
  label: string
}

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 10) {
    return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }

  return phone
}

const getScrollTop = () =>
  window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0

const setScrollTop = (value: number) => {
  const scrollRoot = document.scrollingElement || document.documentElement

  scrollRoot.scrollTop = value
  document.documentElement.scrollTop = value
  document.body.scrollTop = value
}

export function FloatingActions({
  facebookUrl,
  hotline,
  zaloUrl,
}: {
  facebookUrl?: string | null
  hotline?: string | null
  zaloUrl?: string | null
}) {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const phoneDigits = hotline?.replace(/\D/g, '') || ''
  const phoneLabel = hotline ? formatPhone(hotline) : ''

  const contactItems = useMemo<ContactItem[]>(
    () => {
      const items: ContactItem[] = [
        {
          href: facebookUrl || '/lien-he',
          icon: <MessageCircle className="h-5 w-5" />,
          label: 'Messenger',
          external: Boolean(facebookUrl),
        },
        {
          external: Boolean(zaloUrl || phoneDigits),
          href: zaloUrl || (phoneDigits ? `https://zalo.me/${phoneDigits}` : '/lien-he'),
          icon: <span className="text-[10px] font-black">Zalo</span>,
          label: 'Chat Zalo',
        },
      ]

      if (phoneDigits) {
        items.push({
          href: `tel:${phoneDigits}`,
          icon: <Phone className="h-5 w-5 fill-current" />,
          label: phoneLabel,
        })
      }

      items.push({
        href: '/lien-he',
        icon: <Phone className="h-5 w-5 fill-current" />,
        label: 'Nhận tư vấn',
      })

      return items
    },
    [facebookUrl, phoneDigits, phoneLabel, zaloUrl],
  )

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(getScrollTop() > 420)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsContactOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const scrollToTop = () => {
    setIsContactOpen(false)

    const startTop = getScrollTop()
    const duration = Math.min(900, Math.max(360, startTop * 0.35))
    const startedAt = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startedAt
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const nextTop = Math.round(startTop * (1 - easedProgress))

      setScrollTop(nextTop)

      if (progress < 1) {
        window.requestAnimationFrame(animate)
        return
      }

      setScrollTop(0)
      setShowScrollTop(false)
    }

    window.requestAnimationFrame(animate)
  }

  return (
    <div className="fixed bottom-5 right-4 z-[70] sm:bottom-8 sm:right-6">
      <div
        aria-hidden={!isContactOpen}
        className={cn(
          'absolute bottom-0 right-[74px] w-[min(calc(100vw-7rem),300px)] origin-bottom-right rounded-xl bg-white p-3 shadow-2xl ring-1 ring-slate-900/10 transition-all duration-300 ease-out sm:right-20',
          isContactOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-5 scale-95 opacity-0',
        )}
        id="floating-contact-menu"
      >
        <span className="absolute bottom-9 -right-3 h-0 w-0 border-y-[10px] border-l-[12px] border-y-transparent border-l-white" />
        <div className="relative grid gap-1">
          {contactItems.map((item, index) => {
            const content = (
              <>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ed1c2a] text-white">
                  {item.icon}
                </span>
                <span className="text-base font-medium text-slate-700">{item.label}</span>
              </>
            )
            const className = cn(
              'flex min-h-14 cursor-pointer items-center gap-3 rounded-lg px-2 transition-all duration-300 hover:bg-slate-50',
              isContactOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
            )
            const style = { transitionDelay: isContactOpen ? `${index * 55}ms` : '0ms' }

            if (item.href.startsWith('/')) {
              return (
                <Link
                  className={className}
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsContactOpen(false)}
                  style={style}
                >
                  {content}
                </Link>
              )
            }

            return (
              <a
                className={className}
                href={item.href}
                key={item.label}
                onClick={() => setIsContactOpen(false)}
                rel={item.external ? 'noreferrer' : undefined}
                style={style}
                target={item.external ? '_blank' : undefined}
              >
                {content}
              </a>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          aria-hidden={!showScrollTop}
          aria-label="Cuộn lên đầu trang"
          className={cn(
            'grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[#14275a] text-white shadow-[0_16px_35px_rgba(20,39,90,0.32)] ring-2 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0f1f49] hover:shadow-[0_20px_42px_rgba(20,39,90,0.42)] sm:h-16 sm:w-16',
            showScrollTop
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-3 scale-90 opacity-0',
          )}
          disabled={!showScrollTop}
          onClick={scrollToTop}
          type="button"
        >
          <ChevronUp className="h-7 w-7 stroke-[3]" />
        </button>

        <button
          aria-controls="floating-contact-menu"
          aria-expanded={isContactOpen}
          aria-label={isContactOpen ? 'Đóng menu liên hệ' : 'Mở menu liên hệ'}
          className="grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[#ed1c2a] text-white shadow-[0_16px_35px_rgba(237,28,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d81725] sm:h-16 sm:w-16"
          onClick={() => setIsContactOpen((current) => !current)}
          type="button"
        >
          {isContactOpen ? <X className="h-7 w-7" /> : <span className="text-[12px] font-black">Zalo</span>}
        </button>
      </div>
    </div>
  )
}
