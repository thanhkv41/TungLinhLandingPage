import { Banner } from '@payloadcms/ui/elements/Banner'
import Link from 'next/link'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Quản trị website Tùng Linh</h4>
      </Banner>
      <p className={`${baseClass}__intro`}>
        Chọn nhanh khu vực cần cập nhật. Các mục bên dưới là những nội dung chính đang dùng cho
        website public.
      </p>
      <div className={`${baseClass}__cards`}>
        <Link href="/admin/collections/products">
          <strong>Sản phẩm</strong>
          <span>Thêm danh sách sản phẩm, hình ảnh, thông số và catalogue.</span>
        </Link>
        <Link href="/admin/collections/projects">
          <strong>Dự án</strong>
          <span>Cập nhật công trình tiêu biểu, hình ảnh và sản phẩm đã sử dụng.</span>
        </Link>
        <Link href="/admin/collections/posts">
          <strong>Tin tức</strong>
          <span>Quản lý bài viết, ngày đăng, ảnh đại diện và SEO.</span>
        </Link>
        <Link href="/admin/globals/site-settings">
          <strong>Cài đặt website</strong>
          <span>Logo, hotline, email, địa chỉ, mạng xã hội và SEO mặc định.</span>
        </Link>
        <Link href="/admin/collections/contact-submissions">
          <strong>Liên hệ</strong>
          <span>Xem yêu cầu tư vấn và cập nhật trạng thái xử lý.</span>
        </Link>
        <Link href="/" target="_blank">
          <strong>Xem website</strong>
          <span>Mở trang public để kiểm tra nội dung sau khi cập nhật.</span>
        </Link>
      </div>
    </div>
  )
}

export default BeforeDashboard
