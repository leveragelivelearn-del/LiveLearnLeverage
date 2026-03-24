"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Loader2, Upload } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

export default function AdminAboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    name: "",
    tagline: "",
    bioTitle: "",
    bioParagraph1: "",
    bioParagraph2: "",
    email: "",
    resumeUrl: "",
    profileImage: "",
    bannerImage: "",
    contactDescription: "",
    experience: [] as any[],
    education: [] as any[],
  });

  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/about");
        const json = await res.json();
        if (json) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch about data", error);
        toast.error("Failed to load about page data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("About page updated successfully");
        router.refresh();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { role: "", company: "", period: "", desc: "" }],
    }));
  };

  const removeExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...data.experience];
    newExp[index][field] = value;
    setData((prev) => ({ ...prev, experience: newExp }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", school: "", year: "" }],
    }));
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    newEdu[index][field] = value;
    setData((prev) => ({ ...prev, education: newEdu }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">About Page CMS</h1>
          <p className="text-muted-foreground">Manage your personal information and biography.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="bio">Biography</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your name, contact details, and images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={data.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={data.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline / Professional Title</Label>
                <Input id="tagline" value={data.tagline} onChange={(e) => updateField("tagline", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image URL</Label>
                    <div className="flex gap-2">
                      <Input id="profileImage" value={data.profileImage} onChange={(e) => updateField("profileImage", e.target.value)} />
                      <Button variant="outline" size="icon" onClick={() => setShowProfileUpload(!showProfileUpload)}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {showProfileUpload && (
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <FileUpload
                        folder="about/profile"
                        apiEndpoint="/api/admin/upload"
                        onUploadComplete={(urls) => {
                          updateField("profileImage", urls[0]);
                          setShowProfileUpload(false);
                        }}
                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bannerImage">Banner Image URL</Label>
                    <div className="flex gap-2">
                      <Input id="bannerImage" value={data.bannerImage} onChange={(e) => updateField("bannerImage", e.target.value)} />
                      <Button variant="outline" size="icon" onClick={() => setShowBannerUpload(!showBannerUpload)}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {showBannerUpload && (
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <FileUpload
                        folder="about/banner"
                        apiEndpoint="/api/admin/upload"
                        onUploadComplete={(urls) => {
                          updateField("bannerImage", urls[0]);
                          setShowBannerUpload(false);
                        }}
                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resumeUrl">Resume / CV URL</Label>
                  <div className="flex gap-2">
                    <Input id="resumeUrl" value={data.resumeUrl} onChange={(e) => updateField("resumeUrl", e.target.value)} />
                    <Button variant="outline" size="icon" onClick={() => setShowResumeUpload(!showResumeUpload)}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {showResumeUpload && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <FileUpload
                      folder="about/cv"
                      apiEndpoint="/api/admin/upload"
                      label="Upload your Resume/CV (PDF preferred)"
                      onUploadComplete={(urls) => {
                        updateField("resumeUrl", urls[0]);
                        setShowResumeUpload(false);
                      }}
                      accept={{ 'application/pdf': ['.pdf'] }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio">
          <Card>
            <CardHeader>
              <CardTitle>Biography & Contact Description</CardTitle>
              <CardDescription>Tell your story and encourage visitors to reach out.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bioTitle">Bio Title</Label>
                <Input id="bioTitle" value={data.bioTitle} onChange={(e) => updateField("bioTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bioParagraph1">Bio Paragraph 1</Label>
                <Textarea id="bioParagraph1" rows={5} value={data.bioParagraph1} onChange={(e) => updateField("bioParagraph1", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bioParagraph2">Bio Paragraph 2</Label>
                <Textarea id="bioParagraph2" rows={5} value={data.bioParagraph2} onChange={(e) => updateField("bioParagraph2", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactDescription">Contact Tab Description</Label>
                <Textarea id="contactDescription" rows={3} value={data.contactDescription} onChange={(e) => updateField("contactDescription", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
                  <Button variant="destructive" size="icon" onClick={() => removeExperience(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={exp.role} onChange={(e) => updateExperience(index, "role", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Period (e.g., Jul 2025 - Aug 2025)</Label>
                    <Input value={exp.period} onChange={(e) => updateExperience(index, "period", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={exp.desc} onChange={(e) => updateExperience(index, "desc", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={addExperience}>
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="education">
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                  <Button variant="destructive" size="icon" onClick={() => removeEducation(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Degree / Program</Label>
                      <Input value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>School / University</Label>
                      <Input value={edu.school} onChange={(e) => updateEducation(index, "school", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Year / Duration (e.g., 2023 - 2027)</Label>
                    <Input value={edu.year} onChange={(e) => updateEducation(index, "year", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={addEducation}>
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
