import { TaskSkeleton } from '@/entities/task/ui/TaskSkeletom'

export default function LoadingTasks() {
  return (
    <div className="space-y-4">
      <h2 className="text-center text-3xl font-semibold">
        Загрузка списков задач...
      </h2>
      <div className="grid gap-2">
        {[...Array(5)].map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
