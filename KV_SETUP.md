# Cloudflare KV Setup for Persistent Selections

## Current Issue
Selections are NOT persisting across devices because Cloudflare KV is not properly configured.

## What Needs to Be Done

### Step 1: Create KV Namespace in Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Select your account (26914575abf01f4199b562cc4d174f67)
3. Go to **Storage & Databases** → **KV Namespaces**
4. Click **Create a namespace**
5. Name it: `WSOP_SELECTIONS`
6. Create a **production** binding
7. Get the **Production Namespace ID** (looks like `abcd1234...`)

### Step 2: Bind to Pages Project
1. Go to **Pages** → **wsop-tracker**
2. Go to **Settings** → **Functions** → **KV namespace bindings**
3. Create a binding:
   - Variable name: `WSOP_SELECTIONS`
   - KV namespace: Select the one created above

### Step 3: Deploy
```bash
npm run build
git add -A
git commit -m "KV configured - selections now persistent"
git push origin main
```

## Testing
- Log in on Computer A
- Select tournaments
- Refresh page → selections should remain
- Log in on Computer B (same email) → should load selections from server

## Fallback
If KV cannot be configured, selections will use **localStorage only** (same device only, lost on different device).

## Files Involved
- `/functions/selections.js` - KV backend
- `/src/App.tsx` - Load/save logic
- `/wrangler.toml` - KV binding config
