'use client'

import { Button } from '@/shared/ui'
import { Modal } from '@/shared/ui/Modal'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createProjectAction } from '../actions/create-project'

export const CreateProject = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    null,
  )

  useEffect(() => {
    if (state?.success) setIsOpen(false)
  }, [state])

  const handleOpen = () => {
    if (!isAuth) {
      toast.error('Сначало нужно войти в систему')
      return setIsOpen(false)
    }
    return setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <div className="flex justify-center">
      <Button onClick={handleOpen} variant="secondary">
        Добавить проект
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <form
          action={formAction}
          className="flex min-h-[20vh] flex-col justify-center gap-8 rounded-2xl bg-neutral-700 p-4 text-white shadow-2xl"
        >
          <div className="display flex flex-col items-center justify-center gap-4 text-center">
            <input
              type="text"
              name="name"
              placeholder="Название проекта "
              required
              className="max-w-max py-2 text-center"
            />

            <textarea
              name="description"
              placeholder="Описание..."
              className="text-center"
            />
            <div className="flex items-center justify-center gap-4">
              <p className={isPublic ? 'text-white' : 'text-white/45'}>
                {isPublic ? 'Публичный' : 'Приватный'}
              </p>
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="-mb-px cursor-pointer"
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} variant="water" size="md">
            {isPending ? 'Создаем...' : 'Создать проект'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
