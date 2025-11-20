'use client'

import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">An error occurred</h2>

        {/* page.tsx からのエラーメッセージをそのまま表示 */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium whitespace-pre-wrap">{error.message}</p>
        </div>

        {/* 詳細なエラー情報（開発環境のみ表示） */}
        {process.env.NODE_ENV === 'development' && error.stack && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Stack trace</summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700">
              <pre className="whitespace-pre-wrap">{error.stack}</pre>
            </div>
          </details>
        )}

        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
