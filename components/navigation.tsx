"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, BookOpen } from "lucide-react"
import { Mochiy_Pop_One } from "next/font/google"

const mochiyPop = Mochiy_Pop_One({ weight: "400", subsets: ["latin"] })

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-8 flex pl-2">
          <Link href="/" className="flex flex-row items-center">
            <span
              className={
                mochiyPop.className +
                " text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text tracking-widest drop-shadow-sm"
              }
              style={{ letterSpacing: "0.08em" }}
            >
              AnimeticSerifu
            </span>
            <span className="ml-3 text-xs md:text-sm text-pink-500 font-semibold tracking-wide drop-shadow-sm align-middle relative" style={{ fontSize: '0.85em', top: '0.5em' }}>
              ~Learn Japanese with Anime-like Phrases~
            </span>
          </Link>
        </div>
        <nav className="flex items-center space-x-2 ml-auto">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant={pathname === "/learn" ? "default" : "ghost"} size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
