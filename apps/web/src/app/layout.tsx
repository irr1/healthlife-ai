import type { Metadata } from 'next'
import '@/styles/globals.css'
import ToastProvider from '@/components/ui/Toast'

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
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
