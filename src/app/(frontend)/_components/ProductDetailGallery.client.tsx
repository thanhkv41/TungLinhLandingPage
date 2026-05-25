'use client'

import { useMemo, useState } from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type MediaResource = {
  id?: string | number
  alt?: string | null
  updatedAt?: string | null
  url?: string | null
}

type Relationship<T> = T | string | number | null | undefined

type ProductDetailGalleryProps = {
  productTitle?: string | null
  images: Relationship<MediaResource>[]
}

export function ProductDetailGallery({ productTitle, images }: ProductDetailGalleryProps) {
  const mediaImages = useMemo(() => images.filter(isMediaObject), [images])
  const [activeIndex, setActiveIndex] = useState(0)
  const visibleIndex =
    mediaImages.length > 0 && activeIndex < mediaImages.length ? activeIndex : 0

  if (mediaImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-sm text-slate-500">
        Chua co hinh anh
      </div>
    )
  }

  const canSlide = mediaImages.length > 1

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + mediaImages.length) % mediaImages.length)
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % mediaImages.length)
  }

  return (
    <div>
      <div className="relative block aspect-square overflow-hidden rounded-md border border-slate-200 bg-white">
        {mediaImages.map((image, index) => (
          <div
            aria-hidden={visibleIndex !== index}
            className={cn(
              'absolute inset-0 transition-opacity duration-300',
              visibleIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            key={`${String(image.id || image.url || index)}-${index}`}
          >
            <Media
              alt={productTitle || image.alt || ''}
              className="relative block h-full w-full"
              fill
              imgClassName="object-contain"
              priority={index === 0}
              resource={image as never}
              size="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}

        {canSlide && (
          <>
            <button
              aria-label="Anh truoc"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
              onClick={goToPrevious}
              type="button"
            >
              {'<'}
            </button>
            <button
              aria-label="Anh tiep theo"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
              onClick={goToNext}
              type="button"
            >
              {'>'}
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm">
              {mediaImages.map((image, index) => (
                <button
                  aria-label={`Chuyen den anh ${index + 1}`}
                  className={cn(
                    'h-2.5 w-2.5 rounded-full transition-colors',
                    visibleIndex === index ? 'bg-slate-800' : 'bg-slate-300 hover:bg-slate-400',
                  )}
                  key={`dot-${String(image.id || image.url || index)}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {canSlide && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {mediaImages.map((image, index) => (
            <button
              aria-label={`Xem anh ${index + 1}`}
              className={cn(
                'w-24 shrink-0 rounded-md border-2 transition-colors sm:w-[110px]',
                visibleIndex === index ? 'border-red-500' : 'border-slate-200 hover:border-slate-300',
              )}
              key={`thumb-${String(image.id || image.url || index)}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Media
                alt={`${productTitle || 'San pham'} ${index + 1}`}
                className="relative block aspect-square overflow-hidden rounded-[0.2rem] bg-white"
                fill
                imgClassName="object-contain"
                resource={image as never}
                size="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function isMediaObject(item: Relationship<MediaResource>): item is MediaResource {
  return !!item && typeof item === 'object' && 'url' in item && typeof item.url === 'string'
}
