import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const { pathname, searchParams } = request.nextUrl

  const isTasksPage = pathname.startsWith('/tasks')
  const isLoginPage = pathname === '/login'
  const isSharedProject = searchParams.has('project')

  if (isTasksPage && !token && !isSharedProject) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/tasks', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tasks/:path*', '/login'],
}
