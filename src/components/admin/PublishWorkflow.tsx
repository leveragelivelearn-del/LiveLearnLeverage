'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Calendar as CalendarIcon,
  Clock,
  Save,
  Send,
  Eye,
  EyeOff,
  Archive
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PublishWorkflowProps {
  currentStatus: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: Date
  onStatusChange: (status: 'draft' | 'published' | 'scheduled' | 'archived', date?: Date) => void
  onSaveDraft: () => Promise<void>
}

export function PublishWorkflow({
  currentStatus,
  publishedAt,
  onStatusChange,
  onSaveDraft,
}: PublishWorkflowProps) {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    publishedAt ? new Date(publishedAt) : new Date()
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      await onSaveDraft()
      toast.success('Draft saved successfully')
    } catch (error) {
      toast.error('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublishNow = async () => {
    setIsPublishing(true)
    try {
      await onStatusChange('published', new Date())
      toast.success('Published successfully!')
    } catch (error) {
      toast.error('Failed to publish')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSchedule = async () => {
    if (!scheduledDate) {
      toast.error('Please select a date')
      return
    }
    
    setIsPublishing(true)
    try {
      await onStatusChange('scheduled', scheduledDate)
      toast.success(`Scheduled for ${format(scheduledDate, 'PPP')}`)
    } catch (error) {
      toast.error('Failed to schedule')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleArchive = async () => {
    try {
      await onStatusChange('archived')
      toast.success('Archived successfully')
    } catch (error) {
      toast.error('Failed to archive')
    }
  }

  const handleUnpublish = async () => {
    try {
      await onStatusChange('draft')
      toast.success('Unpublished successfully')
    } catch (error) {
      toast.error('Failed to unpublish')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish</CardTitle>
        <CardDescription>
          Control the visibility of this content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="space-y-2">
          <Label>Current Status</Label>
          <div className="flex items-center gap-2">
            {currentStatus === 'draft' && (
              <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                <EyeOff className="h-3 w-3 inline mr-1" />
                Draft
              </div>
            )}
            {currentStatus === 'published' && (
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                <Eye className="h-3 w-3 inline mr-1" />
                Published
              </div>
            )}
            {currentStatus === 'scheduled' && (
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                <Clock className="h-3 w-3 inline mr-1" />
                Scheduled
              </div>
            )}
            {currentStatus === 'archived' && (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                <Archive className="h-3 w-3 inline mr-1" />
                Archived
              </div>
            )}
            
            {publishedAt && currentStatus !== 'draft' && (
              <span className="text-sm text-muted-foreground">
                {currentStatus === 'scheduled' ? 'Will publish' : 'Published'} on{' '}
                {format(new Date(publishedAt), 'PPP')}
              </span>
            )}
          </div>
        </div>

        {/* Save Draft */}
        {currentStatus === 'draft' && (
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="w-full"
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        )}

        {/* Publish Now */}
        {currentStatus !== 'published' && (
          <Button
            onClick={handlePublishNow}
            className="w-full"
            disabled={isPublishing}
          >
            <Send className="mr-2 h-4 w-4" />
            {isPublishing ? 'Publishing...' : 'Publish Now'}
          </Button>
        )}

        {/* Schedule for Later */}
        {currentStatus !== 'published' && (
          <div className="space-y-3">
            <Label>Schedule for later</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'flex-1 justify-start text-left font-normal',
                      !scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? (
                      format(scheduledDate, 'PPP')
                    ) : (
                      'Pick a date'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleSchedule}
                variant="outline"
                disabled={!scheduledDate || isPublishing}
              >
                <Clock className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </div>
          </div>
        )}

        {/* Unpublish/Archive */}
        {currentStatus === 'published' && (
          <div className="space-y-3">
            <Button
              onClick={handleUnpublish}
              variant="outline"
              className="w-full"
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish
            </Button>
            <Button
              onClick={handleArchive}
              variant="outline"
              className="w-full text-yellow-600"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>
        )}

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="space-y-0.5">
            <Label htmlFor="featured">Featured</Label>
            <p className="text-sm text-muted-foreground">
              Show this in featured sections
            </p>
          </div>
          <Switch id="featured" />
        </div>
      </CardContent>
    </Card>
  )
}