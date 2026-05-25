import { Banner } from '@payloadcms/ui/elements/Banner'
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
        Chọn nhanh khu vực cần cập nhật. Các mục bên dưới là những nội dung chính đang dùng cho website public.
      </p>
      <div className={`${baseClass}__cards`}>
        <a href="/admin/collections/products">
          <strong>Sản phẩm</strong>
          <span>Thêm danh sách sản phẩm, hình ảnh, thông số và catalogue.</span>
        </a>
        <a href="/admin/collections/projects">
          <strong>Dự án</strong>
          <span>Cập nhật công trình tiêu biểu, hình ảnh và sản phẩm đã sử dụng.</span>
        </a>
        <a href="/admin/collections/posts">
          <strong>Tin tức</strong>
          <span>Quản lý bài viết, ngày đăng, ảnh đại diện và SEO.</span>
        </a>
        <a href="/admin/globals/site-settings">
          <strong>Cài đặt website</strong>
          <span>Logo, hotline, email, địa chỉ, mạng xã hội và SEO mặc định.</span>
        </a>
        <a href="/admin/collections/contact-submissions">
          <strong>Liên hệ</strong>
          <span>Xem yêu cầu tư vấn và cập nhật trạng thái xử lý.</span>
        </a>
        <a href="/" target="_blank">
          <strong>Xem website</strong>
          <span>Mở trang public để kiểm tra nội dung sau khi cập nhật.</span>
        </a>
      </div>
    </div>
  )
}

export default BeforeDashboard
