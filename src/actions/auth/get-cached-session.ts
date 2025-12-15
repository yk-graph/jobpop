/*　Tips: React の cache() 関数について
  - cache() は「Request Memoization（リクエスト単位のメモ化）」を提供する関数
  - 仕組み：
    1. cache() で関数をラップすると、その関数の戻り値が「同一HTTPリクエスト内」でキャッシュされる
    2. 同じ引数で複数回呼ばれた場合、2回目以降は関数を実行せずキャッシュから結果を返す
    3. 新しいHTTPリクエストが来ると、キャッシュはリセットされる（前のリクエストのキャッシュは使われない）
  - セキュリティ：リクエストごとにキャッシュが分離されるため、異なるユーザー間でセッション情報が漏れることはない
  - 効果：同一リクエスト内で auth() が複数回呼ばれても、DBクエリは1回のみ実行される
  - 注意：auth() は内部で headers/cookies を使用するため 'use cache' は使えない。代わりに React の cache() を使用する
*/
import { cache } from 'react'

import { auth } from '@/lib/auth'

export const getCachedSession = cache(async () => {
  return await auth()
})
