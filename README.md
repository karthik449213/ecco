# EcoSnap Web - React.js Application

A web-based version of the EcoSnap mobile app, built with React.js, Vite, and Tailwind CSS.

## Features

- 🌍 **Eco Action Tracking**: Log your eco-friendly actions with photo proof
- 🔥 **Streak System**: Build and maintain daily eco action streaks
- 🗺️ **Interactive Map**: Find nearby recycling centers and eco-friendly locations
- 🏆 **Achievements**: Track your progress and unlock achievements
- 📸 **Camera Integration**: Capture photos directly from the web app
- 🔐 **Authentication**: Secure sign-in with email OTP via Supabase

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Supabase** - Backend as a Service (authentication, database, storage)
- **React Leaflet** - Interactive maps

## Getting Started

### Quick Start - Demo Mode (No Setup Required!)

Want to explore the app without setting up Supabase? Try Demo Mode:

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Click **"🚀 Try Demo Mode"** on the welcome or login page

Demo mode provides:
- ✓ Full access to all features
- ✓ Dummy user data (streak: 15, actions: 47)
- ✓ No authentication required
- ✓ No Supabase configuration needed
- ✓ Perfect for UI development and testing

### Full Setup - With Supabase Authentication

### Prerequisites

- Node.js 16+ and npm
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the template:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
ecooo/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── InfoCard.jsx
│   │   ├── PrimaryButton.jsx
│   │   └── StreakBadge.jsx
│   ├── lib/              # Utilities and services
│   │   ├── supabase.js
│   │   └── ecoActions.js
│   ├── pages/            # Screen components
│   │   ├── WelcomeScreen.jsx
│   │   ├── AuthScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── CameraScreen.jsx
│   │   ├── PreviewScreen.jsx
│   │   ├── SuccessScreen.jsx
│   │   ├── MapScreen.jsx
│   │   └── AchievementsScreen.jsx
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Supabase Setup

Your Supabase project should have the following tables:

### `eco_actions`
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `image_url` (text)
- `latitude` (float)
- `longitude` (float)
- `action_date` (date)
- `created_at` (timestamp)

### `streaks`
- `user_id` (uuid, primary key, references auth.users)
- `current_streak` (integer)
- `last_action_date` (date)
- `updated_at` (timestamp)

### Storage Bucket: `eco-action-images`
- Public access for authenticated users
- Accept image files (jpg, png, webp)

## License

MIT
