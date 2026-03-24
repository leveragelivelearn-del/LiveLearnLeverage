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
  Search,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    socialLinks: {},
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general"><Globe className="h-4 w-4 mr-2" /> General</TabsTrigger>
          <TabsTrigger value="seo"><Search className="h-4 w-4 mr-2" /> SEO</TabsTrigger>
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
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input placeholder="https://wa.me/..." value={settings.socialLinks?.whatsapp || ''} onChange={(e) => handleSocialChange('whatsapp', e.target.value)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
      </Tabs>
    </div>
  )
}