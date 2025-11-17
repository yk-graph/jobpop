import type { SoftSkill } from '@prisma/client'
import { SOFT_SKILLS, type SoftSkillData } from '@/constants/soft-skills'

/**
 * Get soft skill data by ID
 * @param id - The soft skill ID
 * @returns The soft skill data or undefined if not found
 */
export function getSoftSkillById(id: SoftSkill): SoftSkillData | undefined {
  return SOFT_SKILLS.find((skill) => skill.id === id)
}
