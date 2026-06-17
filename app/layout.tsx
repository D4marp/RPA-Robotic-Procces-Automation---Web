import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = { title: 'RPA Dashboard' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <div className="flex min-h-screen">
          <aside className="w-56 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-1">
            <div className="text-lg font-bold text-indigo-400 mb-6 px-2">⚙ RPA</div>
            {[
              { href: '/', label: '🏠 Dashboard' },
              { href: '/jobs', label: '🤖 Jobs' },
              { href: '/logs', label: '📋 Logs' },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg hover:bg-gray-800 text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </aside>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
