export * from './countries'
export * from './visa-labels'
export * from './industries'
export * from './experiences'
export * from './soft-skills'

// Employment types
export const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
] as const

// expiration time
export const TOKEN_EXPIRES_IN = 24 * 60 * 60 * 1000 // 24時間
