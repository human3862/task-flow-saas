import { TasksApiResponseSchema } from '@/entities/task/model/schemas'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import { getPayload, Where } from 'payload'
import { KanbanBoard } from '../ui/KanbanBoard'
interface TaskListProps {
  searchParams: {
    priority?: string
    status?: string
    project?: string
    q?: string
    mine?: string
  }
}

export async function TaskList({ searchParams }: TaskListProps) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  const baseFilters: Where[] = [
    ...(searchParams.priority
      ? [{ priority: { equals: searchParams.priority } }]
      : []),
    ...(searchParams.status
      ? [{ status: { equals: searchParams.status } }]
      : []),
    ...(searchParams.q ? [{ title: { contains: searchParams.q } }] : []),
    ...(searchParams.mine === 'true' && user
      ? [{ author: { equals: user.id } }]
      : []),
  ]
  const contextFilters: Where[] = []
  if (searchParams.project) {
    contextFilters.push({ project: { equals: Number(searchParams.project) } })
  } else {
    if (user?.id) {
      contextFilters.push({ author: { equals: Number(user.id) } })
    } else if (user?.role !== 'admin') {
      contextFilters.push({ author: { equals: -1 } })
    }
  }

  const whereQuery: Where = {
    and: [...baseFilters, ...contextFilters],
  }

  if (searchParams.project) {
    whereQuery.project = { equals: Number(searchParams.project) }
  } else {
    if (user?.id) {
      whereQuery.author = { equals: Number(user.id) }
    } else if (user?.role !== 'admin') {
      whereQuery.author = { equals: -1 }
    }
  }
  const tasksResponse = await payload.find({
    collection: 'tasks',
    limit: 1000,
    where: whereQuery,
    depth: 1,
    sort: '-createdAt',
  })

  console.log('RAW TASK FROM PAYLOAD:', tasksResponse.docs[0]?.project)
  const validationResult = TasksApiResponseSchema.safeParse(tasksResponse)

  if (!validationResult.success) {
    console.error('Payload Data Integrity Error:', validationResult.error)
    return (
      <p className="text-red-500">
        Не удалось загрузить задачи из-за ошибки данных.
      </p>
    )
  }
  const taskList = validationResult.data.docs

  return (
    <KanbanBoard
      tasks={taskList}
      userRole={user?.role}
      currentUserId={user?.id ? String(user.id) : undefined}
    />
  )
}
