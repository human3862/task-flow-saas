'use client'
import { Button } from '@/shared/ui'
import Link from 'next/link'
import { useActionState, useEffect, useRef } from 'react'
import { createTaskAction } from '../actions/create-task'
interface CreateTaskFormProps {
  projects: { id: number; title: string }[]
  onSuccess?: () => void
}
export const CreateTaskForm = ({
  projects,
  onSuccess,
}: CreateTaskFormProps) => {
  const [state, formAction, isPending] = useActionState(createTaskAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      onSuccess?.()
    }
  }, [state, onSuccess])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl bg-neutral-700 p-4 text-white shadow-2xl"
    >
      <div className="flex items-center gap-2">
        <input
          name="title"
          placeholder="Что нужно сделать?"
          className="p-1"
          disabled={isPending}
        />

        {state?.error && 'title' in state.error && state.error.title && (
          <p className="text-sm text-red-500">{state.error.title[0]}</p>
        )}
      </div>

      <select
        name="status"
        disabled={isPending}
        defaultValue="todo"
        className="py-2"
      >
        <option value="" disabled hidden>
          Выберите статутс
        </option>
        <option className="bg-neutral-600" value="todo">
          Нужно сделать
        </option>
        <option className="bg-neutral-600" value="doing">
          В процессе
        </option>
        <option className="bg-neutral-600" value="done">
          Готово
        </option>
      </select>

      <select
        name="priority"
        className="py-2"
        disabled={isPending}
        defaultValue="medium"
      >
        <option value="" disabled hidden>
          Выберите приоритет
        </option>
        <option value="low" className="bg-neutral-600">
          Низкий (Low)
        </option>
        <option value="medium" className="bg-neutral-600">
          Средний (Medium)
        </option>
        <option value="high" className="bg-neutral-600">
          Высокий (High)
        </option>
      </select>

      {projects.length > 0 ? (
        <select
          name="project"
          required
          disabled={isPending}
          defaultValue=""
          className="py-2"
        >
          <option value="" disabled hidden>
            Выберите проект
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id} className="bg-neutral-600">
              {p.title}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-1 text-[10px] text-amber-500">
          У вас еще нет проектов.{' '}
          <Link href="/dashboard" className="font-bold text-blue-500 underline">
            Создайте первый
          </Link>
        </p>
      )}

      {state?.error && 'priority' in state.error && (
        <span className="text-center text-xs text-red-500">
          {state.error.priority}
        </span>
      )}

      <Button type="submit" disabled={isPending} variant="water" size="md">
        {isPending ? 'Создаем...' : 'Создать задачу'}
      </Button>

      {state?.success && (
        <p className="text-center text-sm text-green-600">
          Задача успешно добавлена!
        </p>
      )}
    </form>
  )
}
