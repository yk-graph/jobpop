'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2>地図の読み込みに失敗しました</h2>
        <p className="mt-4 text-red-600">{error.message}</p>
        <button onClick={reset}>再試行</button>
      </div>
    </div>
  )
}
