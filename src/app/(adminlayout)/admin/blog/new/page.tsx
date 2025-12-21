'use client'

import { useRef, useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { 
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Calendar,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { SimpleEditor, SimpleEditorRef } from '@/components/tiptap-templates/simple/simple-editor'

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

const tags = [
  'finance',
  'mergers',
  'acquisitions',
  'modeling',
  'excel',
  'valuation',
  'analysis',
  'strategy',
]

export default function NewBlogPostPage() {
  const router = useRouter()
  const editorRef = useRef<SimpleEditorRef>(null)
  
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false) // New state for image upload
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    published: false,
    publishDate: new Date().toISOString().split('T')[0],
  })

  // --- NEW: Handle Featured Image Upload ---
 // src/app/(adminlayout)/admin/blog/new/page.tsx

const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  try {
    setIsUploading(true)
    const uploadData = new FormData()
    
    // FIXED: Append as 'image' to match your API route
    uploadData.append('image', file) 

    // FIXED: Use your EXISTING admin route
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
      let editorContent = '';
      if (editorRef.current) {
        editorContent = editorRef.current.getContent();
      }

      if (!formData.title.trim() || !editorContent.trim() || !formData.category.trim()) {
        toast.error('Title, content, and category are required');
        setIsSubmitting(false);
        return;
      }
      
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: editorContent,
          tags: selectedTags,
        }),
      })

      if (response.ok) {
        toast.success('Blog post created successfully!')
        router.push('/admin/blog')
      } else {
        throw new Error('Failed to create blog post')
      }
    } catch (error) {
      toast.error('Failed to create blog post')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      seoTitle: title,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Blog Post</h1>
          <p className="text-muted-foreground">
            Create a new article for your blog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" disabled={isSubmitting}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
              <CardDescription>Enter a descriptive title for your blog post</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter blog post title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write your blog post content here</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleEditor ref={editorRef} />
              <div className="text-sm text-muted-foreground mt-2">
                Write your blog content above.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Status</Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, published: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {formData.published ? 'Publish Now' : 'Save as Draft'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
              <CardDescription>A short summary of your blog post</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter a brief excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Featured Image Section Updated */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hidden Input */}
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
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a featured image
                  </p>
                  <Button 
                    variant="outline" 
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
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
                  placeholder="SEO-friendly title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="SEO-friendly description"
                  rows={3}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Slug: {formData.slug || 'auto-generated-from-title'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}