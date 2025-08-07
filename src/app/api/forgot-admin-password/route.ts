import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Forgot Admin Password API route called')
    
    const { email } = await request.json()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
    
    console.log('📧 Sending password to:', email)
    console.log('🔑 Admin password:', adminPassword)

    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    console.log('📧 Email configuration check:')
    console.log('- Email User:', emailUser ? '✅ Configured' : '❌ Not configured')
    console.log('- Email Pass:', emailPass ? '✅ Configured' : '❌ Not configured')

    if (!emailPass) {
      console.error('❌ Email API key not configured')
      return NextResponse.json({ success: false, error: 'Email not configured' })
    }

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser || 'rajputvashu429@gmail.com',
        pass: emailPass || 'your_app_password_here'
      }
    })

    console.log('📧 Sending password via Gmail SMTP...')

    // Create beautiful email template matching contact form and admin login
    const forgotPasswordEmailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Password Recovery</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            border-radius: 20px 20px 0 0;
            margin-bottom: 0;
          }
          .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 40px;
          }
          .content {
            background: #2d2d2d;
            padding: 40px;
            border-radius: 0 0 20px 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          .password-box {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 5px 15px rgba(249, 115, 22, 0.3);
          }
          .password-text {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 2px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          .warning {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            color: #fca5a5;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #404040;
            color: #a0a0a0;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
            transition: all 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
          }
          .info-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            color: #93c5fd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔐</div>
            <h1 style="margin: 0; color: white; font-size: 28px;">Admin Password Recovery</h1>
            <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.8);">Nishant Mogahaa Portfolio</p>
          </div>
          
          <div class="content">
            <h2 style="color: #f97316; margin-bottom: 20px;">🔑 Your Admin Password</h2>
            
            <p style="line-height: 1.6; color: #e0e0e0;">
              Hello! You requested your admin password for the Nishant Mogahaa Portfolio admin panel.
            </p>
            
            <div class="password-box">
              <div style="margin-bottom: 10px; color: rgba(255, 255, 255, 0.8);">Your Admin Password:</div>
              <div class="password-text">${adminPassword}</div>
            </div>
            
            <div class="info-box">
              <strong>📋 How to Access Admin Panel:</strong><br>
              • Click the navbar logo 8 times<br>
              • Enter the password above<br>
              • Use the slide button to authenticate<br>
              • You'll receive a login notification email
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              • Keep this password secure and private<br>
              • Do not share it with anyone<br>
              • Change it regularly for better security<br>
              • This password is for admin access only
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">Access Admin Panel</a>
            </div>
            
            <div class="footer">
              <p>🔒 This is an automated security email from Nishant Mogahaa Portfolio</p>
              <p>If you didn't request this password, please ignore this email.</p>
              <p style="margin-top: 20px; font-size: 12px; color: #808080;">
                © 2024 Nishant Mogahaa. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Send password email
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: '🔐 Admin Password Recovery - Nishant Mogahaa Portfolio',
      html: forgotPasswordEmailContent,
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      console.log('📧 Password sent successfully:', info.messageId)

      return NextResponse.json({
        success: true,
        messageId: info.messageId
      })
    } catch (error) {
      console.error('❌ Error sending password email:', error)
      throw error
    }

  } catch (error) {
    console.error('❌ Forgot password API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send password' },
      { status: 500 }
    )
  }
}
