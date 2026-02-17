import { VisaType } from '@jobpop/database'

export const VISA_LABELS: Record<VisaType, string> = {
  [VisaType.WORK_HOLIDAY]: 'Working Holiday',
  [VisaType.STUDY_PERMIT]: 'Study Permit',
  [VisaType.COOP_STUDY]: 'Co-op Study Permit',
  [VisaType.PGWP]: 'Post-Graduate Work Permit (PGWP)',
  [VisaType.WORK_PERMIT]: 'Work Permit',
  [VisaType.PERMANENT_RESIDENT]: 'Permanent Resident',
  [VisaType.CITIZEN]: 'Canadian Citizen',
  [VisaType.OTHER]: 'Other',
}
