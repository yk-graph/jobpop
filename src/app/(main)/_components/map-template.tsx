'use client'

import { useCallback, useState } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'

import { type GetJobsResult } from '@/actions'
import { ClusteredMarkers, PanToController } from '@/components/map'
import { JobsGeojson } from '@/utils'

const containerStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '1rem',
}

interface MapTemplateProps {
  data: JobsGeojson
  mapApiKey: string
}

export default function MapTemplate({ data, mapApiKey }: MapTemplateProps) {
  const [selectedJob, setSelectedJob] = useState<GetJobsResult | null>(null)
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null)

  const handleJobClick = useCallback(
    (jobId: string) => {
      if (!selectedJob || selectedJob.id !== jobId) {
        const feature = data.features.find((feature) => feature.id === jobId)
        const job = feature?.properties || null
        setSelectedJob(job)
      } else {
        setSelectedJob(null)
      }
    },
    [selectedJob, data.features]
  )

  const handleJobHover = useCallback((jobId: string, hovered: boolean) => {
    setHoveredJobId(hovered ? jobId : null)
  }, [])

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
        <ClusteredMarkers
          geojson={data}
          selectedJob={selectedJob}
          hoveredJobId={hoveredJobId}
          handleJobClick={handleJobClick}
          handleJobHover={handleJobHover}
        />
      </Map>
    </APIProvider>
  )
}
