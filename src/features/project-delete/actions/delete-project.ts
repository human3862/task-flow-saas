'use server'

import config from '@/payload.config'
import { revalidatePath } from 'next/cache'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export async function deleteProjectAction(projectId: string | number) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) return { error: 'Авторизуйтесь' }

  try {
    await payload.delete({
      collection: 'projects',
      id: projectId,
    })

    revalidatePath('/dashboard')
    revalidatePath('/tasks')
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error)
      return { error: 'Ошибка доступа или проект не найден' }
    return { error: 'Произошла ошибка при удалении' }
  }
}
