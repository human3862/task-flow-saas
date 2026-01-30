import type { Access, CollectionConfig, Where } from 'payload'

const readAccess: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true

  if (user) {
    return {
      or: [
        {
          author: {
            equals: user.id,
          },
        },
        {
          isPublic: {
            equals: true,
          },
        },
      ],
    } as Where
  }

  return {
    isPublic: {
      equals: true,
    },
  }
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: readAccess,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { author: { equals: user?.id } }
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { author: { equals: user?.id } }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'createdAt'],
  },
  hooks: {
    afterDelete: [
      async ({ id, req }) => {
        try {
          await req.payload.delete({
            collection: 'tasks',
            where: {
              project: { equals: id },
            },
            req,
          })
          console.log(`Задачи проекта ${id} успешно удалены.`)
        } catch (err) {
          console.error('Ошибка при каскадном удалении задач:', err)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'decription',
      type: 'textarea',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
      label: 'Доступ по ссылке',
    },
  ],
}
