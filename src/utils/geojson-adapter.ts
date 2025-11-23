import type { FeatureCollection, Point } from 'geojson'

import type { GetJobsResult } from '@/actions'

// 求人データ用のGeoJSON型定義
export type JobsGeojson = FeatureCollection<Point, GetJobsResult>

// DBの求人データをGeoJSON形式に変換 -> クラスタリング用のライブラリで使用可能な形式に変換します
export function convertJobsToGeoJSON(jobs: GetJobsResult[]): JobsGeojson {
  return {
    type: 'FeatureCollection',
    features: jobs.map((job) => ({
      type: 'Feature',
      id: job.id,
      geometry: {
        type: 'Point',
        coordinates: [job.lng, job.lat], // GeoJSONは [lng, lat] の順序
      },
      properties: {
        ...job,
      },
    })),
  }
}

// GeoJSON FeatureからDBの求人データ形式に逆変換 -> クラスタリング処理後のデータを元の形式に戻す場合に使用
export function convertFeatureToJob(feature: JobsGeojson['features'][0]): GetJobsResult {
  const [lng, lat] = feature.geometry.coordinates

  return {
    ...feature.properties,
    lat,
    lng,
  }
}

// クラスタリング用のポイント配列を生成 -> superclusterライブラリなどで使用
export function extractPointsFromJobs(jobs: GetJobsResult[]) {
  return jobs.map((job) => ({
    type: 'Feature' as const,
    id: job.id,
    geometry: {
      type: 'Point' as const,
      coordinates: [job.lng, job.lat] as [number, number],
    },
    properties: job,
  }))
}
