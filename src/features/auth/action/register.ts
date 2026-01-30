'use server'

import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export type RegiserActionProps = {
  error?: string
  success?: boolean
} | null

export async function registerAction(
  prevState: RegiserActionProps,
  formData: FormData,
) {
  const payload = await getPayload({ config })

  const nickname = formData.get('nickname') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        nickname,
        role: 'user',
      },
    })

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!result.token) throw new Error('Ошибка при получении токена')
    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (_e) {
    return { error: 'Пользователь с таким email или name уже существует' }
  }
  redirect('/')
}
