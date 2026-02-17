import { EmployeeRole } from '@jobpop/database'

/**
 * ロールの階層レベル
 * OWNER > ADMIN > MANAGER > STAFF
 */
const ROLE_LEVEL: Record<EmployeeRole, number> = {
  [EmployeeRole.OWNER]: 4,
  [EmployeeRole.ADMIN]: 3,
  [EmployeeRole.MANAGER]: 2,
  [EmployeeRole.STAFF]: 1,
}

/**
 * OWNERかどうかをチェック
 */
export const isOwner = (role: EmployeeRole | null): boolean => role === EmployeeRole.OWNER

/**
 * ADMIN以上（ADMIN, OWNER）かどうかをチェック
 */
export const isAdminOrAbove = (role: EmployeeRole | null): boolean =>
  !!role && ROLE_LEVEL[role] >= ROLE_LEVEL[EmployeeRole.ADMIN]

/**
 * MANAGER以上（MANAGER, ADMIN, OWNER）かどうかをチェック
 */
export const isManagerOrAbove = (role: EmployeeRole | null): boolean =>
  !!role && ROLE_LEVEL[role] >= ROLE_LEVEL[EmployeeRole.MANAGER]

/**
 * STAFF以上（全ロール）かどうかをチェック
 */
export const isStaffOrAbove = (role: EmployeeRole | null): boolean =>
  !!role && ROLE_LEVEL[role] >= ROLE_LEVEL[EmployeeRole.STAFF]
