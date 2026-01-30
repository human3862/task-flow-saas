import { z } from 'zod'
import { TASK_PRIORITY, TASK_STATUSES } from './constants'

export const TaskSchema = z.object({
  id: z.coerce.string(),
  title: z.string().min(1, 'Заголовок обязателен'),
  status: z.enum(Object.values(TASK_STATUSES) as [string, ...string[]]),
  priority: z.enum(Object.values(TASK_PRIORITY) as [string, ...string[]]),
  project: z
    .union([
      z.object({
        id: z.coerce.string(),
        title: z.string(),
      }),
      z.coerce.string(),
    ])
    .nullable(),
  author: z.union([
    z.object({
      id: z.coerce.string(),
    }),
    z.coerce.string(),
  ]),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const TasksApiResponseSchema = z.object({
  docs: z.array(TaskSchema),
  totalDocs: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  page: z.number(),
})

export const CreateTaskSchema = z.object({
  title: z.string().min(3),
  status: z.enum(['todo', 'doing', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  project: z.union([z.coerce.number(), z.string()]).nullable().optional(),
  position: z.number().optional(),
})

export type Task = z.infer<typeof TaskSchema>
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
