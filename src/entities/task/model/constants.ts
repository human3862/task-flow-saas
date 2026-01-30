export const TASK_STATUSES = {
  TODO: 'todo',
  DOING: 'doing',
  DONE: 'done',
}

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY]
export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES]
