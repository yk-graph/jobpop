import { VisaType } from '@prisma/client'

export const VISA_LABELS = {
  [VisaType.VISITOR]: 'Visitor / Tourist',
  [VisaType.WORK_PERMIT]: 'Work Permit',
  [VisaType.STUDY_PERMIT]: 'Study Permit',
  [VisaType.WORK_HOLIDAY]: 'Working Holiday',
  [VisaType.PERMANENT_RESIDENT]: 'Permanent Resident',
  [VisaType.FAMILY_SPONSORSHIP]: 'Family Sponsorship',
  [VisaType.OTHER]: 'Other',
} as const
