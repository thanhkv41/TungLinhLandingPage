import { getPayload } from 'payload'

import config from '@payload-config'

const PHONE_ALLOWED_REGEX = /^[0-9+\s().-]{8,20}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeText(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown>

  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Dữ liệu gửi không hợp lệ.' }, { status: 400 })
  }

  const fullName = collapseWhitespace(normalizeText(body.fullName))
  const phone = collapseWhitespace(normalizeText(body.phone))
  const email = normalizeText(body.email).toLowerCase()
  const productInterest = collapseWhitespace(normalizeText(body.productInterest))
  const message = collapseWhitespace(normalizeText(body.message))
  const company = normalizeText(body.company)

  if (company) {
    // Honeypot: silently accept bot-like submissions.
    return Response.json({ success: true })
  }

  if (fullName.length < 2 || fullName.length > 120) {
    return Response.json({ error: 'Vui lòng nhập họ và tên hợp lệ.' }, { status: 400 })
  }

  if (!PHONE_ALLOWED_REGEX.test(phone)) {
    return Response.json({ error: 'Số điện thoại không đúng định dạng.' }, { status: 400 })
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    return Response.json({ error: 'Số điện thoại cần từ 8 đến 15 chữ số.' }, { status: 400 })
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Email không đúng định dạng.' }, { status: 400 })
  }

  if (productInterest.length > 160) {
    return Response.json({ error: 'Tên sản phẩm quan tâm quá dài.' }, { status: 400 })
  }

  if (message.length < 10 || message.length > 2000) {
    return Response.json({ error: 'Nội dung cần từ 10 đến 2000 ký tự.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'contact-submissions',
      data: {
        fullName,
        phone,
        email: email || undefined,
        productInterest: productInterest || undefined,
        message,
        status: 'new',
      },
    })

    return Response.json({ success: true })
  } catch (error) {
    payload.logger.error({ err: error }, 'Failed to create contact submission')
    return Response.json({ error: 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.' }, { status: 500 })
  }
}
