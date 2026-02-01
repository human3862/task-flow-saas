'use server'
import { CreateTaskSchema } from '@/entities/task/model/schemas'
import { Task } from '@/payload-types'
import config from '@/payload.config'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'

export async function updateTaskStatusAction(
  taskId: string | number,
  newStatus: Task['status'],
  position: number,
) {
  const payload = await getPayload({ config })

  const validated = CreateTaskSchema.partial().safeParse({
    status: newStatus,
    position,
  })

  if (!validated.success) {
    return { error: 'Некорректные данные для обновления' }
  }

  try {
    await payload.update({
      collection: 'tasks',
      id: taskId,
      data: validated.data as Partial<Task>,
    })

    revalidatePath('/dashboard')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Ошибка обновления статуса и позиции' }
  }
}
