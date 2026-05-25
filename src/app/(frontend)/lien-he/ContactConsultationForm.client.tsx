'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function ContactConsultationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (submitState === 'submitting') return

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      fullName: String(formData.get('fullName') || ''),
      phone: String(formData.get('phone') || ''),
      email: String(formData.get('email') || ''),
      productInterest: String(formData.get('productInterest') || ''),
      message: String(formData.get('message') || ''),
      company: String(formData.get('company') || ''),
    }

    setSubmitState('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setSubmitState('error')
        setErrorMessage(result.error || 'Không thể gửi yêu cầu. Vui lòng thử lại.')
        return
      }

      setSubmitState('success')
      form.reset()
    } catch {
      setSubmitState('error')
      setErrorMessage('Có lỗi kết nối. Vui lòng thử lại sau ít phút.')
    }
  }

  return (
    <form className="rounded-md border border-slate-200 bg-white p-6 shadow-sm" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Họ và tên" name="fullName" required />
        <Field label="Số điện thoại" name="phone" required />
        <Field label="Email" name="email" type="email" />
        <Field label="Sản phẩm quan tâm" name="productInterest" />
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-800">Nội dung</span>
        <textarea
          className="mt-2 min-h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-sky-800"
          name="message"
          placeholder="Mô tả nhu cầu hoặc thông tin công trình"
          required
        />
      </label>

      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="company"
        tabIndex={-1}
        type="text"
      />

      <button
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-sky-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        disabled={submitState === 'submitting'}
        type="submit"
      >
        {submitState === 'submitting' ? 'Đang gửi...' : 'Gửi thông tin'}
      </button>

      {submitState === 'success' && (
        <p className="mt-3 text-sm text-emerald-700">
          Cảm ơn bạn. Đội ngũ tư vấn đã nhận thông tin và sẽ liên hệ sớm.
        </p>
      )}

      {submitState === 'error' && <p className="mt-3 text-sm text-red-700">{errorMessage}</p>}
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-950 outline-none focus:border-sky-800"
        name={name}
        required={required}
        type={type}
      />
    </label>
  )
}
