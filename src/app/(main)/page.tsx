import { getJobs, type GetJobsResult } from '@/actions'
import MapTemplate from './_components/map-template'

export default async function MainPage() {
  const jobs: GetJobsResult[] = await getJobs()

  return <MapTemplate jobs={jobs} />
}
