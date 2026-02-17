'use server'

import { Job, JobStatus, MstExperienceType, Store } from '@jobpop/database'

import { prisma } from '@/lib/prisma'
import { handleServerError } from '@/utils'

export type GetJobsResult = Job & {
  experience: MstExperienceType
  store: Store
}

export async function getJobs(): Promise<GetJobsResult[]> {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: JobStatus.PUBLISHED }, // 公開中の求人のみを取得
      include: {
        experience: true,
        store: true,
      },
    })
    return jobs
  } catch (error) {
    throw handleServerError(error, 'getJobs')
  }
}
