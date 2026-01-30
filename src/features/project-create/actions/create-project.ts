'use server'

import config from '@/payload.config'
import { revalidatePath } from 'next/cache'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export type createProjectActionProps = {
  error?: string
  success?: boolean
} | null

export async function createProjectAction(
  prevState: createProjectActionProps,
  formData: FormData,
) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) return { error: 'Авторизуйтесь' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const isPublic = formData.get('isPublic') === 'on'

  if (!name || name.length < 3) return { error: 'Название слишком короткое' }

  try {
    await payload.create({
      collection: 'projects',
      data: {
        title: name,
        decription: description,
        author: Number(user.id),
        isPublic: isPublic,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/tasks')
    return { success: true }
  } catch (_e) {
    return { error: 'Ошибка при создании проекта' }
  }
}
