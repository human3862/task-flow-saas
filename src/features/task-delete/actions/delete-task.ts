'use server'

import config from '@/payload.config'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
export async function deleteTaskAction(taskId: string | number) {
  const payload = await getPayload({ config })

  try {
    await payload.delete({
      collection: 'tasks',
      id: taskId,
    })
    revalidatePath('/')
  } catch (_e) {
    return { error: { _form: ['Ошибка при сохранении в базу данных'] } }
  }
}
