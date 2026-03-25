# Cloudflare KV Setup for Cross-Device Persistent Selections

## Current Status
❌ **KV Binding NOT Configured** - API doesn't expose Pages KV binding endpoint
✅ **KV Namespace Created** - `WSOP_SELECTIONS` (ID: fa7ca348e45b44c688d25b4639f03232)
✅ **localStorage Fallback** - Selections persist on same device

## Manual Setup Required (via Cloudflare Dashboard Only)

The Cloudflare API does NOT expose an endpoint to bind KV namespaces to Pages projects. This must be done manually:

### Step 1: Go to Cloudflare Dashboard
https://dash.cloudflare.com/26914575abf01f4199b562cc4d174f67/pages

### Step 2: Find wsop-tracker Project
- Click **Pages** → **wsop-tracker**
- Go to **Settings** → **Functions**

### Step 3: Create KV Binding
- Under **KV namespace bindings**, click **Add binding**
- **Variable name:** `WSOP_SELECTIONS`
- **KV namespace:** `WSOP_SELECTIONS` (the one we already created)
- **Environment:** Production
- Click **Save**

### Step 4: Redeploy
After binding is created, Pages will automatically detect the binding and redeploy.

## Current Workaround
Selections are **stored in localStorage** and persist **on the same device only**. This means:
- ✅ Select tournaments on Computer A
- ✅ Refresh Computer A → selections remain
- ❌ Go to Computer B → selections are gone (device-specific storage)

## After Manual KV Binding
Once the KV binding is configured in the dashboard:
- ✅ Selections saved to server (KV)
- ✅ Cross-device sync works
- ✅ Selections persist across different computers

## Files Involved
- `/functions/api/selections.js` - KV backend (ready to use)
- `/src/App.tsx` - Load/save logic (ready to use)
- `/wrangler.toml` - KV binding config (already configured)

## Why Manual Setup?
Cloudflare Pages uses auto-deployed Workers scripts that don't have a public API for KV binding configuration. This is a Cloudflare limitation, not a code issue.
