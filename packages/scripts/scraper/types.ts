import { JobType, SortBy, Fromage } from './utils'

export interface JobListing {
  id: string
  title: string
  company: string
  companyUrl?: string
  location: string
  salary?: string
  jobType?: string
  skills: string[]
  benefits: string[]
  shiftAndSchedule: string[]
  description: string
  url: string
}

export interface ScrapeOptions {
  query: string
  location: string
  pages?: number
  radius?: number
  sort?: SortBy
  fromage?: Fromage
  jobType?: JobType
}
