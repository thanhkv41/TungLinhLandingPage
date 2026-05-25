'use client'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Media, Post } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'

export type CardPostData = Partial<
  Pick<Post, 'category' | 'excerpt' | 'featuredImage' | 'slug' | 'title'>
>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { className, doc, showCategories, title: titleFromProps } = props

  const { category, excerpt, featuredImage, slug, title } = doc || {}
  const titleToUse = titleFromProps || title
  const href = `/tin-tuc/${slug}`
  const categoryTitle = typeof category === 'object' && category !== null ? category.title : null

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {featuredImage && typeof featuredImage === 'object' && (
          <MediaComponent fill imgClassName="object-cover" resource={featuredImage as Media} size="33vw" />
        )}
      </div>
      <div className="p-4">
        {showCategories && categoryTitle && (
          <div className="uppercase text-sm mb-4">{categoryTitle}</div>
        )}
        {titleToUse && slug && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {excerpt && <div className="mt-2"><p>{excerpt}</p></div>}
      </div>
    </article>
  )
}
