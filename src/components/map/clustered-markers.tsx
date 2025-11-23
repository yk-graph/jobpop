import { useCallback } from 'react'
import { GeoJsonProperties } from 'geojson'
import Supercluster, { ClusterProperties } from 'supercluster'

import { useSupercluster } from '@/hooks'
import { type GetJobsResult } from '@/actions'
import { GoogleMapAdvancedMarker, FeaturesClusterMarker } from '@/components/map'
import { JobsGeojson } from '@/utils'

type ClusteredMarkersProps = {
  geojson: JobsGeojson
  selectedJob: GetJobsResult | null
  hoveredJobId: string | null
  handleJobClick: (jobId: string) => void
  handleJobHover: (jobId: string, hovered: boolean) => void
}

const superclusterOptions: Supercluster.Options<GeoJsonProperties, ClusterProperties> = {
  extent: 256,
  radius: 80,
  maxZoom: 12,
}

export function ClusteredMarkers({
  geojson,
  selectedJob,
  hoveredJobId,
  handleJobClick,
  handleJobHover,
}: ClusteredMarkersProps) {
  const { clusters, getLeaves } = useSupercluster(geojson, superclusterOptions)

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      const leaves = getLeaves(clusterId)
      alert(`Cluster ID: ${clusterId}\nContains ${leaves.length} jobs.`)
    },
    [getLeaves]
  )

  return clusters.map((feature) => {
    const [lng, lat] = feature.geometry.coordinates
    const clusterProperties = feature.properties as ClusterProperties
    const isCluster: boolean = clusterProperties.cluster

    console.log('✅️clusterProperties:', clusterProperties)

    if (isCluster) {
      return (
        <FeaturesClusterMarker
          key={feature.id}
          clusterId={clusterProperties.cluster_id}
          position={{ lat, lng }}
          size={clusterProperties.point_count}
          sizeAsText={String(clusterProperties.point_count_abbreviated)}
          onMarkerClick={handleClusterClick}
        />
      )
    }

    const job = feature.properties as GetJobsResult // 個別マーカーの場合：propertiesをGetJobsResult形式に変換

    return (
      <GoogleMapAdvancedMarker
        key={feature.id}
        job={job}
        clicked={selectedJob?.id === job.id}
        hovered={hoveredJobId === job.id}
        handleJobClick={handleJobClick}
        handleJobHover={handleJobHover}
      />
    )
  })
}
