import { useCallback } from 'react'
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'

type TreeClusterMarkerProps = {
  clusterId: number
  position: google.maps.LatLngLiteral
  size: number
  sizeAsText: string
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => void
}

export function FeaturesClusterMarker({
  position,
  size,
  sizeAsText,
  onMarkerClick,
  clusterId,
}: TreeClusterMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef()

  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, clusterId),
    [onMarkerClick, marker, clusterId]
  )

  const markerSize = Math.floor(48 + Math.sqrt(size) * 2)

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className="flex items-center justify-center rounded-full bg-cyan-900 border border-white shadow-black/50 shadow-lg"
      style={{ width: markerSize, height: markerSize }}
    >
      <span className="text-white font-bold">{sizeAsText}</span>
    </AdvancedMarker>
  )
}
