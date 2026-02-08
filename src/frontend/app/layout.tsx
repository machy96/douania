import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Douania - Classification HS Code',
  description: 'Assistant de classification douanière intelligent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
