import type { IndustryType } from '@prisma/client'

// 業界ラベル（英語表示、コメントで日本語説明）
export const INDUSTRY_LABELS: Record<IndustryType, string> = {
  FOOD: 'Food', // 飲食
  RETAIL: 'Retail', // 小売
  CORPORATE: 'Corporate', // 企業・オフィス
  TECH: 'Tech', // テック
  HOSPITALITY: 'Hospitality', // 宿泊・ホテル
  DELIVERY: 'Delivery', // 配送・デリバリー
  LOGISTICS: 'Logistics', // 物流・倉庫
  EDUCATION: 'Education', // 教育
  HEALTHCARE: 'Healthcare', // ヘルスケア・介護
  BEAUTY: 'Beauty', // 美容
  FITNESS: 'Fitness', // フィットネス
  MARKETING: 'Marketing', // マーケティング
  MEDIA: 'Media', // メディア・クリエイティブ
  ADMIN: 'Admin', // 総務・人事・事務
  FINANCE: 'Finance', // 経理・会計
} as const

export const INDUSTRIES = Object.keys(INDUSTRY_LABELS) as IndustryType[]