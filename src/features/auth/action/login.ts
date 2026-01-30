'use server'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
export type LoginActionProps = {
  error?: string
  success?: boolean
} | null

export async function loginAction(
  prevState: LoginActionProps,
  formData: FormData,
) {
  const payload = await getPayload({ config })
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!result.token) {
      return { error: 'Неверные данные или пользователь не найден' }
    }
    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (_e) {
    return { error: 'Неверный логин или пароль' }
  }
  redirect('/')
}
