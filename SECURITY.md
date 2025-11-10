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
