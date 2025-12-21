/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from './FileUpload'
import { 
  Image as ImageIcon,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface SlidesUploadProps {
  slides: Array<{
    url: string
    caption?: string
    order: number
  }>
  onSlidesChange: (slides: any[]) => void
}

export function SlidesUpload({ slides, onSlidesChange }: SlidesUploadProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editCaption, setEditCaption] = useState('')

  const handleUploadComplete = (urls: string[]) => {
    const newSlides = urls.map((url, index) => ({
      url,
      caption: '',
      order: slides.length + index,
    }))
    onSlidesChange([...slides, ...newSlides])
    toast.success(`${urls.length} slide(s) uploaded`)
  }

  const handleRemoveSlide = (index: number) => {
    const updatedSlides = slides.filter((_, i) => i !== index)
    onSlidesChange(updatedSlides)
    toast.success('Slide removed')
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updatedSlides = [...slides]
    const temp = updatedSlides[index]
    updatedSlides[index] = updatedSlides[index - 1]
    updatedSlides[index - 1] = temp
    updatedSlides.forEach((slide, i) => slide.order = i)
    onSlidesChange(updatedSlides)
  }

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return
    const updatedSlides = [...slides]
    const temp = updatedSlides[index]
    updatedSlides[index] = updatedSlides[index + 1]
    updatedSlides[index + 1] = temp
    updatedSlides.forEach((slide, i) => slide.order = i)
    onSlidesChange(updatedSlides)
  }

  const handleEditCaption = (index: number) => {
    if (editingIndex === index) {
      // Save caption
      const updatedSlides = [...slides]
      updatedSlides[index].caption = editCaption
      onSlidesChange(updatedSlides)
      setEditingIndex(null)
      setEditCaption('')
      toast.success('Caption updated')
    } else {
      // Start editing
      setEditingIndex(index)
      setEditCaption(slides[index].caption || '')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presentation Slides</CardTitle>
        <CardDescription>
          Upload deal presentation slides (images)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <FileUpload
          onUploadComplete={handleUploadComplete}
          multiple={true}
          accept={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
          }}
          label="Drag & drop slide images here"
        />

        {/* Slides List */}
        {slides.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Slides ({slides.length})</h4>
              <p className="text-sm text-muted-foreground">
                Drag to reorder or add captions
              </p>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {slides.map((slide, index) => (
                <div
                  key={slide.url}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {/* Slide Thumbnail */}
                  <div className="relative h-16 w-24 flex-shrink-0">
                    <Image
                      src={slide.url}
                      alt={`Slide ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                    <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Caption and Actions */}
                  <div className="flex-1 min-w-0">
                    {editingIndex === index ? (
                      <div className="space-y-2">
                        <Input
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          placeholder="Enter slide caption"
                          className="text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleEditCaption(index)}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingIndex(null)
                              setEditCaption('')
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium truncate">
                          Slide {index + 1}
                        </p>
                        {slide.caption ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {slide.caption}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No caption
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCaption(index)}
                        title="Edit caption"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSlide(index)}
                        title="Remove slide"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <MoveUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === slides.length - 1}
                        title="Move down"
                      >
                        <MoveDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}