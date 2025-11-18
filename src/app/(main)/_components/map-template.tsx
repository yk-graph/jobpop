'use client'

import { useState } from 'react'
import Image from 'next/image'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { X, MapPin, Clock, DollarSign } from 'lucide-react'

import { type GetJobsResult } from '@/actions'

// classNames utility function
function classNames(...classes: (string | undefined | boolean | { [key: string]: boolean })[]): string {
  return classes
    .flatMap((cls) => {
      if (typeof cls === 'string') return cls
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
      }
      return []
    })
    .filter(Boolean)
    .join(' ')
}

const containerStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '1rem',
}

export default function MapTemplate({ jobs }: { jobs: GetJobsResult[] }) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [hoveredJob, setHoveredJob] = useState<string | null>(null)

  const handleJobClick = (jobId: string) => {
    setSelectedJob(selectedJob === jobId ? null : jobId)
  }

  const handleJobHover = (jobId: string, hovered: boolean) => {
    setHoveredJob(hovered ? jobId : null)
  }

  return (
    <div className="advanced-marker-example h-full w-full">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          style={containerStyle}
          defaultCenter={{ lat: 49.2836161, lng: -123.1148462 }}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI
          mapId="DEMO_MAP_ID"
        >
          {jobs.map((job) => {
            const clicked = selectedJob === job.id
            const hovered = hoveredJob === job.id

            return (
              <AdvancedMarker
                key={job.id}
                position={{ lat: job.lat, lng: job.lng }}
                onMouseEnter={() => handleJobHover(job.id, true)}
                onMouseLeave={() => handleJobHover(job.id, false)}
                onClick={() => handleJobClick(job.id)}
                className={classNames('real-estate-marker', { clicked, hovered })}
              >
                <>
                  <div className="custom-pin">
                    <div className="image-container">
                      <Image src={job.thumbnailUrl} alt={job.title} fill className="object-cover" />
                      <span className="icon">
                        <MapPin size={16} className="text-white" />
                      </span>
                    </div>

                    <div className="details-container">
                      <button
                        className="close-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleJobClick(job.id)
                        }}
                      >
                        <X size={24} />
                      </button>

                      <div className="p-6 text-white">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                          <p className="text-green-200 text-sm">{job.name}</p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-green-300" />
                            <span className="text-sm font-semibold">{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-green-300" />
                            <span className="text-sm">{job.employmentType}</span>
                          </div>
                        </div>

                        <p className="text-green-100 text-sm leading-relaxed mb-4">{job.description}</p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Apply logic here
                          }}
                          className="w-full mt-4 bg-white text-green-700 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="tip" />
                </>
              </AdvancedMarker>
            )
          })}
        </Map>
      </APIProvider>
    </div>
  )
}
