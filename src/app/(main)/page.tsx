'use client'

import { useState } from 'react'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { X, MapPin, Clock, DollarSign, Building } from 'lucide-react'

const containerStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '1rem',
}

// バンクーバー周辺の20個のダミー求人情報
const jobs = [
  { 
    id: 1, 
    position: { lat: 49.2827, lng: -123.1207 }, 
    title: 'Barista', 
    company: 'Downtown Cafe', 
    salary: '$18/hour',
    type: 'Part-time',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=150&fit=crop&crop=center',
    description: 'Join our team as a friendly barista! Make amazing coffee and provide excellent customer service.',
    requirements: ['Customer service experience', 'Coffee knowledge preferred', 'Flexible schedule']
  },
  { 
    id: 2, 
    position: { lat: 49.2845, lng: -123.1089 }, 
    title: 'Server', 
    company: 'Seaside Restaurant', 
    salary: '$16/hour + tips',
    type: 'Full-time',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop&crop=center',
    description: 'Looking for experienced servers to join our waterfront restaurant team.',
    requirements: ['Restaurant experience', 'Team player', 'Weekend availability']
  },
  { 
    id: 3, 
    position: { lat: 49.2800, lng: -123.1200 }, 
    title: 'Retail Assistant', 
    company: 'City Mall', 
    salary: '$17/hour',
    type: 'Part-time',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop&crop=center',
    description: 'Help customers find what they need and maintain store appearance.',
    requirements: ['Sales experience', 'Friendly personality', 'Bilingual preferred']
  },
  { 
    id: 4, 
    position: { lat: 49.2890, lng: -123.1100 }, 
    title: 'Kitchen Helper', 
    company: 'Food Court', 
    salary: '$16.50/hour',
    type: 'Full-time',
    image: 'https://images.unsplash.com/photo-1556909114-4f678fb3bdf6?w=200&h=150&fit=crop&crop=center',
    description: 'Support kitchen operations in busy food court environment.',
    requirements: ['Food safety knowledge', 'Fast-paced environment', 'Team work']
  },
  { 
    id: 5, 
    position: { lat: 49.2750, lng: -123.1300 }, 
    title: 'Cashier', 
    company: 'Local Grocery', 
    salary: '$16/hour',
    type: 'Part-time',
    image: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=200&h=150&fit=crop&crop=center',
    description: 'Process customer transactions and provide friendly service.',
    requirements: ['Cash handling', 'Customer service', 'Attention to detail']
  }
]

// CustomJobMarkerコンポーネント
interface CustomJobMarkerProps {
  job: typeof jobs[0]
  isClicked: boolean
  isHovered: boolean
  onHover: (hovered: boolean) => void
  onClick: () => void
}

function CustomJobMarker({ job, isClicked, isHovered, onHover, onClick }: CustomJobMarkerProps) {
  return (
    <AdvancedMarker position={job.position} onClick={onClick}>
      <div
        className={`
          relative cursor-pointer transition-all duration-300 ease-in-out
          ${isClicked ? 'z-50' : isHovered ? 'z-40 -translate-y-2' : 'z-30'}
        `}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        style={{ pointerEvents: 'all' }}
      >
        {/* カスタムピン */}
        <div 
          className={`
            bg-blue-600 rounded-lg shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center
            ${isClicked 
              ? 'w-80 h-auto p-4 rounded-2xl' 
              : isHovered 
                ? 'w-16 h-16 -translate-y-1' 
                : 'w-12 h-12'
            }
          `}
        >
          {!isClicked ? (
            <MapPin className="text-white" size={isHovered ? 24 : 16} />
          ) : (
            <div className="w-full">
              {/* クローズボタン */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <p className="text-blue-100 text-sm">{job.company}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                  }}
                  className="text-white hover:text-blue-200 ml-2"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 求人画像 */}
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                <img 
                  src={job.image} 
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 求人詳細 */}
              <div className="space-y-2 text-white">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span className="text-sm font-semibold">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm">{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={16} />
                  <span className="text-sm">{job.company}</span>
                </div>
              </div>

              {/* 説明文 */}
              <p className="text-blue-100 text-sm mt-3 leading-relaxed">
                {job.description}
              </p>

              {/* 応募ボタン */}
              <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg mt-4 hover:bg-blue-50 transition-colors">
                Apply Now
              </button>
            </div>
          )}
        </div>

        {/* ピンの先端（三角形） */}
        {!isClicked && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-blue-600"></div>
          </div>
        )}

        {/* ホバー時の小さなプレビュー */}
        {isHovered && !isClicked && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-48 z-10">
            <div className="text-sm font-semibold text-gray-900">{job.title}</div>
            <div className="text-xs text-gray-600">{job.company}</div>
            <div className="text-xs font-medium text-green-600">{job.salary}</div>
            <div className="text-xs text-gray-500">{job.type}</div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </div>
        )}
      </div>
    </AdvancedMarker>
  )
}

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [hoveredJob, setHoveredJob] = useState<number | null>(null)

  const handleJobClick = (jobId: number) => {
    setSelectedJob(selectedJob === jobId ? null : jobId)
  }

  const handleJobHover = (jobId: number, hovered: boolean) => {
    setHoveredJob(hovered ? jobId : null)
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={containerStyle}
        defaultCenter={{ lat: 49.2836161, lng: -123.1148462 }}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
        mapId="DEMO_MAP_ID"
      >
        {jobs.map((job) => (
          <CustomJobMarker
            key={job.id}
            job={job}
            isClicked={selectedJob === job.id}
            isHovered={hoveredJob === job.id}
            onHover={(hovered) => handleJobHover(job.id, hovered)}
            onClick={() => handleJobClick(job.id)}
          />
        ))}
      </Map>
    </APIProvider>
  )
}
