'use client'

// エラーメッセージからコードを抽出する関数
function extractErrorCode(errorMessage: string): string | null {
  const codeMatch = errorMessage.match(/code:\s*(.+)/)
  return codeMatch ? codeMatch[1].trim() : null
}

// エラーコードに基づいてメッセージを決定する関数
function getErrorInfo(error: Error) {
  const errorCode = extractErrorCode(error.message)

  // page.tsx からのカスタムエラーコード
  switch (errorCode) {
    case 'MAIN_PAGE_ERROR':
      return {
        title: 'エラーが発生しました',
        description: 'ページの読み込み中に問題が発生しました。',
        icon: '❌',
        code: errorCode,
      }
  }

  // その他のエラー（フォールバック）
  return {
    title: 'エラーが発生しました',
    description: 'ページの読み込み中に問題が発生しました。',
    icon: '❌',
    code: errorCode || 'UNKNOWN',
  }
}

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const errorInfo = getErrorInfo(error)

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">{errorInfo.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h2>
        <p className="text-gray-600 mb-4">{errorInfo.description}</p>

        {/* エラーコードを常に表示 */}
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">エラーコード:</p>
          <p className="font-mono text-sm text-red-600 font-semibold">{errorInfo.code}</p>
        </div>

        {/* 詳細なエラーメッセージ（開発環境のみ表示） */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">技術的な詳細</summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700">
              {error.message}
              {error.stack && <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>}
            </div>
          </details>
        )}

        <button
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          再試行
        </button>
      </div>
    </div>
  )
}
