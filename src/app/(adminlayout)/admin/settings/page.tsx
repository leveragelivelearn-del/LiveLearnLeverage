/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save,
  Globe,
  Mail,
  Search,
  Image,
  Shield,
  Loader2,
  HelpCircle, // New icon for FAQ
  Plus,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    socialLinks: {}, 
    faqs: [] // Initialize faqs array
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          // Ensure faqs array exists even if DB returns null/undefined
          if (!data.faqs) data.faqs = []
          setSettings(data)
        }
      } catch (error) {
        toast.error('Failed to load settings')
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSocialChange = (key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value }
    }))
  }

  // --- FAQ Handlers ---
  const handleAddFAQ = () => {
    setSettings((prev: any) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }))
  }

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...settings.faqs]
    newFaqs[index][field] = value
    setSettings((prev: any) => ({ ...prev, faqs: newFaqs }))
  }

  const handleRemoveFAQ = (index: number) => {
    const newFaqs = settings.faqs.filter((_: any, i: number) => i !== index)
    setSettings((prev: any) => ({ ...prev, faqs: newFaqs }))
  }
  // --------------------

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast.success('Settings saved successfully!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your website settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6"> {/* Changed grid-cols to 6 */}
          <TabsTrigger value="general"><Globe className="h-4 w-4 mr-2" /> General</TabsTrigger>
          <TabsTrigger value="faq"><HelpCircle className="h-4 w-4 mr-2" /> FAQ</TabsTrigger> {/* New Tab */}
          <TabsTrigger value="seo"><Search className="h-4 w-4 mr-2" /> SEO</TabsTrigger>
          <TabsTrigger value="email"><Mail className="h-4 w-4 mr-2" /> Email</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" /> Security</TabsTrigger>
          <TabsTrigger value="media"><Image className="h-4 w-4 mr-2" /> Media</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic website configuration and footer info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input value={settings.siteName || ''} onChange={(e) => handleChange('siteName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Site URL</Label>
                  <Input value={settings.siteUrl || ''} onChange={(e) => handleChange('siteUrl', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Site Description</Label>
                <Textarea value={settings.siteDescription || ''} onChange={(e) => handleChange('siteDescription', e.target.value)} />
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-lg font-medium">Contact Info (Footer)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input value={settings.contactEmail || ''} onChange={(e) => handleChange('contactEmail', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Phone</Label>
                        <Input value={settings.contactPhone || ''} onChange={(e) => handleChange('contactPhone', e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Address</Label>
                        <Textarea rows={2} value={settings.contactAddress || ''} onChange={(e) => handleChange('contactAddress', e.target.value)} />
                    </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-lg font-medium">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>LinkedIn</Label>
                        <Input placeholder="https://linkedin.com/in/..." value={settings.socialLinks?.linkedin || ''} onChange={(e) => handleSocialChange('linkedin', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Twitter/X</Label>
                        <Input placeholder="https://twitter.com/..." value={settings.socialLinks?.twitter || ''} onChange={(e) => handleSocialChange('twitter', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Facebook</Label>
                        <Input placeholder="https://facebook.com/..." value={settings.socialLinks?.facebook || ''} onChange={(e) => handleSocialChange('facebook', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Instagram</Label>
                        <Input placeholder="https://instagram.com/..." value={settings.socialLinks?.instagram || ''} onChange={(e) => handleSocialChange('instagram', e.target.value)} />
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Settings */}
        <TabsContent value="faq">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Manage the FAQs displayed on the home page</CardDescription>
              </div>
              <Button onClick={handleAddFAQ} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add FAQ
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.faqs?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  No FAQs added yet. Click &quot;Add FAQ&quot; to start.
                </div>
              ) : (
                settings.faqs?.map((faq: any, index: number) => (
                  <div key={index} className="flex gap-4 items-start p-4 border rounded-lg bg-card">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label>Question {index + 1}</Label>
                        <Input 
                          value={faq.question} 
                          onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                          placeholder="e.g. How can your product help me?" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea 
                          value={faq.answer} 
                          onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                          placeholder="Answer here..." 
                          rows={3}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive/90 mt-8"
                      onClick={() => handleRemoveFAQ(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs (SEO, Email, Security) remain unchanged */}
        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Meta Title</Label>
                <Input value={settings.metaTitle || ''} onChange={(e) => handleChange('metaTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Default Meta Description</Label>
                <Textarea value={settings.metaDescription || ''} onChange={(e) => handleChange('metaDescription', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input value={settings.metaKeywords || ''} onChange={(e) => handleChange('metaKeywords', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Require 2FA</Label>
                <Switch checked={settings.require2FA} onCheckedChange={(c) => handleChange('require2FA', c)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Rate Limiting</Label>
                <Switch checked={settings.rateLimit} onCheckedChange={(c) => handleChange('rateLimit', c)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
            <Card>
                <CardHeader><CardTitle>Email Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>SMTP Host</Label>
                            <Input value={settings.smtpHost || ''} onChange={(e) => handleChange('smtpHost', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>SMTP Port</Label>
                            <Input value={settings.smtpPort || ''} onChange={(e) => handleChange('smtpPort', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}