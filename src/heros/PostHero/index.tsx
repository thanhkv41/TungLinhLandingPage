import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { category, featuredImage, publishedAt, title } = post
  const categoryTitle = typeof category === 'object' && category !== null ? category.title : null

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {categoryTitle && <div className="uppercase text-sm mb-6">{categoryTitle}</div>}

          <div>
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          {publishedAt && (
            <div className="flex flex-col gap-1">
              <p className="text-sm">Ngày đăng</p>
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </div>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {featuredImage && typeof featuredImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={featuredImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
