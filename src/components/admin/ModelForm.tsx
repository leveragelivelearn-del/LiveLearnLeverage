"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { PdfUpload } from '@/components/admin/PdfUpload'
import { SlidesUpload } from '@/components/admin/SlidesUpload'
import {
  Save,
  X,
  Plus,
  Calendar,
  DollarSign,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import NovelEditor from '@/components/admin/editor/NovelEditor'

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

  const [pdfFile, setPdfFile] = useState<any>(
    initialData?.pdfFileUrl
      ? {
        url: initialData.pdfFileUrl,
        fileName: 'Existing PDF File',
        fileSize: 0,
        uploadedAt: new Date()
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
      let isDescEmpty = false;
      if (!formData.description || formData.description.trim() === '') {
        isDescEmpty = true;
      } else {
        try {
          const parsed = JSON.parse(formData.description);
          if (!parsed || Object.keys(parsed).length === 0) {
            isDescEmpty = true;
          } else if (parsed.type === 'doc') {
            if (!parsed.content || parsed.content.length === 0) {
              isDescEmpty = true;
            } else {
              const allEmpty = parsed.content.every((node: any) => node.type === 'paragraph' && (!node.content || node.content.length === 0));
              if (allEmpty) isDescEmpty = true;
            }
          } else if (Array.isArray(parsed)) {
            const allEmpty = parsed.every((node: any) => node.type === 'paragraph' && (!node.content || node.content.length === 0));
            if (parsed.length === 0 || allEmpty) isDescEmpty = true;
          }
        } catch (e) {
          isDescEmpty = formData.description.trim() === '';
        }
      }

      if (isDescEmpty) {
        throw new Error('Description is required');
      }

      const metricsMap: Record<string, string> = {}
      keyMetrics.forEach(metric => {
        if (metric.key.trim() && metric.value.trim()) {
          metricsMap[metric.key.trim()] = metric.value.trim()
        }
      })

      const dealSize = parseFloat(formData.dealSize.replace(/,/g, ''))
      if (isNaN(dealSize)) {
        throw new Error('Deal Size is required and must be a valid number')
      }

      const modelData = {
        ...formData,
        // Only slugify if creating new or if user cleared the slug, otherwise keep existing or manually edited
        slug: formData.slug ? slugify(formData.slug) : slugify(formData.title),
        dealSize,
        slides: slides.map((slide, index) => ({
          imageUrl: slide.url,
          caption: slide.caption || '',
          order: index,
        })),
        keyMetrics: metricsMap,
        excelFileUrl: excelFile?.url,
        pdfFileUrl: pdfFile?.url,
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

  // Helper to handle Novel editor content as JSON object
  const handleDescriptionChange = (content: any) => {
    setFormData(prev => ({ ...prev, description: JSON.stringify(content) }));
  }

  // Parse initial content for Novel
  const initialDescriptionContent = (() => {
    if (!initialData?.description) return undefined;
    try {
      return JSON.parse(initialData.description);
    } catch (e) {
      // If it's old plain text, create a simple doc structure
      return {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: initialData.description }] }]
      };
    }
  })();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit M&A Model' : 'New M&A Model'}</h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update existing model details' : 'Create a new M&A model with financial analysis'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" asChild className="flex-1 sm:flex-none">
            <Link href="/admin/models">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 sm:flex-none">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Model' : 'Create Model')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the core details of the M&A transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">Deal Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Acquisition of Company XYZ by ABC Corp"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="bg-muted/10 border-muted/50 focus:border-primary"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Description *</Label>
              <NovelEditor 
                initialValue={initialDescriptionContent} 
                onChange={handleDescriptionChange} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-semibold">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="bg-muted/10 border-muted/50">
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
                <Label htmlFor="dealType" className="text-sm font-semibold">Deal Type *</Label>
                <Select
                  value={formData.dealType}
                  onValueChange={(value) => setFormData({ ...formData, dealType: value })}
                >
                  <SelectTrigger className="bg-muted/10 border-muted/50">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dealSize" className="text-sm font-semibold">Deal Size (Millions) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dealSize"
                    placeholder="e.g., 100"
                    value={formData.dealSize}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value)
                      setFormData({ ...formData, dealSize: formatted })
                    }}
                    className="pl-9 bg-muted/10 border-muted/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-semibold">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="bg-muted/10 border-muted/50">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="completionDate" className="text-sm font-semibold">Completion Date *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    required
                    className="bg-muted/10 border-muted/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                  className="bg-muted/10 border-muted/50"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  URL: /models/{formData.slug || 'slug'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="text-base font-semibold">Featured Deal</Label>
                <p className="text-xs text-muted-foreground">Highlight this model on the homepage</p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Resources & Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ExcelUpload
            onUploadComplete={(fileInfo) => setExcelFile(fileInfo)}
            existingFile={excelFile}
          />

          <PdfUpload
            onUploadComplete={(fileInfo) => setPdfFile(fileInfo)}
            existingFile={pdfFile}
          />
        </div>

        {/* Presentation Slides */}
        <SlidesUpload
          slides={slides}
          onSlidesChange={setSlides}
        />

        {/* Key Financial Metrics */}
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle>Key Financial Metrics</CardTitle>
            <CardDescription>
              Add key valuation and financial metrics for quick reference
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    placeholder="Metric name (e.g., EV/EBITDA)"
                    value={metric.key}
                    onChange={(e) => handleMetricChange(index, 'key', e.target.value)}
                    className="flex-1 bg-muted/10 border-muted/50"
                  />
                  <Input
                    placeholder="Value (e.g., 12.5x)"
                    value={metric.value}
                    onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                    className="flex-1 bg-muted/10 border-muted/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMetric(index)}
                    disabled={keyMetrics.length <= 1}
                    className="text-muted-foreground hover:text-destructive"
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
              className="w-full border-dashed"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Metric
            </Button>
          </CardContent>
        </Card>

        {/* Form Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button variant="ghost" asChild>
            <Link href="/admin/models">Cancel</Link>
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[150px]">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving Model...' : (isEdit ? 'Save Changes' : 'Create Model')}
          </Button>
        </div>
      </form>
    </div>
  )
}
