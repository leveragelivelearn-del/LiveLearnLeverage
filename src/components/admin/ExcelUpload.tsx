/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  FileSpreadsheet, 
  Check, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ExcelUploadProps {
  onUploadComplete: (fileInfo: {
    url: string
    fileName: string
    fileSize: number
    uploadedAt: Date
  }) => void
  existingFile?: {
    url: string
    fileName: string
    fileSize: number
    uploadedAt: Date
  }
}

export function ExcelUpload({ onUploadComplete, existingFile }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError('')
    const acceptedFile = acceptedFiles[0]
    
    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet',
    ]
    
    if (!allowedTypes.includes(acceptedFile.type)) {
      setUploadError('Please upload a valid Excel file (.xls, .xlsx, .ods)')
      return
    }
    
    // Validate file size (50MB max)
    if (acceptedFile.size > 50 * 1024 * 1024) {
      setUploadError('File size must be less than 50MB')
      return
    }
    
    setFile(acceptedFile)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
  })

  const removeFile = () => {
    setFile(null)
    setUploadError('')
  }

  const uploadFile = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)
      
      // Upload to backend
      const response = await fetch('/api/admin/upload-excel', {
        method: 'POST',
        body: formData,
      })
      
      clearInterval(progressInterval)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }
      
      const data = await response.json()
      setUploadProgress(100)
      
      toast.success('Excel file uploaded successfully!')
      
      onUploadComplete({
        url: data.url,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date(),
      })
      
      setFile(null)
      
      // Reset progress after delay
      setTimeout(() => setUploadProgress(0), 1000)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadError(error.message || 'Failed to upload file')
      toast.error('Failed to upload Excel file')
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Existing File */}
      {existingFile && !file && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current File</CardTitle>
            <CardDescription>
              Excel model attached to this deal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{existingFile.fileName}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatFileSize(existingFile.fileSize)}</span>
                    <span>•</span>
                    <span>
                      Uploaded {new Date(existingFile.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={existingFile.url} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={existingFile.url} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {existingFile ? 'Replace Excel File' : 'Upload Excel Model'}
          </CardTitle>
          <CardDescription>
            Upload financial model spreadsheet (.xls, .xlsx, .ods)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag & drop your Excel file here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Max file size: 50MB • Excel files only
            </p>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{uploadError}</p>
            </div>
          )}

          {/* Selected File */}
          {file && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={uploadFile}
                className="w-full"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Excel File
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Requirements */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">File Requirements</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Maximum file size: 50MB
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Supported formats: .xls, .xlsx, .ods
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Include clear sheet names and labels
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Remove sensitive information before uploading
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}