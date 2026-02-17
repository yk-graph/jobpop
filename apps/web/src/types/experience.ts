import type { IndustryType } from '@prisma/client'

// Combobox用の選択肢型
export interface ExperienceOption {
  value: string
  label: string
  industry?: IndustryType
}
