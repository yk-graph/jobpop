import type { SoftSkill } from '@prisma/client'

export interface SoftSkillData {
  id: SoftSkill
  title: string
  description: string
}

export const SOFT_SKILLS: SoftSkillData[] = [
  {
    id: 'DIGITAL_COMMUNICATION_FLUENCY', // デジタルコミュニケーション能力
    title: 'Digital Communication Fluency',
    description:
      'Ability to communicate effectively across digital platforms, including email, social media, and online meeting tools.', // Eメール、SNS、オンライン会議など複数のデジタル媒体を使い分け、状況に合ったコミュニケーションができる能力。
  },
  {
    id: 'LEARNING_AGILITY', // 学習機敏性
    title: 'Learning Agility',
    description:
      'Capacity to quickly learn new skills or technologies, adapt to change, and unlearn outdated methods when needed.', // 新しい知識や技術を素早く習得し、変化に適応し、古い方法を手放す柔軟性を持つ能力。
  },
  {
    id: 'CULTURAL_INTELLIGENCE', // 文化的知性
    title: 'Cultural Intelligence',
    description:
      'Ability to work effectively with people from diverse cultural backgrounds through understanding, empathy, and adaptation.', // 多文化背景を理解し、共感し、適応することで、異文化環境で効果的に協働できる能力。
  },
  {
    id: 'EMOTIONAL_RESILIENCE', // 感情的回復力
    title: 'Emotional Resilience',
    description:
      'Ability to stay calm, recover quickly, and remain productive when facing stress, setbacks, or difficult situations.', // ストレスや困難な状況でも落ち着きを保ち、素早く立て直して前向きに行動できる精神的な強さ。
  },
  {
    id: 'ATTENTION_SWITCHING', // 注意切り替え能力
    title: 'Attention Switching',
    description:
      'Skill to shift focus between tasks efficiently, prioritizing what matters and managing multiple demands in fast-paced settings.', // 重要度を判断しながら複数タスクの注意を切り替え、スピードの速い環境でも効率的に対応する能力。
  },
  {
    id: 'TECHNO_EMOTIONAL_BALANCE', // テクノ感情バランス
    title: 'Techno-Emotional Balance',
    description:
      'Ability to use technology effectively without overdependence, balancing AI tools with human judgment and creativity.', // テクノロジーに過度に依存せず、人間的な判断や創造性とバランスを取りながら活用できる能力。
  },
  {
    id: 'COLLABORATIVE_CREATIVITY', // 協働的創造力
    title: 'Collaborative Creativity',
    description:
      'Ability to co-create ideas with others, combining perspectives to produce solutions better than individual work alone.', // 他者と協力して創造し、個人では出せない質の高いアイデアや成果を生み出す協働的創造力。
  },
] as const

