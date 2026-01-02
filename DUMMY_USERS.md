# 🔐 Dummy User Credentials

## Available Users

The app now uses **simple email/password authentication** with 5 pre-configured dummy users.

### User 1: Alice Green
- **Email:** `alice@ecosnap.com`
- **Password:** `password123`
- **Stats:**
  - Streak: 15 days
  - Total Actions: 47
  - Achievements: 3

### User 2: Bob Eco
- **Email:** `bob@ecosnap.com`
- **Password:** `password123`
- **Stats:**
  - Streak: 8 days
  - Total Actions: 32
  - Achievements: 2

### User 3: Carol Nature
- **Email:** `carol@ecosnap.com`
- **Password:** `password123`
- **Stats:**
  - Streak: 23 days
  - Total Actions: 89
  - Achievements: 5

### User 4: David Earth
- **Email:** `david@ecosnap.com`
- **Password:** `password123`
- **Stats:**
  - Streak: 5 days
  - Total Actions: 18
  - Achievements: 1

### User 5: Emma Planet
- **Email:** `emma@ecosnap.com`
- **Password:** `password123`
- **Stats:**
  - Streak: 42 days
  - Total Actions: 156
  - Achievements: 7

---

## Quick Login

On the login page, click **"▶ View Demo Accounts"** to see all users. Click any user card to auto-fill the login form.

---

## Features

### ✅ What Works

1. **Authentication**
   - Email/password login (no Supabase required)
   - Session management via localStorage
   - Auto-login from demo account list

2. **Home Screen**
   - User-specific stats (streak, total actions)
   - Personalized welcome message
   - Sign out functionality

3. **Camera & Photo Upload**
   - Capture photos with web camera
   - Simulated upload (1.5s delay)
   - Automatic streak increment after upload

4. **Map with Geolocation**
   - Real geolocation using browser API
   - Loading indicator while getting location
   - Permission denied notification
   - Falls back to default location (San Francisco)
   - Shows 7 recycling centers on map
   - Interactive markers with popups

5. **Achievements**
   - View all achievements
   - Progress tracking

---

## Geolocation Features

The map screen now includes:

- ✅ **Real-time location detection** using browser's Geolocation API
- ✅ **Loading indicator** while fetching location
- ✅ **Permission handling** - shows notification if location access is denied
- ✅ **Fallback location** - defaults to San Francisco if location unavailable
- ✅ **High accuracy mode** enabled
- ✅ **Console logging** for debugging location issues

### Testing Geolocation

1. Open the app and navigate to the Map page
2. Browser will prompt for location permission
3. **Allow** - Map centers on your actual location
4. **Deny** - Map shows default location with a notification
5. Check browser console for detailed location logs

### Browser Console Logs

```
[MapScreen] Location obtained: [latitude, longitude]  // Success
[MapScreen] Geolocation error: ...                     // Error
[MapScreen] Error code: 1                             // 1=denied, 2=unavailable, 3=timeout
```

---

## How It Works

### Authentication Flow

1. User enters email/password
2. System checks against dummy user database
3. If match found:
   - User data stored in localStorage
   - Session token generated
   - Redirect to home screen
4. If no match:
   - Show error message

### Data Persistence

All data is stored in **localStorage**:
- `auth_user` - Current user object
- `auth_session` - Session token and metadata

### Streak Increment

When a photo is uploaded:
1. Simulated 1.5s upload delay
2. User's streak increased by 1
3. Total actions increased by 1
4. Updated data saved to localStorage
5. Redirect to success screen with new streak

---

## Technical Details

### Mock Auth Service

Location: `src/lib/mockAuth.js`

**Methods:**
- `login(email, password)` - Authenticate user
- `isAuthenticated()` - Check if user logged in
- `getCurrentUser()` - Get current user object
- `getSession()` - Get session token
- `logout()` - Clear user data
- `getUserStats()` - Get user stats
- `incrementStreak()` - Update streak after action

### Geolocation API

Location: `src/pages/MapScreen.jsx`

**Options:**
```javascript
{
  enableHighAccuracy: true,  // Use GPS if available
  timeout: 10000,            // Wait max 10 seconds
  maximumAge: 0,             // Don't use cached position
}
```

**Error Codes:**
- `1` - Permission denied
- `2` - Position unavailable
- `3` - Timeout

---

## Development Notes

### No Backend Required

- ✅ No Supabase configuration needed
- ✅ No database required
- ✅ No API keys needed
- ✅ Works completely offline (except maps)

### Testing Different Users

Login as different users to see varied stats:
- Alice: Moderate streak
- Bob: Low streak
- Carol: High streak
- David: New user
- Emma: Power user

### Adding New Users

Edit `src/lib/mockAuth.js`:

```javascript
users: [
  {
    id: 'user-006',
    email: 'newuser@ecosnap.com',
    password: 'password123',
    username: 'New User',
    streak: 0,
    totalActions: 0,
    achievements: 0,
  },
  // ... other users
]
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:5173

# Login with any user
Email: alice@ecosnap.com
Password: password123
```

---

## Troubleshooting

### Geolocation Not Working?

1. **Check browser support**: Modern browsers required
2. **HTTPS required**: Geolocation only works on HTTPS (or localhost)
3. **Check permissions**: Go to browser settings → Site permissions
4. **Clear cache**: Sometimes helps with permission issues
5. **Try different browser**: Chrome, Firefox, Edge all support it

### Login Not Working?

1. Check email spelling (case-insensitive)
2. Ensure password is exactly `password123`
3. Check browser console for errors
4. Clear localStorage: `localStorage.clear()`

### Stats Not Updating?

1. Refresh the page
2. Check localStorage in DevTools (F12 → Application → Local Storage)
3. Logout and login again

---

Enjoy testing EcoSnap! 🌍✨
