import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { errorDetails, userMessage } = await request.json();

    console.log('📧 Email API called with:', { errorDetails, userMessage });

    // Debug all environment variables
    console.log('🔍 Environment variables check:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
    console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '***SET***' : 'NOT SET');

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    console.log('📧 Email configuration:', {
      emailUser,
      hasEmailPass: !!emailPass,
      emailPassLength: emailPass ? emailPass.length : 0,
      source: 'ENVIRONMENT_VARIABLES'
    });

    if (!emailPass) {
      console.error('❌ Email API key not configured');
      return NextResponse.json({ success: false, error: 'Email not configured' });
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Updated email template with web app styling - Dark theme
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Model Error Alert</title>
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
              ⚡ System Alert
            </div>
          </div>

          <!-- Error Alert Section -->
          <div style="background-color: #1a1a1a; margin: 10px; padding: 20px; border-radius: 15px; border: 1px solid #333333;">
                         <div style="display: flex; align-items: center; margin-bottom: 25px;">
               <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                 <span style="font-size: 24px;">⚠️</span>
               </div>
               <div>
                 <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">API Error Alert</h2>
                 <p style="margin: 5px 0 0 0; color: #cccccc; font-size: 14px;">Immediate attention required</p>
               </div>
             </div>

            <!-- Error Details -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">⚠️ Error Details</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Error Type:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${errorDetails.errorType}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Status Code:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600; font-family: monospace;">${errorDetails.status}</p>
                </div>
                <div style="grid-column: 1 / -1; background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Error Message:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 14px; background-color: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 5px; border: 1px solid #333333;">${errorDetails.message}</p>
                </div>
                <div style="grid-column: 1 / -1; background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Timestamp:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 14px;">${new Date().toISOString()}</p>
                </div>
              </div>
            </div>

            <!-- User Context -->
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">👤 User Context</h3>
              <div style="display: grid; gap: 15px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>User Message:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 14px; background-color: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 5px; border: 1px solid #333333;">${userMessage}</p>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; border: 1px solid #333333;">
                  <p style="margin: 0 0 8px 0; color: #cccccc; font-size: 14px;"><strong>Model Requested:</strong></p>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${errorDetails.modelName}</p>
                </div>
              </div>
            </div>

                         <!-- Image after User Context -->
             <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 25px; width: 100%;">
               <a href="https://instagram.com/nishant_mogahaa/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; cursor: pointer; display: flex; justify-content: center; width: 100%;">
                 <img 
                   src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754277092/Social-handle_kmu9bw.gif" 
                   alt="Context Image" 
                   style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; transition: transform 0.2s ease; cursor: pointer; display: block; margin: 0 auto;"
                 />
               </a>
             </div>

            <!-- Action Required -->
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333333;">
              <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">⚡ Immediate Action Required</h3>
              <div style="display: grid; gap: 10px;">
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">🔑 Check if OpenRouter API key is expired</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">💳 Add more credits to OpenRouter account</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">⚡ Check API rate limits</span>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; border: 1px solid #333333;">
                  <span style="color: #ffffff; font-size: 14px;">🔄 Verify model availability</span>
                </div>
              </div>
            </div>

            <!-- Quick Fix Button -->
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="https://openrouter.ai/settings/credits" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; transition: all 0.2s ease; border: 2px solid #ffffff;">
                🔧 Fix API Issues Now
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-top: 1px solid #333333; border-radius: 0 0 30px 30px;">
            <p style="margin: 0 0 10px 0; color: #cccccc; font-size: 14px;">
              This is an automated alert from Nishant's Portfolio AI System
            </p>
            <p style="margin: 0; color: #888888; font-size: 12px;">
              © 2025 Nishant Portfolio AI. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    console.log('📧 Sending email via Gmail SMTP...');

    // Send email using Gmail SMTP
    const mailOptions = {
      from: emailUser,
      to: emailUser,
      subject: `🚨 API Error: ${errorDetails.errorType} - User tried to use your portfolio model`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('📧 Gmail SMTP response:', info);
    console.log('✅ Error email sent successfully to:', emailUser);

    return NextResponse.json({ success: true, messageId: info.messageId });

  } catch (error: unknown) {
    console.error('❌ Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Email service error', details: errorMessage });
  }
} 