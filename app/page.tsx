import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Sparkles, Volume2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px] items-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center lg:items-center lg:text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                  AnimeticSerifu
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                  Learn fun, iconic anime-style Japanese lines and their English meanings. Perfect for anime fans who want to speak like their favorite characters!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Link href="/learn">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/top-image.png"
                alt="Anime-style hero illustration for Japanese learning app"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                Learn Japanese Like a True Anime Fan
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Our app makes learning Japanese fun and engaging with authentic phrases from anime.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-900/20">
                <Sparkles className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold">Authentic Phrases</h3>
              <p className="text-center text-muted-foreground">
                Learn real Japanese phrases used in popular anime shows.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                <Volume2 className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold">Audio Playback</h3>
              <p className="text-center text-muted-foreground">Listen to the correct pronunciation of each phrase.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-900/20">
                <BookOpen className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold">English Translations</h3>
              <p className="text-center text-muted-foreground">
                Understand the meaning with accurate English translations.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Link href="/learn">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
