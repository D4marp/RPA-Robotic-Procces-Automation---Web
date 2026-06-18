'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: '🏠 Dashboard' },
    { href: '/jobs', label: '🤖 Jobs' },
    { href: '/logs', label: '📋 Logs' },
  ]

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="text-lg font-bold text-indigo-400">⚙ RPA</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white focus:outline-none p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex flex-col gap-2 sticky top-[53px] z-40">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? 'bg-indigo-650 text-white font-medium' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-900 border-r border-gray-800 p-4 flex-col gap-1 min-h-screen">
        <div className="text-xl font-bold text-indigo-400 mb-8 px-2 flex items-center gap-2">
          <span>⚙</span> RPA Dashboard
        </div>
        {links.map(l => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                active ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/30' : 'hover:bg-gray-850 text-gray-350 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          )
        })}
      </aside>
    </>
  )
}
