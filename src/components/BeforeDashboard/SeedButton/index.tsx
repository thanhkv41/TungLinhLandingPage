'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Đã tạo dữ liệu mẫu. Bạn có thể{' '}
    <a target="_blank" href="/">
      xem website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Dữ liệu mẫu đã được tạo trước đó.')
        return
      }
      if (loading) {
        toast.info('Đang tạo dữ liệu mẫu.')
        return
      }
      if (error) {
        toast.error('Có lỗi xảy ra, vui lòng tải lại trang và thử lại.')
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('Có lỗi khi tạo dữ liệu mẫu.')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
          }),
          {
            loading: 'Đang tạo dữ liệu mẫu...',
            success: <SuccessMessage />,
            error: 'Có lỗi khi tạo dữ liệu mẫu.',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (đang tạo...)'
  if (seeded) message = ' (xong)'
  if (error) message = ` (lỗi: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Tạo dữ liệu mẫu
      </button>
      {message}
    </Fragment>
  )
}
