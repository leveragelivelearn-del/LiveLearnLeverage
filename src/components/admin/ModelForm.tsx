"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ExcelUpload } from '@/components/admin/ExcelUpload'
import { SlidesUpload } from '@/components/admin/SlidesUpload'
import {
  Save,
  Eye,
  X,
  Plus,
  Calendar,
  DollarSign,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { SimpleEditor, SimpleEditorRef } from '@/components/tiptap-templates/simple/simple-editor'
import Link from 'next/link'

const industries = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Goods',
  'Energy',
  'Real Estate',
  'Telecommunications',
  'Industrials',
  'Materials',
  'Utilities',
]

const dealTypes = [
  'Merger',
  'Acquisition',
  'Leveraged Buyout',
  'Divestiture',
  'Joint Venture',
  'Strategic Alliance',
  'Takeover',
  'Management Buyout',
]

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
]

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')               // Separate accents from letters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '')             // Trim - from end
}

interface ModelFormProps {
  initialData?: any
  isEdit?: boolean
}

export function ModelForm({ initialData, isEdit = false }: ModelFormProps) {
  const router = useRouter()
  const editorRef = useRef<SimpleEditorRef>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize state directly from props
  const [excelFile, setExcelFile] = useState<any>(
    initialData?.excelFileUrl
      ? {
        url: initialData.excelFileUrl,
        fileName: 'Existing Excel File', // Default name if not stored
        fileSize: 0, // Default size if not stored
        uploadedAt: new Date() // Default date if not stored
      }
      : null
  )

  const [slides, setSlides] = useState<any[]>(initialData?.slides ? initialData.slides.map((s: any) => ({
    url: s.imageUrl,
    caption: s.caption,
    id: Math.random().toString(36).substr(2, 9)
  })) : [])

  const [keyMetrics, setKeyMetrics] = useState<Array<{ key: string, value: string }>>(() => {
    if (initialData?.keyMetrics) {
      const metrics = Object.entries(initialData.keyMetrics).map(([key, value]) => ({
        key,
        value: value as string
      }))
      if (metrics.length > 0) return metrics
    }
    return [
      { key: 'EV/EBITDA', value: '' },
      { key: 'P/E Ratio', value: '' },
      { key: 'Revenue Multiple', value: '' },
    ]
  })

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    dealSize: initialData?.dealSize?.toString() || '',
    currency: initialData?.currency || 'USD',
    industry: initialData?.industry || '',
    dealType: initialData?.dealType || '',
    completionDate: initialData?.completionDate ? new Date(initialData.completionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    featured: initialData?.featured || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let rationaleContent = '';
      if (editorRef.current) {
        rationaleContent = editorRef.current.getContent();
      }

      if (!rationaleContent || rationaleContent.trim() === '<p></p>') {
        throw new Error('Deal Rationale is required');
      }

      const metricsMap: Record<string, string> = {}
      keyMetrics.forEach(metric => {
        if (metric.key.trim() && metric.value.trim()) {
          metricsMap[metric.key.trim()] = metric.value.trim()
        }
      })

      const modelData = {
        ...formData,
        // Only slugify if creating new or if user cleared the slug, otherwise keep existing or manually edited
        slug: formData.slug ? slugify(formData.slug) : slugify(formData.title),
        rationale: rationaleContent,
        dealSize: parseFloat(formData.dealSize.replace(/,/g, '')),
        slides: slides.map((slide, index) => ({
          imageUrl: slide.url,
          caption: slide.caption || '',
          order: index,
        })),
        keyMetrics: metricsMap,
        excelFileUrl: excelFile?.url,
      }

      const url = isEdit ? `/api/admin/models/${initialData.slug}` : '/api/admin/models'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      })

      if (response.ok) {
        toast.success(isEdit ? 'Model updated successfully!' : 'Model created successfully!')
        router.push('/admin/models')
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save model')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save model')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddMetric = () => {
    setKeyMetrics([...keyMetrics, { key: '', value: '' }])
  }

  const handleRemoveMetric = (index: number) => {
    setKeyMetrics(keyMetrics.filter((_, i) => i !== index))
  }

  const handleMetricChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedMetrics = [...keyMetrics]
    updatedMetrics[index][field] = value
    setKeyMetrics(updatedMetrics)
  }

  const handleTitleChange = (title: string) => {
    // Only auto-update slug if we are NOT in edit mode, or if the slug hasn't been manually touched yet (simplification: only on create)
    // Actually, distinct behavior:
    // Create: update slug matching title
    // Edit: don't auto-update slug when title changes to avoid breaking links, user must edit slug manually if desired

    if (!isEdit) {
      setFormData({
        ...formData,
        title,
        slug: slugify(title),
      })
    } else {
      setFormData({
        ...formData,
        title,
      })
    }
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''))
    if (isNaN(num)) return ''
    return num.toLocaleString('en-US')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit M&A Model' : 'New M&A Model'}</h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update existing model details' : 'Create a new M&A model with financial analysis'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/admin/models">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Model' : 'Create Model')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of the M&A transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Deal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Acquisition of Company XYZ by ABC Corp"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the deal and its significance"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dealType">Deal Type *</Label>
                  <Select
                    value={formData.dealType}
                    onValueChange={(value) => setFormData({ ...formData, dealType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dealSize">Deal Size *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dealSize"
                      placeholder="100,000,000"
                      value={formData.dealSize}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value)
                        setFormData({ ...formData, dealSize: formatted })
                      }}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionDate">Completion Date *</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deal Rationale */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Rationale</CardTitle>
              <CardDescription>
                Detailed analysis and rationale behind the transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Note: In edit mode, we'd need to pass content to simple editor. 
                  Assuming SimpleEditor accepts `initialContent` prop. 
                  If not, we might need to update SimpleEditor or use the ref to set content when data loads. 
              */}
              <SimpleEditor ref={editorRef} initialContent={initialData?.rationale} />
            </CardContent>
          </Card>

          {/* Key Financial Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Financial Metrics</CardTitle>
              <CardDescription>
                Add key valuation and financial metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {keyMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Metric name (e.g., EV/EBITDA)"
                      value={metric.key}
                      onChange={(e) => handleMetricChange(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g., 12.5x)"
                      value={metric.value}
                      onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMetric(index)}
                      disabled={keyMetrics.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMetric}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Metric
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Excel Upload */}
          <ExcelUpload
            onUploadComplete={(fileInfo) => setExcelFile(fileInfo)}
            existingFile={excelFile}
          />

          {/* Presentation Slides */}
          <SlidesUpload
            slides={slides}
            onSlidesChange={setSlides}
          />

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Deal</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL: /models/{formData.slug}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
