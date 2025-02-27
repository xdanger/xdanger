// components/header.tsx
'use client'

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <header className="py-6">
      <div className="container max-w-3xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Yunjie Dai
        </Link>
        <ModeToggle />
      </div>
    </header>
  )
}