# Deployment Guide - Triguna Mind

## Deploy to Render

### Prerequisites
- GitHub account with this repository
- Render account (free tier available at https://render.com)
- Gemini API Key from Google AI Studio

### Step-by-Step Deployment

#### 1. Prepare Your Repository
✅ Already done! Your repository includes:
- `render.yaml` - Render configuration
- `package.json` - Updated with production scripts
- `.node-version` - Specifies Node.js version

#### 2. Sign Up / Log In to Render
1. Go to https://render.com
2. Sign up or log in with your GitHub account
3. Authorize Render to access your GitHub repositories

#### 3. Create New Web Service
1. Click "New +" button in Render dashboard
2. Select "Web Service"
3. Connect your GitHub repository: `JanviGajile25/TrigunaMind`
4. Render will automatically detect the `render.yaml` file

#### 4. Configure Environment Variables
In the Render dashboard, add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `GEMINI_API_KEY` | Your API key | Get from https://ai.google.dev |
| `APP_URL` | (auto-filled) | Render provides this automatically |
| `NODE_ENV` | production | Already set in render.yaml |

**To add environment variables:**
1. Go to your service dashboard
2. Click "Environment" tab
3. Add each variable
4. Click "Save Changes"

#### 5. Deploy
1. Click "Create Web Service" or "Manual Deploy"
2. Render will:
   - Install dependencies (`npm install`)
   - Build the frontend (`npm run build`)
   - Start the server (`npm start`)
3. Wait 3-5 minutes for deployment to complete

#### 6. Access Your App
Once deployed, Render provides a URL like:
```
https://triguna-mind.onrender.com
```

### Configuration Details

#### Build Command
```bash
npm install && npm run build
```
This installs all dependencies and builds the Vite frontend.

#### Start Command
```bash
npm start
```
This runs the Express server with the built frontend.

#### Health Check
Render pings `/` to ensure your app is running.

### Troubleshooting

#### Issue: Build Fails
**Solution:** Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### Issue: App Crashes on Start
**Solution:** Check environment variables
- Ensure `GEMINI_API_KEY` is set correctly
- Check server logs for errors

#### Issue: API Key Not Working
**Solution:** Verify your Gemini API key
1. Go to https://ai.google.dev
2. Generate a new API key if needed
3. Update in Render environment variables

#### Issue: 404 Errors
**Solution:** Check server.ts routing
- Ensure static files are served correctly
- Verify API endpoints are working

### Free Tier Limitations
Render free tier includes:
- ✅ 750 hours/month (enough for 24/7 operation)
- ⚠️ App sleeps after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds
- ✅ Automatic HTTPS
- ✅ Custom domains supported

### Upgrade Options
For production use, consider:
- **Starter Plan ($7/month)**: No sleep, faster performance
- **Standard Plan ($25/month)**: More resources, better uptime

### Alternative Deployment Options

#### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables in Vercel dashboard

#### Deploy to Railway
1. Go to https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically

#### Deploy to Heroku
1. Install Heroku CLI
2. Run: `heroku create triguna-mind`
3. Set config vars: `heroku config:set GEMINI_API_KEY=your_key`
4. Push: `git push heroku main`

### Post-Deployment Checklist
- [ ] App loads successfully
- [ ] Questionnaire works
- [ ] IKS Guna Advisor chatbot responds
- [ ] No console errors
- [ ] API key is secure (not exposed in frontend)
- [ ] Custom domain configured (optional)

### Monitoring
Monitor your app in Render dashboard:
- View logs in real-time
- Check resource usage
- Monitor response times
- Set up alerts for downtime

### Updates
To deploy updates:
1. Make changes locally
2. Commit: `git commit -am "Update message"`
3. Push: `git push origin main`
4. Render auto-deploys (if enabled)

### Support
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: https://github.com/JanviGajile25/TrigunaMind/issues

---

## Environment Variables Reference

### Required
- `GEMINI_API_KEY`: Your Google Gemini API key

### Optional
- `APP_URL`: Your app's URL (auto-set by Render)
- `NODE_ENV`: Set to "production" for deployment
- `PORT`: Server port (auto-set by Render, default: 3000)

### Getting Gemini API Key
1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create new project or select existing
4. Generate API key
5. Copy and save securely

---

**Ready to deploy!** 🚀

Your app is configured and ready for deployment on Render or any Node.js hosting platform.
