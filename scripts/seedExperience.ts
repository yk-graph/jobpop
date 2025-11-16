#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'
import { INDUSTRY_EXPERIENCES } from '../src/constants/experiences'

const prisma = new PrismaClient()

async function seedExperienceTypes() {
  console.log('🌱 Starting experience types seeding...')

  try {
    // 既存のUserExperienceレコードを確認
    const existingUserExperiences = await prisma.userExperience.count()

    if (existingUserExperiences > 0) {
      console.log(`⚠️  Warning: ${existingUserExperiences} user experiences exist. This operation will preserve them.`)
    }

    // 既存の経験タイプを削除（ユーザーデータがある場合はスキップ）
    if (existingUserExperiences === 0) {
      console.log('🗑️  Deleting existing experience types...')
      await prisma.mstExperienceType.deleteMany({})
    } else {
      console.log('🔄 Updating existing experience types...')
    }

    // 新しいデータを準備
    const seedData = []
    for (const experiences of Object.values(INDUSTRY_EXPERIENCES)) {
      for (const experience of experiences) {
        seedData.push({
          id: experience.id,
          industry: experience.industry,
          title: experience.title,
        })
      }
    }

    console.log(`📝 Prepared ${seedData.length} experience types for seeding`)

    // データを挿入（upsertを使用して重複を回避）
    let insertedCount = 0
    let updatedCount = 0

    for (const data of seedData) {
      await prisma.mstExperienceType.upsert({
        where: { id: data.id },
        update: {
          industry: data.industry,
          title: data.title,
        },
        create: data,
      })

      // 新規作成か更新かを判定（簡易的な判定）
      const existing = await prisma.mstExperienceType.findFirst({
        where: {
          id: data.id,
          industry: data.industry,
          title: data.title,
        },
      })

      if (existing) {
        insertedCount++
      } else {
        updatedCount++
      }
    }

    // 結果レポート
    console.log('\n✅ Experience types seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   • Total processed: ${seedData.length}`)
    console.log(`   • Inserted/Updated: ${insertedCount}`)
    console.log(`   • Updated: ${updatedCount}`)
    console.log('\n🏭 Industry breakdown:')

    for (const [industry, experiences] of Object.entries(INDUSTRY_EXPERIENCES)) {
      console.log(`   • ${industry}: ${experiences.length} experiences`)
    }

    // 最終確認
    const totalCount = await prisma.mstExperienceType.count()
    console.log(`\n📈 Total experience types in database: ${totalCount}`)
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  }
}

// スクリプトを直接実行された場合のみ実行
if (require.main === module) {
  seedExperienceTypes()
    .then(() => {
      console.log('🎉 Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedExperienceTypes }
