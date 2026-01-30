'use client'

import { TaskStatus } from '@/entities/task/model/constants'
import { Task } from '@/entities/task/model/schemas'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd'
import { useOptimistic, useTransition } from 'react'
import { deleteTaskAction } from '../../task-delete/actions/delete-task'
import { updateTaskStatusAction } from '../../task-update/actions/update-task-status'

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'Нужно сделать' },
  { id: 'doing', title: 'В процессе' },
  { id: 'done', title: 'Готово' },
]

type OptimisticAction =
  | { type: 'delete'; id: string | number }
  | {
      type: 'move'
      id: string | number
      newStatus: TaskStatus
      newIndex: number
    }
interface AuthorObject {
  id: string | number
}
export function KanbanBoard({
  tasks,
  userRole,
  currentUserId,
}: {
  tasks: Task[]
  userRole?: string
  currentUserId: string | number | undefined
}) {
  const [, startTransition] = useTransition()

  const [optimisticTasks, dispatchOptimistic] = useOptimistic(
    tasks,
    (state, action: OptimisticAction) => {
      if (action.type === 'delete')
        return state.filter((t) => t.id !== action.id)

      if (action.type === 'move') {
        const { id, newStatus, newIndex } = action
        const taskIndex = state.findIndex((t) => t.id === id)
        if (taskIndex === -1) return state

        const task = { ...state[taskIndex], status: newStatus }
        const withoutTask = state.filter((t) => t.id !== id)
        const targetColTasks = withoutTask.filter((t) => t.status === newStatus)
        const otherTasks = withoutTask.filter((t) => t.status !== newStatus)

        const newTargetColTasks = [...targetColTasks]
        newTargetColTasks.splice(newIndex, 0, task)

        return [...otherTasks, ...newTargetColTasks]
      }
      return state
    },
  )

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId, source } = result

    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const taskId = draggableId
    const newStatus = destination.droppableId as any
    const newIndex = destination.index

    startTransition(async () => {
      dispatchOptimistic({ type: 'move', id: taskId, newStatus, newIndex })
      await updateTaskStatusAction(taskId, newStatus, newIndex)
    })
  }

  const handleDelete = (id: string | number) => {
    startTransition(async () => {
      dispatchOptimistic({ type: 'delete', id })
      await deleteTaskAction(id)
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex min-h-125 flex-col gap-4 rounded-2xl bg-neutral-900/20 p-4"
              >
                <h3 className="px-2 text-sm font-bold tracking-widest text-neutral-500 uppercase">
                  {column.title}
                </h3>

                {optimisticTasks
                  .filter((t) => t.status === column.id)
                  .map((task, index) => {
                    const getAuthorId = (
                      author: Task['author'],
                    ): string | number => {
                      if (
                        author &&
                        typeof author === 'object' &&
                        'id' in author
                      ) {
                        return (author as AuthorObject).id
                      }
                      return author as string | number
                    }

                    const authorId = getAuthorId(task.author)
                    const isAuthor =
                      currentUserId !== undefined &&
                      String(authorId) === String(currentUserId)
                    const isAdmin = userRole === 'admin'
                    const canManage = isAuthor || isAdmin
                    const isDragDisabled = !canManage
                    return (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                        isDragDisabled={isDragDisabled}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="group flex items-center justify-between rounded-xl border border-white/5 bg-neutral-900/50 p-4 shadow-lg transition-all hover:bg-neutral-800/50 has-[button:hover]:border-rose-500/50"
                          >
                            <div className="flex flex-col gap-2">
                              <span className="font-medium text-neutral-100">
                                {task.title}
                              </span>
                              {task.project &&
                                typeof task.project === 'object' && (
                                  <span className="text-[10px] font-bold tracking-tighter text-neutral-500 uppercase">
                                    📁 {task.project.title}
                                  </span>
                                )}
                            </div>
                            {(isAuthor || isAdmin) && (
                              <button
                                onClick={() => handleDelete(task.id)}
                                className="p-2 text-neutral-600 opacity-0 transition-all group-hover:opacity-100 hover:text-rose-500"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
