# 🔧 OTP Verification 403 Error - Troubleshooting Guide

## ❌ Current Error
**403 Forbidden** when calling `supabase.auth.verifyOtp()`

This means Supabase is rejecting the verification request.

---

## ✅ Step-by-Step Fix Guide

### 1️⃣ CHECK YOUR .env FILE

Open `c:\Users\ML Lab\Desktop\Eco\ecooo\.env` and verify:

```env
VITE_SUPABASE_URL=https://micupiabqbzedfocodyr.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_key_here
```

**Important Checks:**
- [ ] File is named exactly `.env` (not `.env.txt`)
- [ ] Located in the `ecooo` folder (same level as `package.json`)
- [ ] Variables start with `VITE_` prefix
- [ ] No quotes around values
- [ ] No spaces around the `=` sign
- [ ] URL starts with `https://`

**After editing .env:**
```bash
# Stop the dev server (Ctrl+C)
# Restart it
npm run dev
```

⚠️ **Vite doesn't auto-reload .env changes!**

---

### 2️⃣ GET YOUR CORRECT SUPABASE KEYS

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (⚙️ icon in sidebar)
4. Click **API** section
5. Copy these values:

```
Project URL: https://micupiabqbzedfocodyr.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT:** Use the **anon public** key, NOT the service_role key!

The anon key should:
- Start with `eyJ`
- Be very long (200+ characters)
- Look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3VwaWFicWJ6ZWRmb2NvZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2...`

---

### 3️⃣ VERIFY CONFIGURATION IN BROWSER

After starting the app:
1. Open the app: http://localhost:5173
2. Go to **Auth** page (login page)
3. Look for the **debug panel** in the bottom-right corner
4. Check all values show ✓ YES in green
5. Click **Test Connection** button

**Expected Result:**
```
✓ Supabase connection successful!
Session: None
```

If you see errors, the .env is not loaded correctly.

---

### 4️⃣ CONFIGURE SUPABASE PROJECT SETTINGS

#### A. Enable Email OTP (Not Magic Links)

1. Go to: https://supabase.com/dashboard
2. **Authentication** → **Settings** → **Auth Settings**
3. Find **"Enable email confirmations"** → ✓ ENABLED
4. Find **"Enable email link (magic link)"** → ❌ DISABLED
5. Click **Save**

#### B. Configure Email Template

1. **Authentication** → **Email Templates**
2. Select **"Magic Link"** template
3. Replace with this OTP-focused template:

```html
<h2>Your EcoSnap Login Code</h2>
<p>Your verification code is:</p>
<h1 style="font-size: 36px; letter-spacing: 10px; font-family: monospace; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 10px;">
  {{ .Token }}
</h1>
<p>This code expires in 60 minutes.</p>
<p><strong>Do not share this code with anyone.</strong></p>
```

4. Click **Save**

#### C. Set Site URL

1. **Authentication** → **URL Configuration**
2. **Site URL:** `http://localhost:5173`
3. **Redirect URLs:** Add `http://localhost:5173`
4. Click **Save**

---

### 5️⃣ TEST THE COMPLETE FLOW

1. **Clear browser cache and localStorage:**
   - Press F12 (DevTools)
   - Go to **Application** tab
   - Click **Clear storage** → **Clear site data**

2. **Restart the dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

3. **Test authentication:**
   - Go to http://localhost:5173
   - Click **Get Started** or **Log In**
   - Enter your email
   - Click **Send Code**
   - Check your email (including spam folder)
   - You should receive a **6-digit code** (e.g., `123456`)
   - Enter the code in the app
   - Click **Verify Code**

---

## 🐛 DEBUGGING CONSOLE LOGS

Open browser DevTools (F12) → **Console** tab

**When sending OTP, you should see:**
```
[Supabase] Initializing client...
[Supabase] URL present: true
[Supabase] Anon key present: true
[Supabase] Client initialized successfully
[AuthScreen] Requesting OTP for: your@email.com
[AuthScreen] OTP sent successfully
```

**When verifying OTP, you should see:**
```
[AuthScreen] ===== OTP Verification Start =====
[AuthScreen] Email: your@email.com
[AuthScreen] Code length: 6
[AuthScreen] Code format valid: true
[AuthScreen] ✓ OTP verified successfully
[AuthScreen] User ID: xxx-xxx-xxx
[AuthScreen] Navigating to home...
```

**If you see 403 error:**
```
[AuthScreen] OTP verification error details:
[AuthScreen] Error message: ...
[AuthScreen] Error status: 403
```

This means:
- ❌ Wrong Supabase URL or Key
- ❌ OTP code expired (60 min timeout)
- ❌ Wrong OTP code entered
- ❌ Supabase project not configured correctly

---

## 📋 COMMON ISSUES & FIXES

### Issue: "Environment variables missing"
**Fix:** Create `.env` file in `ecooo` folder with VITE_ prefix

### Issue: "Invalid verification code" (403)
**Causes:**
1. Code expired (60 minutes timeout)
2. Code was already used
3. Wrong code entered
4. Email mismatch

**Fix:** Request a new code

### Issue: Still receiving magic links instead of OTP
**Fix:** 
1. Disable "Enable email link" in Supabase settings
2. Wait 5 minutes for changes to propagate
3. Clear browser cache
4. Request new code

### Issue: No email received
**Check:**
- Spam/junk folder
- Email address is correct
- Supabase email rate limits (default: 4 per hour)
- Supabase SMTP configured correctly

### Issue: Code works but shows "No session created"
**Fix:** Check Supabase RLS (Row Level Security) policies on tables

---

## 🔐 SECURITY NOTES

**DO NOT:**
- ❌ Commit `.env` file to git (it's in .gitignore)
- ❌ Use service_role key in frontend
- ❌ Share your anon key publicly (though it's safe for frontend)

**DO:**
- ✅ Use environment variables
- ✅ Use anon public key only
- ✅ Enable RLS on database tables
- ✅ Set proper CORS and redirect URLs

---

## 📞 STILL NOT WORKING?

1. **Check browser console** for detailed error messages
2. **Check Supabase logs:**
   - Dashboard → Logs → Auth Logs
3. **Verify network tab** (F12 → Network):
   - Look for request to `/auth/v1/otp`
   - Check request headers include `apikey`
   - Check response status and body

4. **Test with cURL:**
```bash
curl -X POST 'https://micupiabqbzedfocodyr.supabase.co/auth/v1/otp' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

If this returns 403, your Supabase keys are incorrect.

---

## ✨ Success Checklist

- [ ] .env file exists with correct values
- [ ] Dev server restarted after .env changes
- [ ] Supabase URL and key verified from dashboard
- [ ] Debug panel shows all ✓ YES
- [ ] Test connection successful
- [ ] Magic links disabled in Supabase
- [ ] Email template configured for OTP
- [ ] Browser cache cleared
- [ ] Receiving 6-digit codes (not magic links)
- [ ] OTP verification successful
- [ ] Redirected to home screen

---

Need more help? Check console logs and Supabase auth logs for specific error messages!
