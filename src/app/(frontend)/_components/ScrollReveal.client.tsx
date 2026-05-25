'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/utilities/ui'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
  threshold?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
  threshold = 0.18,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)

          if (once) {
            observer.unobserve(entry.target)
          }

          return
        }

        if (!once) {
          setIsVisible(false)
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [once, threshold])

  return (
    <div
      className={cn('home-reveal', isVisible && 'is-visible', className)}
      ref={ref}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
