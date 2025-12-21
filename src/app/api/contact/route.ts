import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const identifier = request.ip ?? '127.0.0.1'
    const isRateLimited = await limiter.check(identifier, 5) // 5 requests per minute
    
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { name, email, subject, message } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check for spam keywords (basic protection)
    const spamKeywords = [
      'viagra', 'cialis', 'casino', 'loan', 'debt', 'investment', 'opportunity',
      'make money', 'work from home', 'buy now', 'click here', 'discount',
      'free trial', 'winner', 'congratulations', 'urgent', 'important'
    ]
    
    const messageLower = message.toLowerCase()
    if (spamKeywords.some(keyword => messageLower.includes(keyword))) {
      // Log but still send (for review)
      console.log('Potential spam detected:', { email, subject })
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'LiveLearnLeverage <contact@livelearnleverage.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@livelearnleverage.com'],
      reply_to: email,
      subject: `Contact Form: ${subject || 'New Message'}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || 'No Subject'}

Message:
${message}

---
Sent via LiveLearnLeverage Contact Form
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #333; margin-top: 0;">Message:</h3>
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
  
  <p style="color: #666; font-size: 12px;">
    This message was sent via the LiveLearnLeverage contact form.
  </p>
</div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: 'LiveLearnLeverage <contact@livelearnleverage.com>',
      to: [email],
      subject: 'Thank you for contacting LiveLearnLeverage',
      text: `
Dear ${name},

Thank you for reaching out to LiveLearnLeverage. I have received your message and will get back to you as soon as possible.

Here's a copy of your message:

Subject: ${subject || 'No Subject'}

${message}

Best regards,
John Doe
LiveLearnLeverage
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Thank You for Contacting LiveLearnLeverage</h2>
  
  <p>Dear ${name},</p>
  
  <p>Thank you for reaching out to LiveLearnLeverage. I have received your message and will get back to you as soon as possible.</p>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #333; margin-top: 0;">Your Message:</h3>
    <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
  
  <p>If you have any additional information to add, please reply to this email.</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
  
  <p style="color: #666; font-size: 12px;">
    This is an automated response. Please do not reply to this email.
  </p>
</div>
      `,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}