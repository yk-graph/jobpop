'use client'

import { useState } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'

import { type GetJobsResult } from '@/actions'
import { GoogleMapAdvancedMarker } from '@/components/map'

const containerStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '1rem',
}

interface MapTemplateProps {
  jobs: GetJobsResult[]
  mapApiKey: string
}

export default function MapTemplate({ jobs, mapApiKey }: MapTemplateProps) {
  const [hoveredJob, setHoveredJob] = useState<string | null>(null)

  const handleJobHover = (jobId: string, hovered: boolean) => {
    setHoveredJob(hovered ? jobId : null)
  }

  return (
    <APIProvider apiKey={mapApiKey}>
      <Map
        style={containerStyle}
        defaultCenter={{ lat: 49.2836161, lng: -123.1148462 }}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
        mapId="JOBPOP_MAP_ID"
      >
        {jobs.map((job) => {
          return (
            <GoogleMapAdvancedMarker
              key={job.id}
              job={job}
              hovered={hoveredJob === job.id}
              handleJobHover={handleJobHover}
            />
          )
        })}
      </Map>
    </APIProvider>
  )
}
