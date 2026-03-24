import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = (formData.get('file') || formData.get('image')) as File
    const folder = formData.get('folder') as string || 'uploads'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // IF IMAGE -> UPLOAD TO IMGBB
    if (file.type.startsWith('image/')) {
      const imgbbKey = process.env.IMG_BB_API_KEY
      if (!imgbbKey) {
        throw new Error('IMG_BB_API_KEY is not configured')
      }

      // ImgBB needs base64 or a binary blob in a FormData
      const imgbbFormData = new FormData()
      imgbbFormData.append('image', file)

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: imgbbFormData,
      })

      if (!imgbbRes.ok) {
        const errorText = await imgbbRes.text()
        console.error('ImgBB Error Response:', errorText)
        throw new Error('ImgBB upload failed')
      }

      const imgbbData = await imgbbRes.json()
      
      return NextResponse.json({
        url: imgbbData.data.url,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      })
    }
    
    // IF NOT IMAGE -> UPLOAD TO VERCEL BLOB (fallback for PDFs, etc.)
    // Validate file size (50MB max for Vercel Blob)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase()
    const fileName = `${folder}/${timestamp}-${originalName}`
    
    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
    })

    return NextResponse.json({
      url: blob.url,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}