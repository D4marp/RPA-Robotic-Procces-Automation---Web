'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/jobs', label: 'Robots (Jobs)', icon: '🤖' },
    { href: '/logs', label: 'Execution Logs', icon: '📋' },
  ]

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-gray-950/80 backdrop-blur-md border-b border-gray-900 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-xl bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-extrabold tracking-tight">⚙ RPA.io</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none p-1.5 rounded-lg bg-gray-900/40 border border-gray-800/60"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-950/90 backdrop-blur-lg border-b border-gray-900 p-4 flex flex-col gap-2.5 sticky top-[51px] z-40">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-white border-l-3 border-indigo-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }`}
              >
                <span className="mr-3">{l.icon}</span> {l.label}
              </Link>
            )
          })}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-68 bg-gray-950/60 backdrop-blur-lg border-r border-gray-900/80 p-5 flex-col gap-2 min-h-screen">
        <div className="mb-10 px-2 py-4 border-b border-gray-900/60">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <span className="font-extrabold text-sm">R</span>
            </div>
            <div>
              <div className="text-base font-extrabold tracking-wide text-white">RPA CONTROL</div>
              <div className="text-xxs text-indigo-400 font-semibold tracking-wider uppercase">Runner Dashboard</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-white border-l-3 border-indigo-500 font-semibold shadow-inner shadow-indigo-900/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/30 hover:translate-x-0.5'
                }`}
              >
                <span className="mr-3.5 text-base">{l.icon}</span>
                {l.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-900/60 px-2">
          <div className="text-xxs text-gray-500 font-medium">System Version: v1.0.0</div>
        </div>
      </aside>
    </>
  )
}
