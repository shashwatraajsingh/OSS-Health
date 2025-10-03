# Render Backend Deployment Guide

## Step 1: Deploy to Render

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Configure the service:**
   - **Name**: `oss-health-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

## Step 2: Set Environment Variables in Render

In your Render service dashboard, add these environment variables:

### Required:
- `NODE_ENV` = `production`
- `GITHUB_TOKEN` = `your_github_personal_access_token`

### Optional:
- `PORT` = (automatically set by Render)

### How to get GitHub Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `public_repo`, `read:user`, `read:org`
4. Copy the token and add it to Render

## Step 3: Update Netlify Configuration

After your Render service is deployed:

1. **Note your Render URL** (e.g., `https://oss-health-backend.onrender.com`)

2. **Update `netlify.toml`** - Replace `your-app-name` with your actual service name:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://YOUR-ACTUAL-SERVICE-NAME.onrender.com/api/:splat"
     status = 200
     force = true
   ```

3. **Redeploy to Netlify** (it will automatically redeploy when you push changes)

## Step 4: Test the Deployment

1. **Backend Health Check**: Visit `https://your-service-name.onrender.com/api/health-check`
2. **Frontend**: Your Netlify site should now work with full functionality

## Troubleshooting

### Common Issues:

1. **"Service Unavailable"**
   - Check if your Render service is running
   - Verify environment variables are set
   - Check Render logs for errors

2. **CORS Errors**
   - Your backend already has CORS enabled
   - Make sure the Netlify proxy is configured correctly

3. **GitHub API Rate Limits**
   - Add your `GITHUB_TOKEN` environment variable
   - This increases rate limits from 60 to 5000 requests/hour

### Render Free Tier Limitations:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for most projects)

## Current Configuration Status:

✅ `render.yaml` - Render service configuration
✅ `package.json` - Added production start script  
✅ `netlify.toml` - API proxy configuration
✅ `client/.env.production` - Frontend API URL configuration

**Next**: Deploy to Render and update the service URL in `netlify.toml`
