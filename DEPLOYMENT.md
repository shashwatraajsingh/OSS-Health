# Deployment Guide

## Current Issue
Your app has two parts:
- **Frontend (React)**: Can be deployed to Netlify ✅
- **Backend (Express)**: Needs a separate hosting service ❌

## Quick Fix - Deploy Frontend Only

The frontend will now work on Netlify with limited functionality:
- ✅ Homepage loads correctly
- ✅ UI components work
- ✅ Shows trending repositories (mock data)
- ❌ Repository analysis requires backend

## Full Solution - Deploy Both Parts

### 1. Deploy Backend to Railway/Render/Heroku

**Option A: Railway (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option B: Render**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repo
3. Create a new Web Service
4. Set build command: `npm install`
5. Set start command: `node server/index.js`
6. Set environment variables (GitHub token, etc.)

**Option C: Heroku**
```bash
# Install Heroku CLI and login
heroku create your-app-name
git subtree push --prefix server heroku main
```

### 2. Update Frontend Configuration

Once your backend is deployed, update the API URL:

1. Edit `client/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

2. Redeploy to Netlify

### 3. Environment Variables

Make sure your backend has these environment variables:
- `GITHUB_TOKEN` (for GitHub API access)
- `PORT` (usually set automatically by hosting service)
- `NODE_ENV=production`

## Alternative: Use Netlify Functions

Convert your Express routes to Netlify Functions for a serverless approach:

1. Create `netlify/functions/` directory
2. Convert each route to a function
3. Update API calls to use `/.netlify/functions/`

## Current Status

✅ Frontend deployment fixed - will work on Netlify
⏳ Backend needs separate deployment for full functionality
📝 Clear error messages guide users when backend is unavailable
