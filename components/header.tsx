// components/header.tsx
'use client'

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免水合不匹配
  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="py-6">
      <div className="container max-w-3xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Yunjie Dai
        </Link>
        {mounted && (
          <button
            onClick={toggleTheme}
            className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer hover:opacity-80"
            aria-label="ThemeMode-Toggle"
          >
            <div
              className={`absolute w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                } top-0.5`}
            />
          </button>
        )}
      </div>
    </header>
  )
}