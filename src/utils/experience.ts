import type { IndustryType } from '@prisma/client'
import { INDUSTRY_EXPERIENCES, INDUSTRY_LABELS } from '@/constants'
import type { ExperienceOption } from '@/types'
import type { ExperienceTypeData } from '@/constants/experiences'

/**
 * 指定された業界の経験リストを取得
 * @param industry 業界タイプ
 * @returns 経験の配列
 */
export function getExperiencesByIndustry(industry: IndustryType): ExperienceTypeData[] {
  return INDUSTRY_EXPERIENCES[industry] || []
}

/**
 * 指定された業界の経験をCombobox用の選択肢に変換
 * @param industry 業界タイプ
 * @returns Combobox用の選択肢配列
 */
export function getExperienceOptions(industry: IndustryType): ExperienceOption[] {
  const experiences = getExperiencesByIndustry(industry)
  
  return experiences.map((experience) => ({
    value: experience.id,
    label: experience.title,
    industry: experience.industry,
  }))
}

/**
 * 全ての業界の経験をCombobox用の選択肢に変換
 * @returns Combobox用の選択肢配列（業界グループ化）
 */
export function getAllExperienceOptions(): ExperienceOption[] {
  const allOptions: ExperienceOption[] = []
  
  Object.values(INDUSTRY_EXPERIENCES).forEach((experiences) => {
    experiences.forEach((experience) => {
      allOptions.push({
        value: experience.id,
        label: experience.title,
        industry: experience.industry,
      })
    })
  })
  
  return allOptions
}

/**
 * 業界ラベルを取得
 * @param industry 業界タイプ
 * @returns 業界ラベル
 */
export function getIndustryLabel(industry: IndustryType): string {
  return INDUSTRY_LABELS[industry]
}

/**
 * 全業界のCombobox用選択肢を生成
 * @returns 業界のCombobox用選択肢配列
 */
export function getIndustryOptions() {
  return Object.entries(INDUSTRY_LABELS).map(([key, label]) => ({
    value: key,
    label: label,
  }))
}

/**
 * 経験IDから経験情報を取得
 * @param experienceId 経験ID
 * @returns 経験情報（見つからない場合はundefined）
 */
export function getExperienceById(experienceId: string): ExperienceTypeData | undefined {
  for (const experiences of Object.values(INDUSTRY_EXPERIENCES)) {
    const found = experiences.find(exp => exp.id === experienceId)
    if (found) return found
  }
  return undefined
}

/**
 * 経験IDから業界を特定
 * @param experienceId 経験ID
 * @returns 業界タイプ（見つからない場合はundefined）
 */
export function getIndustryByExperienceId(experienceId: string): IndustryType | undefined {
  const experience = getExperienceById(experienceId)
  return experience?.industry
}