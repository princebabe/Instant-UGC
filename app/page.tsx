import AdGenerator from '@/components/AdGenerator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Instant<span className="text-purple-400">UGC</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Transform your ideas into viral video ads in seconds
          </p>
        </header>
        <AdGenerator />
      </div>
    </main>
  )
}
