import { EmployeeRole } from '@prisma/client'

import { auth } from '@/lib/better-auth/auth'

// Better Authから推論されるセッション型
type InferredSession = typeof auth.$Infer.Session

// セッションユーザー型（customSessionで追加したrolesを含む）
export type SessionUser = InferredSession['user'] & {
  roles: EmployeeRole[] | null
}

// セッション型
export type Session = {
  user: SessionUser
  session: InferredSession['session']
}
