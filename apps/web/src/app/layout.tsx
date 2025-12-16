import type { Metadata } from 'next'
import '@/styles/globals.css'
import ToastProvider from '@/components/ui/Toast'
import QueryProvider from '@/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'HealthLife AI',
  description: 'AI-powered personal health coach',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
