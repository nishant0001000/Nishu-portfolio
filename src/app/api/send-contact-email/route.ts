import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Type definitions - ADD THESE
interface CountersDocument {
  _id: string
  totalVisitors: number
  totalForms: number
  totalClients: number
}

interface FormDocument {
  _id: ObjectId
  id: string
  name: string
  email: string
  phone: string
  message: string
  preferredTime?: string
  timestamp: string
  createdAt: string
  ip: string
  userAgent: string
  referer: string
  status: string
  contacted: boolean
  [key: string]: unknown // for visitor info and other fields
}

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const FORMS_COLLECTION = 'forms'
const COUNTERS_COLLECTION = 'counters'

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Helper function to update form counter - FIXED
const updateFormCounter = async () => {
  const db = await getDb()
  
  // FIXED: Using generic typing instead of raw string
  await db.collection<CountersDocument>(COUNTERS_COLLECTION).updateOne(
    { _id: 'main' },
    { $inc: { totalForms: 1 } },
    { upsert: true }
  )
}

// Helper function to store form data in database with detailed visitor info - FIXED
const storeFormData = async (formData: Record<string, unknown>, request: NextRequest, visitorInfo?: Record<string, unknown>): Promise<boolean> => {
  try {
    const db = await getDb()
    
    // FIXED: Proper typing for new form
    const newForm: FormDocument = {
      _id: new ObjectId(),
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      // Server-side data
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'direct',
      // Form data with proper typing
      name: formData.name as string,
      email: formData.email as string,
      phone: formData.phone as string,
      message: formData.message as string,
      preferredTime: formData.preferredTime as string,
      // Status tracking
      status: 'new',
      contacted: false,
      // Spread visitor info if available
      ...visitorInfo,
    }

    // FIXED: Add generic typing
    await db.collection<FormDocument>(FORMS_COLLECTION).insertOne(newForm)
    await updateFormCounter()
    return true
  } catch (error) {
    console.error('❌ Error storing form data:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, preferredTime, visitorInfo } = await request.json();


    // Store form data in database with detailed visitor info
    const formData = { name, email, phone, message, preferredTime }
    await storeFormData(formData, request, visitorInfo)

    // Debug all environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailPass) {
      console.error('❌ Email API key not configured');
      return NextResponse.json({ success: false, error: 'Email not configured' }, { status: 500 });
    }

    // Create Gmail transporter
   const transporter = nodemailer.createTransport({

      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Email template for you (admin notification)
    const adminEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission - Nishant Portfolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif;">
        <div style="max-width: 600px; width: 100%; margin: 0 auto; color: #000000; padding: 0 10px; box-sizing: border-box;">
          
          <!-- Header with Logo -->
          <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center; border-bottom: 1px solid #333333; border-radius: 30px 30px 0 0;">
            <!-- Centered Logo -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <!-- Logo Image -->
              <img src="https://res.cloudinary.com/nishantcloud/image/upload/v1754273854/mail_grlmg4.gif" alt="Nishant Mogahaa Logo" style="width: 60px; height: 60px; border-radius: 45px; display: block; margin: 0 auto;" />
            </div>
            <!-- Centered Name and AI Portfolio -->
            <div style="text-align: center; margin-bottom: 15px; width: 100%;">
              <h1 style="margin: 0; color: #ffffff; font-size: clamp(20px, 5vw, 28px); font-weight: 700;">
                Nishant Mogahaa
              </h1>
              <div style="margin: 1rem 0rem 1rem 0; font-size: 14px; color: #EEBDE0; border: 1px solid #EEBDE0; border-radius: 16px; padding: 6px 12px; display: inline-block; background-color: rgba(238, 189, 224, 0.1);">
                AI Portfolio
              </div>
              <!-- Image below AI Portfolio -->
              <div style="margin-top: 15px; display: flex; justify-content: center; align-items: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/nishantcloud/image/upload/v1754276405/Notification-_remix_3_hhrrcq.gif" 
                  alt="Portfolio Image" 
                  style="width: 100%; max-width: 400px; height: auto; display: block; margin: 0 auto;"
                />
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div style="background-color: #1a1a1a; padding: 15px 20px; text-align: center; border-bottom: 1px solid #333333;">
            <div style="display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid #333333; background-color: rgba(255, 255, 255, 0.05); padding: 8px 16px; font-size: 14px; font-weight: 500; color: #ffffff; gap: 8px;">
              📧 New Contact Form Submission
            </div>
          </div>

          <!-- Contact Details Section -->
          <div style="background-color: #1a1a1a; margin: 10px; padding: 20px; border-radius: 15px; border: 1px solid #333333;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
              <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="font-size: 24px;">👤</span>
              </div>
              <div>
                <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Contact Request</h2>
                <p style="margin: 5px 0 0 0; color: #cccccc; font-size: 14px;">Someone wants to get in touch with you!</p>
              </div>
            </div>

            <!-- Contact Details -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">📋 Contact Information</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Name:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${name}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Email:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${email}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Phone:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${phone}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Preferred Time:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${preferredTime || 'Not specified'}</p>
                </div>
                <div style="grid-column: 1 / -1; background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Message:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 14px; background-color: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 5px; border: 1px solid #333333;">${message}</p>
                </div>
                <div style="grid-column: 1 / -1; background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Submission Time:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 14px;">${new Date().toISOString()}</p>
                </div>
              </div>
            </div>

            <!-- Action Required -->
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">⚡ Next Steps</h3>
              <div style="display: grid; gap: 10px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">📧 Reply to the user's email: ${email}</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">📞 Call the user at: ${phone}</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">⏰ Schedule meeting for: ${preferredTime || 'Flexible time'}</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">💼 Review their project requirements</span>
                </div>
              </div>
            </div>

             <!-- Image of Mesagger after Response -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <a href="#" target="_blank" rel="noopener noreferrer" style="text-decoration: none; cursor: pointer; display: flex; justify-content: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/nishantcloud/image/upload/v1754390073/messages_iwfjrk.gif" 
                  alt="Context Image" 
                  style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
                />
              </a>
            </div>

             <!-- Image of instagram after Contact Details -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <a href="https://instagram.com/nishant_mogahaa/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; cursor: pointer; display: flex; justify-content: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/nishantcloud/image/upload/v1754391059/instagram_rfwvzr.gif" 
                  alt="Context Image" 
                  style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
                />
              </a>
            </div>
             <!-- Image  of linkedIN after Contact Details -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <a href="https://www.linkedin.com/in/nishant-mogahaa-11b16818a/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; cursor: pointer; display: flex; justify-content: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/nishantcloud/image/upload/v1754390589/linkedIN_zljcvl.gif" 
                  alt="Context Image" 
                  style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
                />
              </a>
            </div>

            <!-- Quick Action Button -->
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="mailto:${email}?subject=Re: Contact from Nishant Portfolio&body=Hi ${name},%0D%0A%0D%0AThank you for reaching out through my portfolio! I received your message:%0D%0A%0D%0A"${message}"%0D%0A%0D%0AI'll get back to you soon.%0D%0A%0D%0ABest regards,%0D%0ANishant Mogahaa" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; transition: all 0.2s ease; border: 2px solid #ffffff;">
                📧 Reply to ${name}
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-top: 1px solid #333333; border-radius: 0 0 30px 30px;">
            <p style="margin: 0 0 10px 0; color: #cccccc; font-size: 14px;">
              This is an automated notification from Nishant's Portfolio Contact System
            </p>
            <p style="margin: 0; color: #888888; font-size: 12px;">
              © 2025 Nishant Portfolio AI. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    // Thank you email template for the user
    const userEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - Nishant Portfolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif;">
        <div style="max-width: 600px; width: 100%; margin: 0 auto; color: #000000; padding: 0 10px; box-sizing: border-box;">
          
          <!-- Header with Logo -->
          <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center; border-bottom: 1px solid #333333; border-radius: 30px 30px 0 0;">
            <!-- Centered Logo -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <!-- Logo Image -->
              <img src="https://res.cloudinary.com/nishantcloud/image/upload/v1754273854/mail_grlmg4.gif" alt="Nishant Mogahaa Logo" style="width: 60px; height: 60px; border-radius: 45px; display: block; margin: 0 auto;" />
            </div>
            <!-- Centered Name and AI Portfolio -->
            <div style="text-align: center; margin-bottom: 15px; width: 100%;">
              <h1 style="margin: 0; color: #ffffff; font-size: clamp(20px, 5vw, 28px); font-weight: 700;">
                Nishant Mogahaa
              </h1>
              <div style="margin: 1rem 0rem 1rem 0; font-size: 14px; color: #EEBDE0; border: 1px solid #EEBDE0; border-radius: 16px; padding: 6px 12px; display: inline-block; background-color: rgba(238, 189, 224, 0.1);">
                AI Portfolio
              </div>
              <!-- Image below AI Portfolio -->
              <div style="margin-top: 15px; display: flex; justify-content: center; align-items: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/nishantcloud/image/upload/v1754276405/Notification-_remix_3_hhrrcq.gif" 
                  alt="Portfolio Image" 
                  style="width: 100%; max-width: 400px; height: auto; display: block; margin: 0 auto;"
                />
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div style="background-color: #1a1a1a; padding: 15px 20px; text-align: center; border-bottom: 1px solid #333333;">
            <div style="display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid #333333; background-color: rgba(255, 255, 255, 0.05); padding: 8px 16px; font-size: 14px; font-weight: 500; color: #ffffff; gap: 8px;">
              ✅ Thank You for Contacting Us
            </div>
          </div>

          <!-- Thank You Section -->
          <div style="background-color: #1a1a1a; margin: 10px; padding: 20px; border-radius: 15px; border: 1px solid #333333;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
              <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="font-size: 24px;">🙏</span>
              </div>
              <div>
                <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Thank You, ${name}!</h2>
                <p style="margin: 5px 0 0 0; color: #cccccc; font-size: 14px;">Your message has been received successfully</p>
              </div>
            </div>

            <!-- Thank You Message -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">📝 Your Message</h3>
              <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                <p style="margin: 0; color: #ffffff; font-size: 14px; background-color: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 5px; border: 1px solid #333333;">${message}</p>
              </div>
            </div>

            <!-- Response Message -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">💬 Our Response</h3>
              <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                <p style="margin: 0; color: #ffffff; font-size: 16px; line-height: 1.6;">
                  <strong>Thank you for your concern!</strong><br><br>
                  I have received your message and I'm excited to work with you on your project. I will review your requirements carefully and get back to you as soon as possible.<br><br>
                  <strong>Nishant will reach you as soon as possible!</strong>
                </p>
              </div>
            </div>

            <!-- What's Next -->
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">⏰ What's Next?</h3>
              <div style="display: grid; gap: 10px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">📧 You'll receive a detailed response within 24 hours</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">📞 We may call you at: ${phone}</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">⏰ Meeting scheduled for: ${preferredTime || 'Flexible time'}</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">💼 Project discussion and planning</span>
                </div>
              </div>
            </div>

             <!-- Image of Mesagger after Response -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <a href="#" target="_blank" rel="noopener noreferrer" style="text-decoration: none; cursor: pointer; display: flex; justify-content: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754390073/messages_iwfjrk.gif" 
                  alt="Context Image" 
                  style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
                />
              </a>
            </div>

            <!-- Image of instagram after Response -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <a href="https://instagram.com/nishant_mogahaa/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; cursor: pointer; display: flex; justify-content: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/nishantcloud/image/upload/v1754391059/instagram_rfwvzr.gif" 
                  alt="Context Image" 
                  style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
                />
              </a>
            </div>

            <!-- Image of linkedIN after Response -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <a href="https://www.linkedin.com/in/nishant-mogahaa-11b16818a/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; cursor: pointer; display: flex; justify-content: center; width: 100%;">
                <img 
                  src="https://res.cloudinary.com/nishantcloud/image/upload/v1754390589/linkedIN_zljcvl.gif" 
                  alt="Context Image" 
                  style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
                />
              </a>
            </div>
           
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-top: 1px solid #333333; border-radius: 0 0 30px 30px;">
            <p style="margin: 0 0 10px 0; color: #cccccc; font-size: 14px;">
              This is an automated notification from Nishant's Portfolio Contact System
            </p>
            <p style="margin: 0; color: #888888; font-size: 12px;">
              © 2025 Nishant Portfolio AI. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;


    // Send email to you (admin notification)
    const adminMailOptions = {
      from: emailUser,
      to: emailUser,
      subject: `📧 New Contact: ${name} wants to connect - ${email}`,
      html: adminEmailContent,
    };

    // Send thank you email to the user
    const userMailOptions = {
      from: emailUser,
      to: email,
      subject: `✅ Thank you for contacting Nishant Mogahaa!`,
      html: userEmailContent,
    };

    try {
      // Send admin notification email
      const adminInfo = await transporter.sendMail(adminMailOptions);

      // Send thank you email to user
      const userInfo = await transporter.sendMail(userMailOptions);

      return NextResponse.json({
        success: true,
        adminMessageId: adminInfo.messageId,
        userMessageId: userInfo.messageId
      });
    } catch (error) {
      console.error('❌ Error sending emails:', error);
      throw error;
    }

  } catch (error: unknown) {
    console.error('❌ Error sending contact email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Email service error', details: errorMessage }, { status: 500 });
  }
}
