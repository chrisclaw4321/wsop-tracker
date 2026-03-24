# WSOP Tracker - Cloudflare Pages Deployment

## Repository
- **GitHub**: https://github.com/chrisclaw4321/wsop-tracker
- **Status**: ✅ Code pushed to GitHub main branch

## Before Deployment: Google OAuth Setup

### Create Google OAuth 2.0 Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com

2. **Create a new project**:
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name: "WSOP Tracker"
   - Click "CREATE"

3. **Enable Google+ API**:
   - In search bar, search "Google+ API"
   - Click on it
   - Click "ENABLE"

4. **Create OAuth 2.0 Credentials**:
   - Go to "Credentials" (left sidebar)
   - Click "CREATE CREDENTIALS"
   - Select "OAuth 2.0 Client IDs"
   - Configure consent screen first:
     - User type: "External"
     - Fill in app name: "WSOP Tracker"
     - Add test user: sazan4321@gmail.com
     - Save and continue
   
5. **Create OAuth Client**:
   - Click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "WSOP Tracker Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3000` (for local development)
     - `https://wsop-tracker.chrisclaw4321.pages.dev` (replace with your actual Cloudflare domain)
   - Click "CREATE"
   - Copy the **Client ID** (you'll need this)

## Deploy to Cloudflare Pages

### 1. Connect GitHub Repository

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com

2. **Navigate to Pages**:
   - Left sidebar → "Pages"
   - Click "Create a project"

3. **Connect to Git**:
   - Click "Connect to Git"
   - Authorize GitHub
   - Select repository: `chrisclaw4321/wsop-tracker`
   - Branch: `main`

4. **Configure Build Settings**:
   - Framework preset: "None"
   - Build command: `npm install && npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

5. **Add Environment Variables**:
   - Click "Add variable"
   - Name: `VITE_GOOGLE_CLIENT_ID`
   - Value: (paste your Google OAuth Client ID from step above)
   - Click "Save and deploy"

### 2. Update Google OAuth Redirect URI

After Cloudflare deploys and gives you a domain:

1. Go back to Google Cloud Console
2. Go to Credentials → OAuth 2.0 Client
3. Click edit
4. Add the Cloudflare domain to "Authorized redirect URIs":
   - `https://your-cloudflare-domain.pages.dev`
5. Save

## Your Site Details

| Property | Value |
|----------|-------|
| **Repository** | https://github.com/chrisclaw4321/wsop-tracker |
| **GitHub Branch** | main |
| **Build Command** | npm install && npm run build |
| **Build Output** | dist |
| **Environment Variable** | VITE_GOOGLE_CLIENT_ID |
| **Authorized Email** | sazan4321@gmail.com |

## Local Development (Testing)

```bash
cd wsop-tracker

# Install dependencies
npm install

# Create .env.local with your Google Client ID
cp .env.example .env.local
# Edit .env.local and add your Google Client ID

# Start dev server
npm run dev

# Visit http://localhost:3000
```

## After Deployment

- ✅ Site will auto-deploy on every push to main branch
- ✅ Only accessible to sazan4321@gmail.com via Google OAuth
- ✅ All 10 WSOP Europe tournaments listed
- ✅ Responsive design on desktop/mobile/tablet

## Troubleshooting

**Issue: "Error logging in with Google"**
- Check that VITE_GOOGLE_CLIENT_ID is set in Cloudflare Pages environment variables
- Verify Cloudflare domain is in Google OAuth redirect URIs
- Clear browser cache

**Issue: "Access denied"**
- Only sazan4321@gmail.com can access
- Make sure you're logged into Google as that email
- Check that email is registered as a test user in Google Cloud

**Issue: Build fails**
- Check build logs in Cloudflare Pages dashboard
- Ensure all dependencies are installed locally first
- Verify Node version compatibility (v18+)

## Next Steps

1. ✅ Create Google OAuth credentials (get Client ID)
2. ✅ Deploy to Cloudflare Pages
3. ✅ Add environment variable with Client ID
4. ✅ Update Google OAuth redirect URI
5. ✅ Test login with sazan4321@gmail.com
6. ✅ Share site URL with authorized users

---

**Questions?** Check the README.md for more details on the app itself.
