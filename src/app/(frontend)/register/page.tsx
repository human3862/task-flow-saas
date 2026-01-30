'use client'

import { registerAction } from '@/features/auth'
import Link from 'next/link'
import { useActionState } from 'react'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-neutral-500">
          Зарегистрируйтесь для управления задачами
        </p>
      </div>
      <form action={formAction} className="flex flex-col gap-5 sm:min-w-md">
        <input
          className="w-full rounded-xl bg-neutral-800/30 px-4 py-3 text-center shadow-2xl hover:bg-neutral-900/30"
          type="text"
          name="nickname"
          required
          placeholder="name"
        />
        <input
          className="w-full rounded-xl bg-neutral-800/30 px-4 py-3 text-center shadow-2xl hover:bg-neutral-900/30"
          type="email"
          name="email"
          required
          placeholder="email"
        />
        <input
          className="w-full rounded-xl bg-neutral-800/30 px-4 py-3 text-center shadow-2xl hover:bg-neutral-900/30"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="password"
        />

        {state?.error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer rounded-xl bg-neutral-800/30 py-3 font-bold shadow-lg transition-all hover:bg-neutral-900/30"
        >
          {isPending ? 'Регистрация...' : 'Зарегестрироваться'}
        </button>
      </form>

      <div className="flex gap-4">
        <h3>Есть аккаунт?</h3>
        <Link href="/login" className="font-semibold hover:text-neutral-400">
          Вход
        </Link>
      </div>
    </main>
  )
}
