# 🔐 Admin Panel Setup Guide

## Features Implemented

✅ **Secret Access**: Click navbar logo 8 times to trigger admin access  
✅ **Password Protection**: Environment variable-based password  
✅ **Email Notifications**: Device tracking and location monitoring  
✅ **Logout Button**: Prominent logout functionality in admin panel  
✅ **Device Tracking**: Browser, OS, screen resolution detection  
✅ **Location Tracking**: IP, country, city, region detection  

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Admin Panel Configuration
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here

# Email Configuration (uses existing EMAIL_USER and EMAIL_PASS)
# Make sure these are already set in your .env.local file:
# EMAIL_USER=rajputvashu429@gmail.com
# EMAIL_PASS=your_gmail_app_password_here
```

## Email Configuration

The admin panel uses your existing email configuration:
- **EMAIL_USER**: Your Gmail address (already configured)
- **EMAIL_PASS**: Your Gmail app password (already configured)

If you need to update your email settings, modify these in your `.env.local` file.

## How to Use

### 1. Access Admin Panel
- **Click the navbar logo 8 times** (within 5 seconds)
- Enter the password from your environment variables
- Admin panel will open with full functionality

### 2. Email Notifications
When admin logs in, you'll receive an email with:
- 📱 **Device Information**: Browser, OS, screen resolution
- 📍 **Location Information**: IP address, country, city
- ⏰ **Access Details**: Login time and user agent
- 🚨 **Security Alert**: If unauthorized access detected

### 3. Admin Panel Features
- **Dashboard**: Stats and quick actions
- **Analytics**: Data visualization (placeholder)
- **Users**: User management (placeholder)
- **Settings**: System configuration (placeholder)
- **Logs**: System monitoring (placeholder)
- **Logout Button**: Prominent red logout button

## Security Features

🔒 **Password Protection**: Environment variable-based authentication  
📧 **Email Alerts**: Real-time notifications on admin access  
📱 **Device Tracking**: Complete device fingerprinting  
📍 **Location Monitoring**: IP-based location detection  
⏰ **Session Management**: Auto-reset after 5 seconds inactivity  
🚪 **Secure Logout**: Immediate session termination  

## Customization

### Change Password
Edit `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`

### Modify Email Template
Edit the HTML template in `src/app/api/admin-login/route.ts`

### Add More Admin Features
Extend the admin panel in `src/components/ui/admin-panel.tsx`

## Troubleshooting

### Email Not Working
1. Check `EMAIL_USER` and `EMAIL_PASS` in your `.env.local` file
2. Ensure 2FA is enabled on Gmail
3. Verify your Gmail app password is correct

### Admin Panel Not Opening
1. Verify password in environment variables
2. Check browser console for errors
3. Ensure all components are properly imported

### Device/Location Not Detected
1. Check internet connection for IP geolocation
2. Verify browser permissions
3. Check console for API errors

## Files Created/Modified

- ✅ `src/components/ui/admin-context.tsx` - Admin state management
- ✅ `src/components/ui/password-modal.tsx` - Password input modal
- ✅ `src/components/ui/admin-panel.tsx` - Main admin interface
- ✅ `src/app/api/admin-login/route.ts` - Email notification API
- ✅ `src/lib/device-info.ts` - Device and location tracking
- ✅ `src/components/navbar/NavPart1.tsx` - Logo click tracking
- ✅ `src/app/layout.tsx` - Admin provider integration

## Default Password
- **Default**: `admin123`
- **Change**: Set `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`

---

**⚠️ Security Note**: Always use a strong password and keep your environment variables secure!
