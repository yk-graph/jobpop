// Tips: ライブラリの型拡張をするテクニック

import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'
import { EmployeeRole } from '@prisma/client'

// Session型の拡張
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isOauth: boolean
      isEmployer: boolean
      role: EmployeeRole | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    isOauth?: boolean
    isEmployer?: boolean
    role?: EmployeeRole | null
  }
}

// JWT型の拡張
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    isOauth?: boolean
    isEmployer?: boolean
    role?: EmployeeRole | null
  }
}
