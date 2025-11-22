import { getJobs, type GetJobsResult } from '@/actions'
import MapTemplate from './_components/map-template'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function MainPage() {
  const mapApiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!mapApiKey) {
    throw new Error('Google Maps API key is not defined')
  }

  try {
    const jobs: GetJobsResult[] = await getJobs()
    await delay(2000)

    return <MapTemplate jobs={jobs} mapApiKey={mapApiKey} />
  } catch (error) {
    console.error('Error in MainPage:', error)
    throw new Error('some error occurred in MainPage')
  }
}
