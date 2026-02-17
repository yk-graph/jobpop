import { getJobs, type GetJobsResult } from '@/actions'
import { convertJobsToGeoJSON } from '@/utils'
import MapTemplate from './_components/map-template'

export const dynamic = 'force-dynamic'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function MainPage() {
  const mapApiKey = process.env.PUBLIC_GOOGLE_MAPS_API_KEY

  if (!mapApiKey) {
    throw new Error('Google Maps API key is not defined')
  }

  let jobs: GetJobsResult[]
  try {
    jobs = await getJobs()
    await delay(2000)
  } catch (error) {
    console.error('Error in MainPage:', error)
    throw new Error('some error occurred in MainPage')
  }

  const geoJsonJobData = convertJobsToGeoJSON(jobs)

  return <MapTemplate data={geoJsonJobData} mapApiKey={mapApiKey} />
}
