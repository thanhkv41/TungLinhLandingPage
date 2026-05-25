import React from 'react'

const defaultLabels = {
  plural: 'bản ghi',
  singular: 'bản ghi',
}

const defaultCollectionLabels = {
  posts: {
    plural: 'tin tức',
    singular: 'tin tức',
  },
}

export const PageRange: React.FC<{
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const { plural, singular } =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabels[collection] : undefined) ||
    defaultLabels ||
    {}

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && 'Không có kết quả phù hợp.'}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        `Hiển thị ${indexStart}${indexStart > 0 ? ` - ${indexEnd}` : ''} trong ${totalDocs} ${
          totalDocs > 1 ? plural : singular
        }`}
    </div>
  )
}
