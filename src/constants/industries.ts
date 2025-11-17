import type { IndustryType } from '@prisma/client'
import type { LucideIcon } from 'lucide-react'

import {
  Utensils, // FOOD
  ShoppingCart, // RETAIL
  Building2, // HOSPITALITY
  Heart, // HEALTHCARE
  Scissors, // BEAUTY
  Truck, // DELIVERY
  Dumbbell, // FITNESS
  Package, // LOGISTICS
  GraduationCap, // EDUCATION
  Briefcase, // CORPORATE
  FileText, // ADMIN
  Coins, // FINANCE
  Code, // TECH
  ChartSpline, // MARKETING
  Camera, // MEDIA
} from 'lucide-react'

// 業界ラベル（英語表示、コメントで日本語説明）
// experiencesの順序に合わせて並び替え済み
export const INDUSTRY_LABELS: Record<IndustryType, string> = {
  FOOD: 'Food', // 飲食
  RETAIL: 'Retail', // 小売
  HOSPITALITY: 'Hospitality', // 宿泊・ホテル
  HEALTHCARE: 'Healthcare', // ヘルスケア・介護
  BEAUTY: 'Beauty', // 美容
  DELIVERY: 'Delivery', // 配送・デリバリー
  FITNESS: 'Fitness', // フィットネス
  LOGISTICS: 'Logistics', // 物流・倉庫
  EDUCATION: 'Education', // 教育
  CORPORATE: 'Corporate', // 企業・オフィス
  ADMIN: 'Admin', // 総務・人事・事務
  FINANCE: 'Finance', // 経理・会計
  TECH: 'Tech', // テック
  MARKETING: 'Marketing', // マーケティング
  MEDIA: 'Media', // メディア・クリエイティブ
} as const

// 業界アイコンマッピング
export const INDUSTRY_ICONS: Record<IndustryType, LucideIcon> = {
  FOOD: Utensils, // 飲食
  RETAIL: ShoppingCart, // 小売
  HOSPITALITY: Building2, // 宿泊・ホテル
  HEALTHCARE: Heart, // ヘルスケア・介護
  BEAUTY: Scissors, // 美容
  DELIVERY: Truck, // 配送・デリバリー
  FITNESS: Dumbbell, // フィットネス
  LOGISTICS: Package, // 物流・倉庫
  EDUCATION: GraduationCap, // 教育
  CORPORATE: Briefcase, // 企業・オフィス
  ADMIN: FileText, // 総務・人事・事務
  FINANCE: Coins, // 経理・会計
  TECH: Code, // テック
  MARKETING: ChartSpline, // マーケティング
  MEDIA: Camera, // メディア・クリエイティブ
}

export const INDUSTRIES = Object.keys(INDUSTRY_LABELS) as IndustryType[]