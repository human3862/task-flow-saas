export const dynamic = 'force-dynamic'
import { Header } from '@/widgets/header'
import React from 'react'
import { Toaster } from 'sonner'
import '../global.css'
export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-neutral-700 text-gray-200">
        <Header />
        <main>{children}</main>
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  )
}
