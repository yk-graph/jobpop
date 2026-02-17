import { useEffect } from 'react'
import { useMap } from '@vis.gl/react-google-maps'

type TargetPosition = {
  lat: number
  lng: number
}

type TargetOptions = {
  latOffset?: number // 緯度のオフセット割合 0 ~ 1
  lngOffset?: number // 経度のオフセット割合 0 ~ 1
  zoom?: number
}

export interface PanToControllerProps {
  target: TargetPosition | null // 移動先の座標
  options?: TargetOptions
}

// 選択された求人の位置に地図をパンするコンポーネント
export function PanToController({ target, options = {} }: PanToControllerProps) {
  const map = useMap()
  const { latOffset = 0.25, lngOffset = 0, zoom } = options // デフォルト値設定

  useEffect(() => {
    if (!map || !target) return

    const bounds = map.getBounds()

    // boundsが取得できない場合は基本的な移動のみ
    if (!bounds) {
      map.panTo({ lat: target.lat, lng: target.lng })
      if (zoom) map.setZoom(zoom)
      return
    }

    // 表示範囲からオフセットを計算
    const latSpan = bounds.getNorthEast().lat() - bounds.getSouthWest().lat()
    const lngSpan = bounds.getNorthEast().lng() - bounds.getSouthWest().lng()

    // オフセットを適用した座標を計算
    const adjustedTarget = {
      lat: target.lat + latSpan * latOffset,
      lng: target.lng + lngSpan * lngOffset,
    }

    map.panTo(adjustedTarget)

    if (zoom) {
      map.setZoom(zoom)
    }
  }, [map, target, latOffset, lngOffset, zoom])

  return null
}
