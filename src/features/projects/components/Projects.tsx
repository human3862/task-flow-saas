import { DeleteProjectButton } from '@/features/project-delete'
import { ShareProjectButton } from '@/features/project-share'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'

export async function Projects() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    user: user,
    overrideAccess: false,
  })

  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      const { totalDocs: taskCount } = await payload.count({
        collection: 'tasks',
        where: {
          project: { equals: project.id },
        },
        user: user,
        overrideAccess: false,
      })
      return { ...project, taskCount }
    }),
  )

  return (
    <>
      {projectsWithStats.map((project) => (
        <Link
          href={`/tasks?project=${project.id}`}
          key={project.id}
          className="group block rounded-2xl border border-neutral-800 bg-neutral-800/70 p-5 transition-all hover:border-neutral-700"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white transition-colors group-hover:text-blue-400">
                {project.title}
              </h3>
              <p className="text-sm text-neutral-500">
                {project.decription || 'Нет описания'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 text-right">
              <div>
                <span className="text-2xl leading-none font-black text-white">
                  {project.taskCount}
                </span>
                <p className="text-[10px] font-bold text-neutral-500 uppercase">
                  Tasks
                </p>
              </div>
              <div className="flex gap-2">
                <ShareProjectButton projectId={project.id} />
                <DeleteProjectButton
                  projectId={project.id}
                  isAuth={Boolean(user)}
                />
              </div>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full bg-blue-600 transition-all duration-1000"
              style={{
                width: `${Math.min((project.taskCount / 10) * 100, 100)}%`,
              }}
            />
          </div>
        </Link>
      ))}
    </>
  )
}
