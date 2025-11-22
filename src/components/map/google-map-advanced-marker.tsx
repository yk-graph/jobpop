import Image from 'next/image'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { MapPin } from 'lucide-react'

import { type GetJobsResult } from '@/actions'
import { cn } from '@/lib/utils'

interface AdvancedMarkerProps {
  job: GetJobsResult
  hovered: boolean
  handleJobHover: (jobId: string, hovered: boolean) => void
}

export function GoogleMapAdvancedMarker({
  job: { id, lat, lng, title, thumbnailUrl },
  hovered,
  handleJobHover,
}: AdvancedMarkerProps) {
  return (
    <AdvancedMarker
      position={{ lat, lng }}
      onMouseEnter={() => handleJobHover(id, true)}
      onMouseLeave={() => handleJobHover(id, false)}
    >
      {/* ピンのUI */}
      <div
        className={cn(
          'relative h-8 w-8 max-w-8 min-w-8 bg-neutral-800 flex justify-center items-center origin-bottom transition-all duration-200 ease-in-out rounded-full p-1',
          hovered && 'w-20 max-w-20 min-w-20 h-20'
        )}
      >
        <div
          className={cn(
            'relative w-full h-full bg-center bg-cover rounded-full overflow-hidden flex justify-center items-center transition-opacity duration-200 ease-in-out',
            hovered && 'opacity-100 rounded-full'
          )}
        >
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className={cn(
              'object-cover transition-opacity duration-200 ease-in-out',
              !hovered && 'opacity-0',
              hovered && 'opacity-100'
            )}
          />
          <span
            className={cn(
              'absolute transition-opacity duration-200 ease-in-out',
              !hovered && 'opacity-100',
              hovered && 'opacity-0'
            )}
          >
            <MapPin size={16} className="text-white" />
          </span>
        </div>

        {/* Pinの先端部分のUI */}
        <div
          className={cn(
            'absolute bottom-0 w-0 h-0 z-[-1] left-1/2 transition-all duration-200 ease-in-out',
            'border-8 border-solid border-neutral-800 rounded-none rounded-br-xs translate-y-[22%] -translate-x-1/2 rotate-45',
            hovered && 'scale-120'
          )}
        />
      </div>
    </AdvancedMarker>
  )
}
