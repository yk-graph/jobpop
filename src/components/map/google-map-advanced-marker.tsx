import Image from 'next/image'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { X, MapPin, Clock, DollarSign } from 'lucide-react'

import { type GetJobsResult } from '@/actions'
import { cn } from '@/lib/utils'

interface AdvancedMarkerProps {
  job: GetJobsResult
  clicked: boolean
  hovered: boolean
  handleJobClick: (jobId: string) => void
  handleJobHover: (jobId: string, hovered: boolean) => void
}

export function GoogleMapAdvancedMarker({
  job: { id, lat, lng, title, name, salary, employmentType, description, thumbnailUrl },
  clicked,
  hovered,
  handleJobClick,
  handleJobHover,
}: AdvancedMarkerProps) {
  return (
    <AdvancedMarker
      position={{ lat, lng }}
      onMouseEnter={() => handleJobHover(id, true)}
      onMouseLeave={() => handleJobHover(id, false)}
      onClick={() => handleJobClick(id)}
      zIndex={clicked ? 20 : hovered ? 10 : 0}
      className={cn(
        'relative h-8 w-8 bg-neutral-800 flex justify-center items-center transition-all duration-200 ease-in-out rounded-full p-1',
        hovered && 'w-20 h-20',
        clicked && 'rounded-lg w-fit min-w-auto max-w-lg h-80 p-2'
      )}
    >
      {/* ピンのUI */}
      <div
        className={cn(
          'relative w-full h-full bg-center bg-cover rounded-full overflow-hidden flex justify-center items-center transition-opacity duration-200 ease-in-out',
          hovered && 'opacity-100 rounded-full',
          clicked && 'rounded-none rounded-l-sm'
        )}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className={cn(
            'object-cover transition-opacity duration-200 ease-in-out',
            !hovered && !clicked && 'opacity-0',
            (hovered || clicked) && 'opacity-100'
          )}
        />
        <span
          className={cn(
            'absolute transition-opacity duration-200 ease-in-out',
            !hovered && !clicked && 'opacity-100',
            (hovered || clicked) && 'opacity-0'
          )}
        >
          <MapPin size={16} className="text-white" />
        </span>
      </div>

      {/* 情報ウィンドウのUI */}
      <div
        className={cn(
          'max-w-0 opacity-0 invisible overflow-hidden transition-all duration-200 ease-in-out',
          !clicked && 'hidden',
          clicked && 'max-w-[380px] opacity-100 visible flex animate-[slideInFadeIn_0.7s_ease-in-out]'
        )}
      >
        <button
          className={cn(
            'absolute top-2 right-2 p-2 text-neutral-800 border-none bg-none cursor-pointer',
            !clicked && 'hidden',
            clicked && 'flex'
          )}
          onClick={(e) => {
            e.stopPropagation()
            handleJobClick(id)
          }}
        >
          <X size={24} />
        </button>

        <div className="p-6 text-white">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <p className="text-green-200 text-sm">{name}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-green-300" />
              <span className="text-sm font-semibold">{salary}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-green-300" />
              <span className="text-sm">{employmentType}</span>
            </div>
          </div>

          <p className="text-green-100 text-sm leading-relaxed mb-4">{description}</p>

          <button
            onClick={(e) => e.stopPropagation()}
            className="w-full mt-4 bg-white text-green-700 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Pinの先端部分のUI */}
      <div
        className={cn(
          'absolute bottom-0 w-0 h-0 -z-10 left-1/2 transition-all duration-200 ease-in-out border-8 border-neutral-800 translate-y-[22%] -translate-x-1/2 rotate-45',
          (hovered || clicked) && 'scale-120'
        )}
      />
    </AdvancedMarker>
  )
}
