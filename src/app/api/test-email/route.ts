import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test Email API called');

    // Debug all environment variables
    console.log('🔍 Environment variables check:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
    console.log('VERCEL_URL:', process.env.VERCEL_URL);

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error('❌ Email credentials not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'Email not configured',
        details: {
          hasEmailUser: !!emailUser,
          hasEmailPass: !!emailPass
        }
      });
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    console.log('📧 Testing Gmail connection...');

    // Test the connection
    await transporter.verify();
    console.log('✅ Gmail connection verified successfully');

    // Send a test email
    const mailOptions = {
      from: emailUser,
      to: emailUser,
      subject: '🧪 Test Email from Nishant Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🧪 Test Email</h2>
          <p>This is a test email from your portfolio to verify email configuration.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Environment:</strong> ${process.env.VERCEL_URL ? 'Production' : 'Development'}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Test email sent successfully'
    });

  } catch (error: unknown) {
    console.error('❌ Test email failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({ 
      success: false, 
      error: 'Test email failed', 
      details: errorMessage 
    });
  }
} 