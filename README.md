# WSOP Europe Prague 2026 - Tournament Tracker

A private, secure tournament tracker for WSOP Europe Prague 2026 with Google OAuth authentication.

## Features

- 🎰 **Complete Tournament List** - All 10+ WSOP Europe Prague 2026 events
- 🔐 **Secure Login** - Google OAuth with email verification (sazan4321@gmail.com only)
- 🎨 **Modern UI** - Beautiful dark theme with gradient backgrounds
- 🔍 **Smart Filtering** - Filter by buy-in level (Under €2K, €2K-€5K, Over €5K)
- 📊 **Detailed Information** - Each tournament includes:
  - Buy-in and guaranteed prize pool
  - Start dates
  - Max players
  - Tournament format (Single-day, Multi-day, Heads-up)
  - Full description
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with React, Vite, and Tailwind CSS

## Tournament Details

### All 10 Events:
1. **Opening Event** - €500
2. **Pot-Limit Omaha** - €1,000
3. **No-Limit Hold'em** - €2,500
4. **Mixed Game** - €3,000
5. **High Roller** - €5,300
6. **Ladies Championship** - €1,500
7. **Main Event** - €10,000 (€10M GTD)
8. **Circuit Championship** - €3,500
9. **Heads-Up Championship** - €2,000
10. **Six-Handed** - €1,500

## Setup

### 1. Google OAuth Setup

You need a Google OAuth 2.0 Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "WSOP Tracker"
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production Cloudflare domain)
6. Copy your **Client ID**

### 2. Environment Setup

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local and add your Google Client ID
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

Visit http://localhost:3000 and log in with `sazan4321@gmail.com`

### 5. Build for Production

```bash
npm run build
```

## Deployment on Cloudflare Pages

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_GOOGLE_CLIENT_ID` with your Client ID

## Authentication

- Only users with email `sazan4321@gmail.com` can access this tracker
- Uses Google OAuth 2.0 for secure authentication
- Session persists during browser session
- Logout button in top-right corner

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Auth**: Google OAuth 2.0 (@react-oauth/google)
- **Hosting**: Cloudflare Pages

## File Structure

```
wsop-tracker/
├── src/
│   ├── components/
│   │   ├── TournamentCard.tsx
│   │   └── TournamentList.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Notes

- Tournament data is hardcoded for accuracy
- Price pools and dates based on official WSOP announcement
- All prices in EUR (Euros)
- Dates: March 31 - April 12, 2026
- Location: King's Casino, Prague

## Security

- Google OAuth ensures only authorized users access the tracker
- No data is stored server-side
- All authentication happens through Google
- CORS-protected API endpoints (if expanded)

---

Built with ❤️ for WSOP Europe Prague 2026
# Redeploy trigger
