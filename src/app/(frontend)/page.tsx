export const dynamic = 'force-dynamic'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-6 bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-5xl font-black text-transparent md:text-7xl">
        Управляйте задачами <br /> с инженерной точностью
      </h1>
      <p className="mb-10 max-w-2xl text-lg leading-relaxed text-neutral-400">
        Enterprise-платформа с Канбан-доской, глубокой аналитикой проектов и
        общим доступом. Построена на Next.js 15 и Payload 3.0.
      </p>

      <div className="flex gap-4">
        <Link
          href="/tasks"
          className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-800"
        >
          Начать работу
        </Link>
        <Link
          href="/register"
          className="rounded-2xl bg-neutral-900/70 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-neutral-900/30"
        >
          Создать аккаунт
        </Link>
      </div>
    </div>
  )
}
