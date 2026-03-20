'use client'

import { useRef, useState, useEffect } from 'react'
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
import {
  Upload,
  Loader2,
  ArrowLeft,
  Save
} from 'lucide-react'
import { toast } from 'sonner'
import NovelEditor from '@/components/admin/editor/NovelEditor'
import Link from 'next/link'

const categories = [
  'M&A',
  'Financial Modeling',
  'Valuation',
  'Due Diligence',
  'Investment Banking',
  'Private Equity',
  'Corporate Finance',
  'Market Trends',
]

interface BlogPostFormProps {
  initialData?: any
  isEdit?: boolean
}

export function BlogPostForm({ initialData, isEdit = false }: BlogPostFormProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    featuredImage: initialData?.featuredImage || '',
    published: initialData?.published ?? true,
    publishDate: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  })

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const uploadData = new FormData()
      uploadData.append('image', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setFormData(prev => ({ ...prev, featuredImage: data.url }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let isContentEmpty = false;
      if (!formData.content || formData.content.trim() === '' || formData.content.trim() === '{}') {
        isContentEmpty = true;
      } else {
        try {
          const parsed = JSON.parse(formData.content);
          if (!parsed || Object.keys(parsed).length === 0) {
            isContentEmpty = true;
          } else if (parsed.type === 'doc') {
            if (!parsed.content || parsed.content.length === 0) {
              isContentEmpty = true;
            } else {
              // Check if all content nodes are just empty paragraphs
              const allEmpty = parsed.content.every((node: any) =>
                node.type === 'paragraph' && (!node.content || node.content.length === 0)
              );
              if (allEmpty) isContentEmpty = true;
            }
          }
        } catch (e) {
          isContentEmpty = formData.content.trim() === '';
        }
      }

      if (!formData.title.trim() || isContentEmpty || !formData.category.trim()) {
        toast.error('Title, content, and category are required');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: '',
        content: formData.content, // This is already a JSON string from handleDescriptionChange
        category: formData.category,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        featuredImage: formData.featuredImage,
        tags: [],
        status: 'published',
        published: true
      }

      const url = isEdit ? `/api/admin/blog/${initialData.slug}` : '/api/admin/blog'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(isEdit ? 'Blog post updated successfully!' : 'Blog post published successfully!')
        router.push('/admin/blog')
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save blog post')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTitleChange = (title: string) => {
    if (!isEdit) {
      setFormData({
        ...formData,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        seoTitle: title,
      })
    } else {
      setFormData({
        ...formData,
        title,
      })
    }
  }

  // Helper to handle Novel editor content as JSON object
  const handleDescriptionChange = (content: any) => {
    setFormData(prev => ({ ...prev, content: JSON.stringify(content) }));
  }

  // Parse initial content for Novel
  const initialDescriptionContent = (() => {
    if (!initialData?.content) return undefined;
    try {
      return JSON.parse(initialData.content);
    } catch (e) {
      // If it's old plain text, create a simple doc structure
      return {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: initialData.content }] }]
      };
    }
  })();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update your article' : 'Create a new article for your blog'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">

        {/* Main Content Area */}
        <Card>
          <CardHeader>
            <CardTitle>Title & Content</CardTitle>
            <CardDescription>Enter the core details of your article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                placeholder="Enter blog post title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="text-lg font-medium"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Content *</Label>
              <NovelEditor
                initialValue={initialDescriptionContent}
                onChange={handleDescriptionChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images & SEO */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
              />

              {formData.featuredImage ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:text-red-600"
                    onClick={() => setFormData({ ...formData, featuredImage: '' })}
                    type="button"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Click to upload a featured image
                  </p>
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Choose Image'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Title for search engines"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="Description for search results"
                  rows={4}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>URL Slug: /blog/{formData.slug || '...'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button at the very end */}
        <div className="flex justify-end pt-4 border-t mt-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Updating...' : 'Publishing...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? 'Update Post' : 'Publish Now'}
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}
