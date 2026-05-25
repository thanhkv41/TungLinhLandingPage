# PROJECT SPEC

## Mục tiêu

Xây dựng website doanh nghiệp tiếng Việt cho công ty nhôm kính / nhôm hệ / cửa nhôm / dự án công trình.

Website có:

- Trang chủ
- Giới thiệu
- Sản phẩm
- Chi tiết sản phẩm
- Dự án
- Chi tiết dự án
- Tin tức
- Chi tiết tin tức
- Tài liệu tải về
- Liên hệ
- CMS quản trị tại `/admin`

## Tech stack cố định

- Next.js App Router
- TypeScript
- Payload CMS trong cùng project
- PostgreSQL
- Tailwind CSS
- Admin route: `/admin`
- Ngôn ngữ website: Tiếng Việt
- SEO bằng Next.js Metadata API

## Không làm

- Không làm giỏ hàng
- Không làm thanh toán
- Không dùng Strapi/Sanity/Directus
- Không dùng Redux
- Không copy nội dung/hình ảnh từ website mẫu
- Không hard-code sản phẩm vào component

## Routes cần có

- `/`
- `/gioi-thieu`
- `/san-pham`
- `/san-pham/[slug]`
- `/du-an`
- `/du-an/[slug]`
- `/tin-tuc`
- `/tin-tuc/[slug]`
- `/tai-lieu`
- `/lien-he`
- `/admin`

## CMS cần có

- Users
- Media
- SiteSettings
- ProductCategories
- Products
- ProjectCategories
- Projects
- PostCategories
- Posts
- Certificates
- Documents
- Banners
- ContactSubmissions

## SEO

Mỗi sản phẩm, dự án, bài viết cần có:

- slug
- seoTitle
- seoDescription
- ogImage

Cần có:

- sitemap.xml
- robots.txt
- metadata động từ CMS
