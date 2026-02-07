'use client'

import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { toast } from 'sonner'

import { generatePresignedUploadUrl, UploadImageResult, Visibility } from '@/actions/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange?: (url: string) => void
  dir: string
  visibility: Visibility
  className?: string
  disabled?: boolean
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ value, onChange, dir, visibility, className, disabled }, ref) => {
    const [preview, setPreview] = React.useState<string | null>(value || null)
    const [isUploading, setIsUploading] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // 外部のvalueが変更された時にプレビューを更新
    React.useEffect(() => {
      if (value) {
        setPreview(value)
      }
    }, [value])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // ローカルプレビューを表示
      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)

      setIsUploading(true)

      try {
        // 署名付きURLを取得
        const result = await generatePresignedUploadUrl([
          {
            dir,
            type: file.type,
            size: file.size,
            visibility,
          },
        ])

        if (!result.success || !result.data) {
          toast.error('Failed to prepare upload', { description: result.message })
          setPreview(null)
          return
        }

        const uploadData = result.data as UploadImageResult

        // S3にアップロード
        const uploadResponse = await fetch(uploadData.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to S3')
        }

        // サーバーから返された公開URLを使用
        if (onChange) {
          onChange(uploadData.publicUrl)
        }

        // プレビューを公開URLに更新
        setPreview(uploadData.publicUrl)

        toast.success('Image uploaded successfully')
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Failed to upload image')
        setPreview(null)
      } finally {
        setIsUploading(false)
        // inputをリセット（同じファイルを再選択可能にする）
        if (inputRef.current) {
          inputRef.current.value = ''
        }
      }
    }

    const handleRemove = () => {
      setPreview(null)
      if (onChange) {
        onChange('')
      }
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }

    const handleClick = () => {
      if (!disabled && !isUploading) {
        inputRef.current?.click()
      }
    }

    return (
      <div className={cn('relative', className)}>
        <input
          ref={(node) => {
            // forwardRefとローカルrefの両方を設定
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            inputRef.current = node
          }}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {preview ? (
          <div className="relative aspect-square w-32 overflow-hidden rounded-lg border bg-muted">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            {!isUploading && !disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={handleRemove}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className={cn(
              'flex aspect-square w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed',
              'text-muted-foreground transition-colors hover:border-primary hover:text-primary',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-8 w-8" />
                <span className="text-xs">Upload Image</span>
              </>
            )}
          </button>
        )}
      </div>
    )
  }
)
ImageUpload.displayName = 'ImageUpload'

export { ImageUpload }
