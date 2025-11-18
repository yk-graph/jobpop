'use server'

import { Job, MstExperienceType } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export type GetJobsResult = Job & {
  experience: MstExperienceType
}

export async function getJobs(): Promise<GetJobsResult[]> {
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      include: { experience: true },
    })
    return jobs
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw new Error('fait to fetch')
  }
}
