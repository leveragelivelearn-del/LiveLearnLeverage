import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, Edit, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  size?: 'sm' | 'default' | 'lg'
}

export function StatusBadge({ status, size = 'default' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          icon: Edit,
          text: 'Draft',
          className: 'bg-gray-100 text-gray-800 border-gray-300',
        }
      case 'published':
        return {
          icon: CheckCircle,
          text: 'Published',
          className: 'bg-green-100 text-green-800 border-green-300',
        }
      case 'scheduled':
        return {
          icon: Clock,
          text: 'Scheduled',
          className: 'bg-blue-100 text-blue-800 border-blue-300',
        }
      case 'archived':
        return {
          icon: EyeOff,
          text: 'Archived',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn('flex items-center gap-1', config.className, {
        'text-xs px-2 py-0.5': size === 'sm',
        'text-sm px-3 py-1': size === 'default',
        'text-base px-4 py-2': size === 'lg',
      })}
    >
      <Icon className={cn({
        'h-3 w-3': size === 'sm',
        'h-4 w-4': size === 'default',
        'h-5 w-5': size === 'lg',
      })} />
      {config.text}
    </Badge>
  )
}