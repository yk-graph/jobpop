'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { s3Client } from '@/lib/aws'
import { ServerActionResult } from '@/types'
import { handleError } from '@/utils'

export type UploadImageResult = {
  uploadUrl: string
  fileKey: string
  publicUrl: string
}

export type Visibility = 'public' | 'private'

export type FileData = {
  dir: string
  type: string
  size: number
  visibility: Visibility
}

// 許可するファイルタイプ
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'] as const

// 最大ファイルサイズ (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function generatePresignedUploadUrl(
  fileDatas: FileData[]
): Promise<ServerActionResult<UploadImageResult | UploadImageResult[]>> {
  try {
    // バリデーション
    for (const fileData of fileDatas) {
      // ファイルタイプチェック
      if (!ALLOWED_FILE_TYPES.includes(fileData.type as (typeof ALLOWED_FILE_TYPES)[number])) {
        return {
          success: false,
          message: `File type "${fileData.type}" is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
        }
      }

      // ファイルサイズチェック
      if (fileData.size > MAX_FILE_SIZE) {
        return {
          success: false,
          message: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        }
      }

      // ディレクトリ名のサニタイズ（スラッシュでネスト可、先頭・末尾・連続スラッシュは不可）
      if (!/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(fileData.dir)) {
        return {
          success: false,
          message: 'Invalid directory name. Use alphanumeric characters, hyphens, underscores, and slashes (e.g., "company/logos").',
        }
      }
    }

    const uploadUrls = await Promise.all(
      fileDatas.map(async (fileData) => {
        const { visibility, dir } = fileData
        const fileType = fileData.type.split('/')[1] // e.g., 'image/png' -> 'png'

        const bucketName = process.env.AWS_S3_BUCKET_NAME!
        // visibility/dir/uuid.ext の形式でファイルキーを生成
        const fileKey = `${visibility}/${dir}/${crypto.randomUUID()}.${fileType}`

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          ContentType: fileData.type,
        })

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
        const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`

        return {
          uploadUrl, // s3に保存する際に使用するAPIのエンドポイント（署名付きURL）
          fileKey, // DBに保存するためのS3キー
          publicUrl, // 公開URL（DBに保存・表示用）
        }
      })
    )

    return {
      success: true,
      message: 'Presigned upload URLs generated successfully',
      data: uploadUrls.length === 1 ? uploadUrls[0] : uploadUrls,
    }
  } catch (error) {
    return handleError(error, 'generatePresignedUploadUrl')
  }
}
