'use client'

import { useState } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'

import { type GetJobsResult } from '@/actions'
import { GoogleMapAdvancedMarker, PanToController } from '@/components/map'

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
  const [selectedJob, setSelectedJob] = useState<GetJobsResult | null>(null)
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null)

  const handleJobClick = (jobId: string) => {
    if (!selectedJob || selectedJob.id !== jobId) {
      const job = jobs.find((job) => job.id === jobId) || null
      setSelectedJob(job)
    } else {
      setSelectedJob(null)
    }
  }

  const handleJobHover = (jobId: string, hovered: boolean) => {
    setHoveredJobId(hovered ? jobId : null)
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
        <PanToController target={selectedJob ? { lat: selectedJob.lat, lng: selectedJob.lng } : null} />
        {jobs.map((job) => {
          return (
            <GoogleMapAdvancedMarker
              key={job.id}
              job={job}
              clicked={selectedJob?.id === job.id}
              hovered={hoveredJobId === job.id}
              handleJobClick={handleJobClick}
              handleJobHover={handleJobHover}
            />
          )
        })}
      </Map>
    </APIProvider>
  )
}
