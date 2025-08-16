import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    
    const { deviceInfo, location, timestamp } = await request.json()


    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS


    if (!emailPass) {
      console.error('❌ Email API key not configured')
      return NextResponse.json({ success: false, error: 'Email not configured' })
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    })

    // Admin login email template
    const adminLoginEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel Access Alert - Nishant Portfolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif;">
        <div style="max-width: 600px; width: 100%; margin: 0 auto; color: #000000; padding: 0 10px; box-sizing: border-box;">
          
          <!-- Header with Logo -->
          <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center; border-bottom: 1px solid #333333; border-radius: 30px 30px 0 0;">
            <!-- Centered Logo -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <!-- Logo Image -->
              <img src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754273854/mail_grlmg4.gif" alt="Nishant Mogahaa Logo" style="width: 60px; height: 60px; border-radius: 45px; display: block; margin: 0 auto;" />
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
                  src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754276405/Notification-_remix_3_hhrrcq.gif" 
                  alt="Portfolio Image" 
                  style="width: 100%; max-width: 400px; height: auto; display: block; margin: 0 auto;"
                />
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div style="background-color: #1a1a1a; padding: 15px 20px; text-align: center; border-bottom: 1px solid #333333;">
            <div style="display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid #333333; background-color: rgba(255, 255, 255, 0.05); padding: 8px 16px; font-size: 14px; font-weight: 500; color: #ffffff; gap: 8px;">
              🔐 Admin Panel Access Alert
            </div>
          </div>

          <!-- Admin Access Section -->
          <div style="background-color: #1a1a1a; margin: 10px; padding: 20px; border-radius: 15px; border: 1px solid #333333;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
              <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="font-size: 24px;">🚨</span>
              </div>
              <div>
                <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Admin Panel Accessed</h2>
                <p style="margin: 5px 0 0 0; color: #cccccc; font-size: 14px;">Someone has logged into your admin panel!</p>
              </div>
            </div>

            <!-- Device Information -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">📱 Device Information</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Device Type:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${deviceInfo.device || 'Unknown'}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Browser:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${deviceInfo.browser || 'Unknown'}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Operating System:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${deviceInfo.os || 'Unknown'}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Screen Resolution:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${deviceInfo.screen || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <!-- Location Information -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">📍 Location Information</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>IP Address:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${location.ip || 'Unknown'}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Country:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${location.country || 'Unknown'}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>City:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${location.city || 'Unknown'}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Region:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${location.region || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <!-- Access Details -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">⏰ Access Details</h3>
              <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Login Time:</strong></p>
                <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${timestamp}</p>
              </div>
              <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333; margin-top: 15px;">
                <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>User Agent:</strong></p>
                <p style="margin: 0; color: #ffffff; font-size: 14px; background-color: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 5px; border: 1px solid #333333;">${deviceInfo.userAgent || 'Unknown'}</p>
              </div>
            </div>

            <!-- Security Warning -->
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">⚠️ Security Alert</h3>
              <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.6;">
                  <strong>If this login was not authorized by you, please take immediate action:</strong><br><br>
                  • Change your admin password immediately<br>
                  • Review your security settings<br>
                  • Check for any suspicious activity<br>
                  • Contact support if needed
                </p>
              </div>
            </div>

            <!-- Logout Button -->
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="https://nishant-mogahaa-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; transition: all 0.2s ease; border: 2px solid #dc2626;">
                🚪 Force Logout Admin
              </a>
            </div>

            <!-- Image of Security after Logout Button -->
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
              <img 
                src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754390073/messages_iwfjrk.gif" 
                alt="Security Image" 
                style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
              />
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-top: 1px solid #333333; border-radius: 0 0 30px 30px;">
            <p style="margin: 0 0 10px 0; color: #cccccc; font-size: 14px;">
              This is an automated security notification from Nishant's Portfolio Admin System
            </p>
            <p style="margin: 0; color: #888888; font-size: 12px;">
              © 2025 Nishant Portfolio AI. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `


    // Send admin login notification email
    const mailOptions = {
      from: emailUser,
      to: emailUser,
      subject: `🔐 Admin Panel Access Alert - ${deviceInfo.device || 'Unknown Device'} from ${location.city || 'Unknown Location'}`,
      html: adminLoginEmailContent,
    }


    try {
      const info = await transporter.sendMail(mailOptions)

      return NextResponse.json({
        success: true,
        messageId: info.messageId
      })
    } catch (error) {
      console.error('❌ Error sending admin login notification:', error)
      console.error('❌ Error details:', error)
      throw error
    }

  } catch (error: unknown) {
    console.error('❌ Error sending admin login notification:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: 'Email service error', details: errorMessage })
  }
}
