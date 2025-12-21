import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Download, BarChart3 } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

interface ModelCardProps {
  model: {
    _id: string
    title: string
    slug: string
    description: string
    dealSize: number
    currency: string
    industry: string
    dealType: string
    completionDate: string
    views: number
    featured?: boolean
  }
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      {model.featured && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary">Featured</Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1 text-lg">
              <Link 
                href={`/models/${model.slug}`}
                className="hover:text-primary transition-colors"
              >
                {model.title}
              </Link>
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {model.industry}
              </Badge>
              <span>•</span>
              <span className="text-sm">{model.dealType}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{model.views}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {model.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Deal Size:</span>
            <span className="font-bold text-primary">
              {formatCurrency(model.dealSize, model.currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Completed:</span>
            <span>{formatDate(model.completionDate)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex gap-2 w-full">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/models/${model.slug}`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}