# Supabase Configuration Guide for OTP Authentication

## Problem
The application is receiving magic links instead of OTP codes in emails.

## Solution
You need to configure your Supabase project to send OTP codes instead of magic links.

## Steps to Configure Supabase for OTP

### 1. Access Supabase Dashboard
Go to your Supabase project dashboard at https://supabase.com/dashboard

### 2. Navigate to Authentication Settings
1. Click on **Authentication** in the left sidebar
2. Click on **Settings** 
3. Go to **Auth Settings**

### 3. Configure Email Settings

#### Option A: Disable Magic Links (Recommended for OTP-only)
1. Scroll to **Email Auth**
2. Find **Enable email confirmations** - Leave this **ENABLED**
3. Find **Secure email change** - Leave this **ENABLED**
4. Find **Enable email link (magic link)** - **DISABLE** this option
   - This forces OTP code delivery instead of magic links

#### Option B: Use Custom Email Template for OTP
1. Go to **Email Templates** section
2. Select **Magic Link** template
3. Replace the template with an OTP-focused one:

```html
<h2>Your EcoSnap Login Code</h2>
<p>Hi there!</p>
<p>Your login code is:</p>
<h1 style="font-size: 32px; letter-spacing: 8px; font-family: monospace;">{{ .Token }}</h1>
<p>Enter this code in the EcoSnap app to complete your login.</p>
<p>This code expires in 60 minutes.</p>
<p>If you didn't request this code, you can safely ignore this email.</p>
```

### 4. Configure URL Settings
1. In **Auth Settings**, find **Site URL**
2. Set it to your app's URL (e.g., `http://localhost:5173` for development)
3. In **Redirect URLs**, add:
   - `http://localhost:5173` (for development)
   - Your production URL (when deployed)

### 5. Email Rate Limits
Check **Rate Limits** section:
- Ensure email rate limits are reasonable for testing
- Default is usually 4 emails per hour per user

### 6. Test the Configuration
1. Clear your browser cache and localStorage
2. Try signing in again
3. Check your email - you should now receive a 6-digit code instead of a magic link

## Troubleshooting

### Still Getting Magic Links?
1. **Clear browser cache and cookies**
2. **Wait 5 minutes** - Supabase config changes may take a moment to propagate
3. **Check spam folder** - Sometimes OTP emails go to spam
4. **Verify Supabase project** - Make sure you're editing the correct project

### Email Template Variables
If customizing email templates, you can use:
- `{{ .Token }}` - The 6-digit OTP code
- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - Magic link URL (don't use if you want OTP only)

### Alternative: Password Authentication
If OTP doesn't work, you can enable password-based authentication:
1. In **Auth Settings**, enable **Password** authentication method
2. Update the app to use `signUp()` and `signInWithPassword()` instead
3. This gives users a traditional username/password login

## Testing in Development

When testing locally:
1. Use a real email address you have access to
2. Check spam/junk folders
3. OTP codes expire after 60 minutes by default
4. Rate limits may prevent multiple requests - wait or increase limits

## Important Notes

- ⚠️ OTP codes are **6 digits** by default
- ⚠️ Codes expire after **60 minutes** (configurable in Supabase)
- ⚠️ **Magic links** and **OTP** are different: 
  - Magic link: Click the link in email to log in
  - OTP: Enter the code shown in email into the app
- ⚠️ The app is configured for **OTP codes**, not magic links

## Need More Help?

- Supabase Docs: https://supabase.com/docs/guides/auth/auth-email
- Supabase Discord: https://discord.supabase.com/
