# Deployment Guide

This guide will help you deploy the Movie Watchlist application to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- A Supabase account with your project set up
- A TMDB API key
- Your environment variables ready

## Environment Variables

You need to configure these environment variables in your hosting platform:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Optional (for AI recommendations):
```
VITE_OPENAI_API_KEY=your_openai_key
VITE_CLAUDE_API_KEY=your_claude_key
```

## Deployment Options

### Option 1: Netlify (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site settings → Environment variables
   - Click "Deploy site"

3. **Security Headers**
   - Headers are automatically applied via `netlify.toml`
   - No additional configuration needed

### Option 2: Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your Git repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables
   - Click "Deploy"

3. **Security Headers**
   - Headers are automatically applied via `vercel.json`

### Option 3: Manual Deployment

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Upload the `dist` folder** to your web hosting service

3. **Configure environment variables** on your hosting platform

4. **Set up redirects** to route all requests to `index.html` for SPA routing

## Post-Deployment Checklist

After deploying, verify:

- [ ] Site loads correctly
- [ ] All routes work (test navigation)
- [ ] Environment variables are properly configured
- [ ] Database connection works (try signing up/logging in)
- [ ] Movie search functionality works
- [ ] Security headers are present (check browser DevTools → Network tab → Headers)
- [ ] HTTPS is enabled

## Verify Security Headers

After deployment, check security headers:

```bash
curl -I https://your-deployed-site.com
```

You should see:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Troubleshooting

### Issue: Page shows blank screen
**Solution**: Check browser console for errors. Usually means environment variables are not configured.

### Issue: "Failed to fetch" errors
**Solution**: Verify Supabase URL and API keys are correct.

### Issue: Movies not loading
**Solution**: Check TMDB API key is valid and properly configured.

### Issue: 404 errors on page refresh
**Solution**: Ensure redirects are configured to route all requests to `/index.html`

## Production Recommendations

1. **Enable Row Level Security** (currently disabled for demo):
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
   ALTER TABLE watched_movies ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
   ```

2. **Set up custom domain** for better branding

3. **Enable monitoring** to track errors and performance

4. **Set up backups** for your Supabase database

## Support

For deployment issues:
1. Check the browser console for errors
2. Verify environment variables
3. Check the deployment logs
4. Review the SECURITY.md file
