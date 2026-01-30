'use client'

import { Button } from '@/shared/ui'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteProjectAction } from '../actions/delete-project'

export function DeleteProjectButton({
  projectId,
  isAuth,
}: {
  projectId: string | number
  isAuth: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuth) {
      toast.error('Доступ запрещен', {
        description: 'Сначала нужно войти в систему',
      })
      return
    }

    toast('Удалить проект?', {
      description: 'Все задачи потеряют связь с проектом.',
      action: {
        label: 'Удалить',
        onClick: () => executeDelete(),
      },
    })
  }

  const executeDelete = () => {
    startTransition(async () => {
      toast.promise(deleteProjectAction(projectId), {
        loading: 'Удаление проекта...',
        success: (data) => {
          if (data.error) throw new Error(data.error)
          return 'Проект удален'
        },
        error: (err) => `Ошибка: ${err.message}`,
      })
    })
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending}
      variant="danger"
      size="sm"
    >
      {isPending ? '...' : 'Удалить 🗑️'}
    </Button>
  )
}
