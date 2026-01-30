import { TaskList } from '@/features/task'
import { AddTask } from '@/features/task-create'
import { TaskToolbar } from '@/features/task-filters'
import { Project } from '@/payload-types'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ priority?: string; status?: string }>
}) {
  const params = await searchParams
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  let projects: Project[] = []

  if (user?.id) {
    const projectsData = await payload.find({
      collection: 'projects',
      limit: 100,
      select: { title: true },
      where: {
        author: { equals: user.id },
      },
    })
    projects = projectsData.docs as Project[]
  }
  return (
    <section className="flex flex-col gap-3">
      <h2 className="mb-[clamp(10px,3vw,20px)] text-center text-3xl font-semibold">
        Панель управления задачами
      </h2>
      <div className="px-[clamp(10px,3vw,40px)]">
        <TaskToolbar />
        <TaskList searchParams={params} />
        <AddTask projects={projects} isAuth={Boolean(user)} />
      </div>
    </section>
  )
}
