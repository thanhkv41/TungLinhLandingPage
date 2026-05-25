'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export type HomeHeroSlide = {
  alt: string
  src?: string
}

const AUTO_PLAY_MS = 5000

export function HomeHeroSlider({ slides }: { slides: HomeHeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <>
      {slides.map((slide, index) => (
        <div
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          key={`${slide.src || 'fallback'}-${index}`}
        >
          {slide.src ? (
            <Image
              alt={slide.alt}
              className="object-cover"
              fill
              priority={index === 0}
              sizes="100vw"
              src={slide.src}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.22),transparent_34%),linear-gradient(135deg,#0f172a_0%,#164e63_45%,#14532d_100%)]" />
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              aria-label={`Chuyển tới banner ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/45'
              }`}
              key={`dot-${slide.src || 'fallback'}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      )}
    </>
  )
}
