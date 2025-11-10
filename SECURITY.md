# Security Configuration

This document outlines all security measures implemented in the Movie Watchlist application.

## Security Headers

The following security headers are configured:

### HTTP Security Headers
- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **X-XSS-Protection: 1; mode=block** - Enables XSS filtering
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Restricts access to browser features (geolocation, microphone, camera)

## Environment Variables

All sensitive configuration is stored in environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (public, safe for client-side)
- `VITE_TMDB_API_KEY` - TMDB API key (public, safe for client-side)

### Important Notes:
1. The `.env` file is excluded from version control via `.gitignore`
2. Never commit actual API keys to the repository
3. Use `.env.example` as a template for setting up environment variables
4. For production deployment, configure environment variables in your hosting platform

## Database Security

### Row Level Security (RLS)
- **Status**: Currently DISABLED for demo purposes
- **Production Recommendation**: Enable RLS before production deployment

### When RLS is enabled:
- Users can only access their own data
- Policies enforce authentication checks
- All tables have proper foreign key relationships

## Build Security

### Production Build Configuration
- Source maps are disabled (`sourcemap: false`)
- Console statements are removed in production
- Code is minified using Terser
- Debug statements are stripped

## Deployment Platforms

Security configurations are provided for multiple platforms:

### Netlify
- Configuration in `netlify.toml`
- Headers configured in `public/_headers`

### Vercel
- Configuration in `vercel.json`
- All security headers included

## API Keys Security

### TMDB API Key
- This is a client-side API key and is safe to expose
- TMDB uses domain restrictions and rate limiting
- Key is prefixed with `VITE_` to be included in the build

### Supabase Keys
- Using the anonymous (public) key which is safe for client-side
- Supabase handles security through RLS policies
- Service role key should NEVER be used in client-side code

## Recommendations for Production

1. **Enable RLS**: Run the following SQL to re-enable Row Level Security:
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
   ALTER TABLE watched_movies ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
   ```

2. **Rotate API Keys**: If keys are exposed, rotate them immediately

3. **Set up monitoring**: Monitor API usage for unusual patterns

4. **HTTPS Only**: Ensure your deployment uses HTTPS (automatic on Netlify/Vercel)

5. **Regular Updates**: Keep dependencies updated for security patches

## Security Checklist

- [x] Environment variables properly configured
- [x] .env excluded from version control
- [x] Security headers implemented
- [x] No hardcoded credentials in source code
- [x] Console statements removed in production
- [x] Source maps disabled
- [x] HTTPS enforced (via hosting platform)
- [ ] RLS enabled (disabled for demo - enable for production)
- [x] CORS properly configured

## Reporting Security Issues

If you discover a security vulnerability, please email the project maintainer immediately.

## Security Issues Fixed (Latest Update)

### Database Security Enhancements

#### 1. Row Level Security (RLS) ✅ ENABLED
All tables now have RLS enabled and active:
- ✅ `profiles` - RLS enabled with policies
- ✅ `watchlist` - RLS enabled with policies
- ✅ `watched_movies` - RLS enabled with policies
- ✅ `user_preferences` - RLS enabled with policies

Each table has comprehensive policies that ensure:
- Users can only view their own data
- Users can only insert their own records
- Users can only update their own records
- Users can only delete their own records

#### 2. Database Index Optimization ✅
- Removed unused index `idx_watched_movies_rating` to improve performance and reduce overhead

#### 3. Leaked Password Protection ⚠️ MANUAL STEP REQUIRED

To complete this security enhancement, you need to enable leaked password protection in the Supabase Dashboard:

**Steps to Enable:**
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to: **Authentication** → **Policies**
4. Scroll to **Password Strength** section
5. Enable: **"Check passwords against HaveIBeenPwned.org"**
6. Click **Save**

**What this does:**
- Checks user passwords against a database of compromised passwords
- Prevents users from using passwords that have been exposed in data breaches
- Provides an additional layer of security for user accounts

**Important:** This setting cannot be enabled programmatically and must be done through the Supabase Dashboard.

## Current Security Status

| Security Feature | Status | Notes |
|-----------------|--------|-------|
| Row Level Security | ✅ ENABLED | All tables protected |
| RLS Policies | ✅ ACTIVE | Comprehensive policies in place |
| Unused Indexes | ✅ REMOVED | Database optimized |
| Security Headers | ✅ ENABLED | HTTP headers configured |
| Environment Variables | ✅ PROTECTED | Properly secured |
| Leaked Password Check | ⚠️ MANUAL | Enable in Supabase Dashboard |
| HTTPS | ✅ ENABLED | Via hosting platform |

## Verification

To verify RLS is working correctly:
1. Create two user accounts
2. Add movies to watchlist for user 1
3. Log in as user 2
4. User 2 should NOT see user 1's movies
5. Each user should only see their own data

## Production Deployment Checklist

Before deploying to production:
- [x] Row Level Security enabled on all tables
- [x] RLS policies active and tested
- [x] Unused database indexes removed
- [x] Security headers configured
- [x] Environment variables protected
- [ ] Leaked password protection enabled (manual step in dashboard)
- [ ] SSL/HTTPS enabled (automatic on hosting platforms)
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up (recommended)

---

**Last Updated:** November 10, 2025
**Security Status:** ✅ PRODUCTION READY (Complete manual step for leaked password protection)
