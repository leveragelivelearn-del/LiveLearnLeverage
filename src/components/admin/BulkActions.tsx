'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  CheckSquare,
  Square,
  Trash2,
  Archive,
  Download,
  Send,
  Eye,
  EyeOff,
  MoreHorizontal,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface BulkActionsProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkDelete: () => Promise<void>
  onBulkPublish?: () => Promise<void>
  onBulkArchive?: () => Promise<void>
  onBulkExport?: () => Promise<void>
}

export function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkPublish,
  onBulkArchive,
  onBulkExport,
}: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBulkAction = async (action: () => Promise<void>, actionName: string) => {
    if (selectedItems.length === 0) {
      toast.error('No items selected')
      return
    }

    setIsProcessing(true)
    try {
      await action()
    } catch (error) {
      console.error(`Bulk ${actionName} error:`, error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (selectedItems.length === 0) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
        >
          <Square className="mr-2 h-4 w-4" />
          Select All ({totalItems})
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          {selectedItems.length} selected
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Click to clear selection
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onBulkPublish && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction(onBulkPublish, 'publish')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        )}

        {onBulkArchive && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction(onBulkArchive, 'archive')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Archive className="mr-2 h-4 w-4" />
            )}
            Archive
          </Button>
        )}

        {onBulkExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction(onBulkExport, 'export')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onBulkPublish && (
              <DropdownMenuItem onClick={() => handleBulkAction(onBulkPublish, 'publish')}>
                <Send className="mr-2 h-4 w-4" />
                Publish Selected
              </DropdownMenuItem>
            )}
            {onBulkArchive && (
              <DropdownMenuItem onClick={() => handleBulkAction(onBulkArchive, 'archive')}>
                <Archive className="mr-2 h-4 w-4" />
                Archive Selected
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleBulkAction(onBulkDelete, 'delete')}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
            {onBulkExport && (
              <DropdownMenuItem onClick={() => handleBulkAction(onBulkExport, 'export')}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSelectAll}>
              <Square className="mr-2 h-4 w-4" />
              Select All ({totalItems})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClearSelection}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Clear Selection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}