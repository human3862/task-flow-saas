'use server'
import { LogoutAction } from '@/features/auth/action/logout'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
export async function Header() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()

  const { user } = await payload.auth({ headers })

  return (
    <header className="px-[clamp(20px,4vw,70px)]">
      <div className="flex items-center justify-between p-6 font-semibold">
        <nav className="flex gap-5">
          <Link href="/" className="hover:text-neutral-400">
            Home
          </Link>
          <Link href="/tasks" className="hover:text-neutral-400">
            Tasks
          </Link>
          <Link href="/dashboard" className="hover:text-neutral-400">
            Dashboard
          </Link>
        </nav>

        <div>
          {user ? (
            <div className="flex gap-4">
              <div>
                <span>{user.nickname}</span>
              </div>
              <form action={LogoutAction}>
                <button
                  type="submit"
                  className="border-0 bg-none hover:text-neutral-400"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="hover:text-neutral-400">
                Login
              </Link>
              <Link href="/register" className="hover:text-neutral-400">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
