'use server'
import { CreateTaskSchema } from '@/entities/task/model/schemas'
import config from '@/payload.config'
import { revalidatePath } from 'next/cache'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export type CreateTaskState = {
  error?: { title?: string[]; status?: string[]; _form?: string[] }
  success?: boolean
} | null

export async function createTaskAction(
  prevState: CreateTaskState,
  formData: FormData,
) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) return { error: { _form: ['Вы должны быть авторизованы'] } }

  const projectValue = formData.get('project')
  const project = projectValue && projectValue !== '' ? projectValue : null

  const rawData = {
    title: formData.get('title'),
    status: formData.get('status') || 'todo',
    priority: formData.get('priority') || 'medium',
    project: project,
  }

  const validated = CreateTaskSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  try {
    await payload.create({
      collection: 'tasks',
      data: {
        ...validated.data,
        project: validated.data.project ? Number(validated.data.project) : null,
        author: Number(user.id),
      },
    })

    revalidatePath('/tasks')
    return { success: true }
  } catch (e) {
    console.error('CREATE_TASK_ERROR:', e)
    return { error: { _form: ['Ошибка при сохранении в базу данных'] } }
  }
}
