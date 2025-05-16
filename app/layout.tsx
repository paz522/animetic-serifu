import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AnimeticSerifu - Learn Japanese through Anime",
  description: "Learn Japanese phrases from your favorite anime shows!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AnimeticSerifu</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <footer className="py-4 text-center text-sm text-muted-foreground border-t">
              <p>© {new Date().getFullYear()} AnimeSpeak - Learn Japanese through Anime</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
