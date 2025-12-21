'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/admin/FileUpload'
import { 
  Search, 
  Grid3x3, 
  List, 
  Filter,
  Download,
  Copy,
  Trash2,
  Eye,
  Upload
} from 'lucide-react'

export default function MediaManagementPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - in real app, fetch from API
  const mediaItems = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      name: 'financial-model.jpg',
      size: '2.4 MB',
      type: 'image',
      uploaded: '2024-01-15',
      dimensions: '1920x1080',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      name: 'deal-analysis.png',
      size: '1.8 MB',
      type: 'image',
      uploaded: '2024-01-14',
      dimensions: '1200x800',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      name: 'presentation-slide.jpg',
      size: '3.2 MB',
      type: 'image',
      uploaded: '2024-01-13',
      dimensions: '2560x1440',
    },
  ]

  const handleUploadComplete = (urls: string[]) => {
    console.log('Uploaded URLs:', urls)
    // In real app, add to media library
  }

  const handleSelectFile = (id: string) => {
    setSelectedFiles(prev =>
      prev.includes(id)
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    )
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    // Show toast notification
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage images, files, and upload new content
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            multiple={true}
            label="Drag & drop images here, or click to select"
          />
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedFiles.includes(item.id.toString())
                  ? 'ring-2 ring-primary'
                  : ''
              }`}
              onClick={() => handleSelectFile(item.id.toString())}
            >
              <CardContent className="p-3">
                <div className="relative aspect-square mb-2">
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-xs font-medium truncate mb-1">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.size}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">File</th>
                <th className="text-left p-4">Size</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Uploaded</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mediaItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-accent/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10">
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.dimensions}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{item.size}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">{item.uploaded}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Files Actions */}
      {selectedFiles.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="text-red-500">
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFiles([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}