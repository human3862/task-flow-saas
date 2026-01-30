import { CollectionConfig, Where } from 'payload'
import { TASK_STATUSES } from './constants'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }): Where | boolean => {
      if (user?.role === 'admin') return true
      if (!user) return { 'project.isPublic': { equals: true } }

      return {
        or: [
          { author: { equals: user.id } },
          {
            and: [
              { project: { exists: true } },
              { 'project.isPublic': { equals: true } },
            ],
          },
        ],
      } as Where
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { author: { equals: user.id } }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { author: { equals: user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Todo', value: TASK_STATUSES.TODO },
        { label: 'Doing', value: TASK_STATUSES.DOING },
        { label: 'Done', value: TASK_STATUSES.DONE },
      ],
      defaultValue: 'todo',
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
      defaultValue: 'medium',
      required: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: false,
      required: false,
    },
    {
      name: 'position',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
