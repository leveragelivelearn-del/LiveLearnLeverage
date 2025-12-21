/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import NewsletterSubscriber from '@/models/NewsletterSubscriber'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    await dbConnect()

    // Check if already subscribed
    const existingSubscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() })
    if (existingSubscriber) {
      return NextResponse.json({ error: 'You are already subscribed to our newsletter' }, { status: 400 })
    }

    // Save new subscriber
    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase().trim(),
    })

    await subscriber.save()

    return NextResponse.json({ message: 'Thank you for subscribing!' }, { status: 200 })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    
    if (error.code === 11000) { // Duplicate key error
      return NextResponse.json({ error: 'You are already subscribed to our newsletter' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }
}