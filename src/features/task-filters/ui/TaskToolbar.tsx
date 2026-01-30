'use client'

import { TASK_PRIORITY } from '@/entities/task'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

export const TaskToolbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const currentPriority = searchParams.get('priority')

  const updateUrl = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, pathname, router],
  )

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get('q') || '')) {
        updateUrl('q', searchTerm)
      }
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, searchParams, updateUrl])

  const handleReset = () => {
    setSearchTerm('')
    router.push(pathname)
  }

  return (
    <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-white/5 bg-neutral-900/20 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* поиск */}
        <div className="flex min-w-75 flex-1 items-center gap-3 rounded-xl border border-white/5 bg-neutral-800/30 px-4 py-2 transition-all focus-within:border-blue-500/50">
          <span className="opacity-40">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full bg-transparent text-sm outline-none"
          />
          {isPending && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          )}
        </div>

        {/* сброс */}
        {searchParams.toString() !== '' && (
          <button
            onClick={handleReset}
            className="text-xs font-bold tracking-widest text-neutral-500 uppercase transition-colors hover:text-red-500"
          >
            Сбросить всё ✕
          </button>
        )}
      </div>

      {/* приоритеты */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-[10px] font-bold tracking-tighter text-neutral-500 uppercase">
          Приоритеты:
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => updateUrl('priority', null)}
            className={`transition-colors ${!currentPriority ? 'font-bold text-blue-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Все
          </button>
          {Object.values(TASK_PRIORITY).map((priority) => (
            <button
              key={priority}
              onClick={() => updateUrl('priority', priority)}
              className={`capitalize transition-colors ${currentPriority === priority ? 'font-bold text-blue-500' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
