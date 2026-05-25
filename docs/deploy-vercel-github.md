# Deploy lên Vercel + CI/CD từ GitHub

Tài liệu này áp dụng cho dự án Next.js + Payload CMS + PostgreSQL hiện tại.

## 1) Chuẩn bị trên GitHub

1. Đảm bảo code đã push lên GitHub.
2. Workflow CI đã có tại `.github/workflows/ci.yml`:
   - Chạy tự động khi `pull_request`.
   - Chạy khi `push` vào `main`.
   - Thực hiện `pnpm lint`.

## 2) Tạo database PostgreSQL production

1. Tạo PostgreSQL (Neon / Supabase / RDS / Railway...).
2. Lấy connection string dạng:
   - `postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require`
3. Dùng connection string này cho biến `DATABASE_URL` trên Vercel.

## 3) Import project từ GitHub vào Vercel

1. Vào Vercel Dashboard > `Add New...` > `Project`.
2. Chọn repository GitHub của dự án.
3. Framework giữ mặc định `Next.js`.
4. Root directory: để mặc định (repo root).
5. Build command: `pnpm build`.
6. Output directory: để trống (mặc định Next.js).

## 4) Khai báo Environment Variables trên Vercel

Thêm cho cả `Production` và `Preview` (trừ khi bạn muốn tách riêng):

1. `DATABASE_URL`
2. `PAYLOAD_SECRET`
3. `NEXT_PUBLIC_SERVER_URL`
4. `CRON_SECRET`
5. `PREVIEW_SECRET`

Gợi ý:

- `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET` nên là chuỗi ngẫu nhiên dài (>= 32 ký tự).
- `NEXT_PUBLIC_SERVER_URL`:
  - Production: domain chính, ví dụ `https://example.com`
  - Preview: có thể dùng domain preview của Vercel nếu cần.

## 5) Migrations cho PostgreSQL

Với Payload + Postgres, cần migration khi đổi schema CMS:

1. Tạo migration ở local:
   - `pnpm payload migrate:create`
2. Commit thư mục `src/migrations` lên Git.
3. Trước hoặc trong quá trình deploy production, chạy:
   - `pnpm payload migrate`

Khuyến nghị production: cấu hình build/deploy process để luôn chạy `pnpm payload migrate` trước khi lên bản mới.

## 6) GitHub -> Vercel CD flow

Sau khi repo đã link vào Vercel:

1. Push branch mới hoặc mở PR:
   - Vercel tạo **Preview Deployment** tự động.
2. Merge vào branch production (thường là `main`):
   - Vercel tạo **Production Deployment** tự động.

## 7) Cron jobs cho Payload queue

File `vercel.json` đã cấu hình:

- Gọi `GET /api/payload-jobs/run` mỗi 5 phút.
- Endpoint đã được bảo vệ trong `src/payload.config.ts` bằng `CRON_SECRET`.

## 8) Checklist verify sau deploy

1. Truy cập `/admin` đăng nhập được.
2. Tạo/sửa nội dung `Products`, `Projects`, `Posts` thành công.
3. Các trang public render đúng:
   - `/san-pham`, `/du-an`, `/tin-tuc`, `/lien-he`, ...
4. Kiểm tra logs Vercel không có lỗi kết nối DB.
5. Kiểm tra Cron đã chạy trong tab Logs/Functions.
