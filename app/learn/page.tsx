"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { animePhrases } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Volume2, Mic } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import * as wanakana from "wanakana"

// 関数外で定義
const EMPTY_ARRAY: number[] = [];

export default function LearnPage() {
  // localStorageで進捗・設定を保存
  const [currentPhraseIndex, setCurrentPhraseIndexRaw] = useLocalStorage<number>("currentPhraseIndex", 0)
  const [showRomaji, setShowRomaji] = useLocalStorage<boolean>("showRomaji", true)
  const [viewedPhrases, setViewedPhrases] = useLocalStorage<number[]>("viewedPhrases", EMPTY_ARRAY)
  const [progress, setProgress] = useState(0)
  const [selectedCategory, setSelectedCategoryRaw] = useLocalStorage<string>("selectedCategory", "Battle")
  const [recognizing, setRecognizing] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [similarity, setSimilarity] = useState<number|null>(null)
  const [recognitionError, setRecognitionError] = useState<string|null>(null)
  const [recognizingEn, setRecognizingEn] = useState(false)
  const [recognizedTextEn, setRecognizedTextEn] = useState("")
  const [similarityEn, setSimilarityEn] = useState<number|null>(null)
  const [recognitionErrorEn, setRecognitionErrorEn] = useState<string|null>(null)

  // カテゴリ一覧を取得
  const categories = Array.from(new Set(animePhrases.map(p => p.category)))
  // 選択中カテゴリのセリフ一覧
  const filteredPhrases = animePhrases.filter(p => p.category === selectedCategory)
  const currentPhrase = filteredPhrases[currentPhraseIndex] || filteredPhrases[0]

  // localStorage setterをラップしてカテゴリ切替時にインデックスもリセット
  const setSelectedCategory = (cat: string) => {
    setSelectedCategoryRaw(cat)
    setCurrentPhraseIndexRaw(0)
  }
  const setCurrentPhraseIndex = (idx: number) => {
    setCurrentPhraseIndexRaw(idx)
  }

  useEffect(() => {
    // カテゴリ切り替え時はインデックスをリセット（localStorage対応済み）
    // setCurrentPhraseIndex(0) はsetSelectedCategoryで実行
  }, [selectedCategory])

  useEffect(() => {
    if (!currentPhrase) return
    if (!viewedPhrases.includes(currentPhrase.id)) {
      setViewedPhrases((prev) => [...prev, currentPhrase.id])
    }
    setProgress((viewedPhrases.length / animePhrases.length) * 100)
  }, [currentPhrase?.id])

  const handleNextPhrase = () => {
    setCurrentPhraseIndex(currentPhraseIndex === filteredPhrases.length - 1 ? 0 : currentPhraseIndex + 1)
  }

  // 音声合成の品質向上
  const playAudio = () => {
    if (!currentPhrase) return
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // ひらがな変換
      const hiragana = wanakana.toHiragana(currentPhrase.romaji)
      // SSML対応（ただしWeb Speech APIは一部ブラウザのみ対応）
      const utter = new window.SpeechSynthesisUtterance(hiragana)
      utter.lang = "ja-JP"

      // 抑揚・速さの最適化
      let pitch = 1.15
      let rate = 1.0
      if (currentPhrase.japanese.includes("！")) {
        pitch = 1.35
        rate = 1.18
      } else if (currentPhrase.japanese.includes("？")) {
        pitch = 1.22
        rate = 1.12
      }
      switch (currentPhrase.category) {
        case "Battle":
          pitch += 0.12
          rate += 0.07
          break
        case "Romance/School":
          pitch += 0.06
          rate -= 0.04
          break
        case "Serious/Suspense":
          pitch -= 0.12
          rate -= 0.12
          break
        case "Gag/Comedy":
          pitch += 0.22
          rate += 0.12
          break
      }
      utter.pitch = pitch
      utter.rate = rate
      utter.volume = 1.0

      // 最も自然な日本語ボイスを選択（Google, Microsoft, Apple, "Takumi"など有名な高品質ボイス優先）
      const voices = window.speechSynthesis.getVoices()
      const preferredVoiceNames = [
        "Google 日本語", "Google Japanese", "Microsoft Nanami Online (Natural)", "Microsoft Haruka Online (Natural)", "Microsoft Ayumi Online (Natural)", "Takumi", "Kyoko", "Otoya", "Ichiro", "Sayaka"
      ]
      let bestVoice = voices.find(v => v.lang.startsWith("ja") && preferredVoiceNames.some(name => v.name.includes(name)))
      if (!bestVoice) {
        // 男性→女性→その他の順でfallback
        bestVoice = voices.find(v => v.lang.startsWith("ja") && /male|man|boy|otoko|Takumi|Otoya|Ichiro/i.test(v.name + v.voiceURI))
          || voices.find(v => v.lang.startsWith("ja") && /female|woman|girl|Haruka|Ayumi|Sayaka|Kyoko/i.test(v.name + v.voiceURI))
          || voices.find(v => v.lang.startsWith("ja"))
      }
      if (bestVoice) utter.voice = bestVoice

      window.speechSynthesis.speak(utter)
    } else {
      alert("このブラウザは音声合成に対応していません。")
    }
  }

  const playEnglishAudio = () => {
    if (!currentPhrase) return
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utter = new window.SpeechSynthesisUtterance(currentPhrase.english)
      utter.lang = "en-US"
      // 男性ボイスを優先的に選択
      const voices = window.speechSynthesis.getVoices()
      const maleVoice =
        voices.find(v => v.lang.startsWith("en") && /male|man|boy|john|david|matt|mike|alex|fred/i.test(v.name + v.voiceURI))
        || voices.find(v => v.lang.startsWith("en"))
      if (maleVoice) utter.voice = maleVoice
      window.speechSynthesis.speak(utter)
    } else {
      alert("This browser does not support speech synthesis.")
    }
  }

  // Levenshtein距離による類似度計算
  function calcSimilarity(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
    for (let i = 0; i <= a.length; i++) dp[i][0] = i
    for (let j = 0; j <= b.length; j++) dp[0][j] = j
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        )
      }
    }
    const maxLen = Math.max(a.length, b.length)
    return maxLen === 0 ? 1 : (1 - dp[a.length][b.length] / maxLen)
  }

  // 音声認識開始（日本語）
  const handleStartRecognition = () => {
    setRecognitionError(null)
    setRecognizedText("")
    setSimilarity(null)
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      setRecognitionError("このブラウザは音声認識に対応していません（Chrome推奨）")
      return
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "ja-JP"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    setRecognizing(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim()
      setRecognizedText(transcript)
      // ひらがな同士で比較
      const target = wanakana.toHiragana(currentPhrase.japanese.replace(/[^ -\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}a-zA-Z0-9]/gu, ""))
      const spoken = wanakana.toHiragana(transcript.replace(/[^ -\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}a-zA-Z0-9]/gu, ""))
      setSimilarity(calcSimilarity(target, spoken))
      setRecognizing(false)
    }
    recognition.onerror = (event: any) => {
      setRecognitionError("認識エラー: " + event.error)
      setRecognizing(false)
    }
    recognition.onend = () => {
      setRecognizing(false)
    }
    recognition.start()
  }

  // 音声認識開始（英語）
  const handleStartRecognitionEn = () => {
    setRecognitionErrorEn(null)
    setRecognizedTextEn("")
    setSimilarityEn(null)
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      setRecognitionErrorEn("This browser does not support speech recognition (Chrome recommended)")
      return
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    setRecognizingEn(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim()
      setRecognizedTextEn(transcript)
      // 英語は小文字・記号除去で比較
      const target = currentPhrase.english.toLowerCase().replace(/[^a-z0-9]/g, "")
      const spoken = transcript.toLowerCase().replace(/[^a-z0-9]/g, "")
      setSimilarityEn(calcSimilarity(target, spoken))
      setRecognizingEn(false)
    }
    recognition.onerror = (event: any) => {
      setRecognitionErrorEn("Recognition error: " + event.error)
      setRecognizingEn(false)
    }
    recognition.onend = () => {
      setRecognizingEn(false)
    }
    recognition.start()
  }

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-black">
      <div className="container max-w-2xl py-8 px-4 md:py-12 mx-auto">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="mb-8 space-y-2 text-center w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              Learn Japanese Phrases
            </h1>
            <p className="text-muted-foreground">
              Master authentic Japanese phrases from anime with audio playback and translations.
            </p>
          </div>

          {/* カテゴリタブ */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6 w-full flex flex-col items-center">
            <TabsList>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row md:items-stretch md:gap-8 md:justify-center w-full max-w-4xl mx-auto">
            {/* 使い方ガイド（PCのみ左側に表示） */}
            <aside className="hidden md:block w-72 shrink-0 h-full self-stretch flex flex-col justify-between md:mt-24 md:ml-0 md:relative md:left-[-128px]">
              <div className="bg-white/80 dark:bg-zinc-900/80 rounded-xl border border-pink-100 dark:border-pink-900/30 shadow p-6 text-sm text-gray-700 dark:text-gray-200 h-full flex flex-col justify-between">
                <h2 className="text-lg font-bold mb-2 text-pink-500">How to use</h2>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Listen to the phrase by clicking the <span className='inline-block align-middle'><Volume2 className='inline h-4 w-4' /></span> button.</li>
                  <li>Try speaking the phrase using the <span className='inline-block align-middle'><Mic className='inline h-4 w-4' /></span> mic button.</li>
                  <li>Check your pronunciation score and feedback.</li>
                  <li>Switch categories to learn different genres.</li>
                  <li>Track your progress at the top right.</li>
                  <li>Show or hide Romaji as you like.</li>
                </ol>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">* Works best in Google Chrome.<br/>* Your progress is saved automatically.</div>
              </div>
            </aside>
            <div className="flex-1 flex flex-col justify-stretch">
              <div className="flex justify-between items-center mb-4 w-full max-w-xl mx-auto">
                <div className="flex items-center space-x-2">
                  <Switch id="show-romaji" checked={showRomaji} onCheckedChange={setShowRomaji} />
                  <Label htmlFor="show-romaji">Show Romaji</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Progress: {Math.round(progress)}%</span>
                </div>
              </div>

              <Progress value={progress} className="mb-8 w-full max-w-xl mx-auto" />

              <Card className="mb-8 border-2 border-pink-200 dark:border-pink-900/30 shadow-lg w-full max-w-6xl min-h-[300px] min-w-[900px] mx-auto">
                <CardContent className="p-6 md:p-8">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        Japanese
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={playAudio}
                          className="text-pink-500 hover:text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/20"
                        >
                          <Volume2 className="h-8 w-8" />
                          <span className="sr-only">Play audio</span>
                        </Button>
                        {/* マイクアイコン 丸形・大きめ */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleStartRecognition}
                          disabled={recognizing}
                          className={"relative text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"}
                        >
                          {/* 録音中アニメーション */}
                          {recognizing && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="block h-12 w-12 rounded-full border-2 border-green-400 animate-ping opacity-60"></span>
                            </span>
                          )}
                          <Mic className="h-8 w-8 relative z-10" />
                          <span className="sr-only">Record your voice</span>
                        </Button>
                      </span>
                      <p className="text-4xl font-bold tracking-tighter truncate whitespace-nowrap">{currentPhrase?.japanese}</p>
                    </div>

                    {showRomaji && currentPhrase && (
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Romaji</span>
                        <p className="text-xl">{currentPhrase.romaji}</p>
                      </div>
                    )}

                    <div className="space-y-2 pt-4 border-t">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        English Translation
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={playEnglishAudio}
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        >
                          <Volume2 className="h-8 w-8" />
                          <span className="sr-only">Play English audio</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleStartRecognitionEn}
                          disabled={recognizingEn}
                          className={"relative text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"}
                        >
                          {/* 録音中アニメーション */}
                          {recognizingEn && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="block h-12 w-12 rounded-full border-2 border-green-400 animate-ping opacity-60"></span>
                            </span>
                          )}
                          <Mic className="h-8 w-8 relative z-10" />
                          <span className="sr-only">Record your English voice</span>
                        </Button>
                      </span>
                      <p className="text-xl font-medium">{currentPhrase?.english}</p>
                      {/* 音声認識結果とフィードバック（英語） */}
                      {recognizedTextEn && (
                        <div className="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20">
                          <div className="text-sm text-green-700 dark:text-green-200">Your pronunciation: {recognizedTextEn}</div>
                          {similarityEn !== null && (
                            <div className="text-sm">
                              Similarity: <span className="font-bold">{Math.round(similarityEn * 100)}%</span>
                              {similarityEn > 0.85 ? " (Perfect!)" : similarityEn > 0.6 ? " (Almost!)" : " (Keep practicing!)"}
                            </div>
                          )}
                        </div>
                      )}
                      {recognitionErrorEn && (
                        <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 text-sm">
                          {recognitionErrorEn}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground pt-4 border-t">
                      <p>From: {currentPhrase?.anime}</p>
                    </div>
                
                    {/* 音声認識結果とフィードバック（日本語） */}
                    {recognizedText && (
                      <div className="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20">
                        <div className="text-sm text-green-700 dark:text-green-200">あなたの発音: {recognizedText}</div>
                        {similarity !== null && (
                          <div className="text-sm">
                            一致度: <span className="font-bold">{Math.round(similarity * 100)}%</span>
                            {similarity > 0.85 ? "（ほぼ完璧！）" : similarity > 0.6 ? "（もう少し！）" : "（練習しよう！）"}
                          </div>
                        )}
                      </div>
                    )}
                    {recognitionError && (
                      <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 text-sm">
                        {recognitionError}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center w-full">
                <Button
                  onClick={handleNextPhrase}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Next Phrase
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
