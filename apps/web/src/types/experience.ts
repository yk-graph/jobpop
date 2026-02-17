import type { IndustryType } from '@jobpop/database'

// Combobox用の選択肢型
export interface ExperienceOption {
  value: string
  label: string
  industry?: IndustryType
}
