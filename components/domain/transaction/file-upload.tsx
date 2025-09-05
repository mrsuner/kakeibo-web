'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUploadFileMutation } from '@/lib/store/features/fileApi'
import type { File } from '@/lib/store/features/fileApi'

interface FileUploadProps {
  onFilesUploaded: (fileIds: string[]) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
}

export default function FileUpload({ 
  onFilesUploaded, 
  maxFiles = 5,
  acceptedFileTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt']
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [uploadFile] = useUploadFileMutation()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Check if adding these files would exceed the limit
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Track uploading files by name
    const uploadingNames = acceptedFiles.map(f => f.name)
    setUploadingFiles(prev => [...prev, ...uploadingNames])

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        try {
          const uploadedFile = await uploadFile(formData).unwrap()
          return uploadedFile
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          return null
        }
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter((result): result is File => result !== null)
      
      if (successfulUploads.length > 0) {
        const newUploadedFiles = [...uploadedFiles, ...successfulUploads]
        setUploadedFiles(newUploadedFiles)
        onFilesUploaded(newUploadedFiles.map(f => f.id))
      }

      if (results.some(result => result === null)) {
        alert('Some files failed to upload. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload files. Please try again.')
    } finally {
      setUploadingFiles(prev => prev.filter(name => !uploadingNames.includes(name)))
    }
  }, [uploadedFiles, maxFiles, uploadFile, onFilesUploaded])

  const removeFile = (fileId: string) => {
    const newUploadedFiles = uploadedFiles.filter(f => f.id !== fileId)
    setUploadedFiles(newUploadedFiles)
    onFilesUploaded(newUploadedFiles.map(f => f.id))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType && mimeType.startsWith('image/')) return '🖼️'
    if (mimeType === 'application/pdf') return '📄'
    if (mimeType && (mimeType.includes('word') || mimeType.includes('document'))) return '📝'
    if (mimeType && mimeType.includes('text')) return '📄'
    return '📎'
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Attachments</span>
        <span className="label-text-alt text-base-content/60">
          {uploadedFiles.length}/{maxFiles} files
        </span>
      </label>
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer hover:bg-base-200/50 ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : uploadedFiles.length >= maxFiles 
              ? 'border-base-300 bg-base-100 opacity-50 cursor-not-allowed'
              : 'border-base-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="text-4xl mb-4">
            {isDragActive ? '📥' : '📎'}
          </div>
          {uploadedFiles.length >= maxFiles ? (
            <p className="text-base-content/60">Maximum files reached</p>
          ) : isDragActive ? (
            <p className="text-primary font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-base-content font-medium mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-base-content/60">
                Supports images, PDF, documents • Max {maxFiles} files
              </p>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
            >
              <span className="text-xl">{getFileIcon(file.mimeType)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{file.originalName}</p>
                <p className="text-xs text-base-content/60">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="btn btn-ghost btn-circle btn-xs hover:btn-error"
                title="Remove file"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadingFiles.map((fileName) => (
            <div 
              key={fileName} 
              className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg"
            >
              <span className="loading loading-spinner loading-sm"></span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-base-content/70">
                  {fileName}
                </p>
                <p className="text-xs text-base-content/50">Uploading...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}