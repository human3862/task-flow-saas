'use client'
import { Project } from '@/payload-types'
import { Button } from '@/shared/ui'
import { Modal } from '@/shared/ui/Modal'
import { useState } from 'react'
import { toast } from 'sonner'
import { CreateTaskForm } from './CreateTaskForm'
interface AddTaskButtonProps {
  projects: Pick<Project, 'id' | 'title'>[]
  isAuth: boolean
}
export const AddTask = ({ projects, isAuth }: AddTaskButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleOpen = () => {
    if (!isAuth) {
      toast.error('Сначало нужно войти в систему')
      return setIsOpen(false)
    }
    return setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setFormKey((prev) => prev + 1)
  }
  return (
    <div className="flex justify-center p-[clamp(10px,3vw,25px)]">
      <Button onClick={handleOpen}>Добавить задачу</Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <CreateTaskForm
          projects={projects}
          key={formKey}
          onSuccess={handleClose}
        />
      </Modal>
    </div>
  )
}
