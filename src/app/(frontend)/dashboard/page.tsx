import { CreateProject } from '@/features/project-create'
import { Projects } from '@/features/projects'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  const { totalDocs: totalTasks } = await payload.count({
    collection: 'tasks',
    user: user,
    overrideAccess: false,
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-neutral-500">
            Общая статистика по проектам и задачам
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-blue-500">{totalTasks}</p>
          <p className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
            Всего задач в системе
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-300">
            Нагрузка по проектам
          </h2>
          <CreateProject isAuth={Boolean(user)} />
        </div>

        <Projects />
      </div>
    </div>
  )
}
