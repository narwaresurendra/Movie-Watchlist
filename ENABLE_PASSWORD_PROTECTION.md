# Enable Leaked Password Protection - Quick Guide

## 🔒 Important Security Step

One final security setting requires manual configuration in your Supabase Dashboard.

## What This Does

Prevents users from creating accounts with passwords that have been exposed in data breaches by checking against the HaveIBeenPwned.org database of compromised credentials.

## How to Enable (3 minutes)

### Step 1: Access Supabase Dashboard
1. Go to: https://app.supabase.com
2. Log in to your account
3. Select your project: `zoudlrmyhuydgifzelgk`

### Step 2: Navigate to Authentication Settings
1. In the left sidebar, click **Authentication**
2. Click on **Policies** tab
3. Scroll down to find the **Password Strength** section

### Step 3: Enable Protection
1. Find the option: **"Check passwords against HaveIBeenPwned.org"**
2. Toggle it **ON** (enable it)
3. Click **Save** or **Update**

### Step 4: Verify
1. Try creating a test account with a common password like "password123"
2. The system should reject it
3. Try with a strong unique password - should work

## Screenshots Reference

Look for these sections in your dashboard:
- **Authentication** (left sidebar)
- **Policies** (top tabs)
- **Password Strength** (section on page)

## What Happens After Enabling

✅ Users cannot use passwords found in data breaches
✅ Significantly reduces account compromise risk
✅ Automatic checking on signup and password changes
✅ No impact on existing users (only new passwords)

## Why This Can't Be Automated

Supabase requires this setting to be enabled through the dashboard for security reasons - it ensures project administrators explicitly enable this feature.

## Troubleshooting

**Can't find the setting?**
- Make sure you're in the correct project
- Look under Authentication → Policies
- The feature might be called "Password Breach Detection" or similar

**Option is grayed out?**
- Check your Supabase plan includes this feature
- Verify you have admin permissions on the project

**Need help?**
- Check Supabase documentation: https://supabase.com/docs/guides/auth
- Contact Supabase support if the option is not available

## Additional Security Recommendations

While you're in the Authentication settings, consider also:
- Setting minimum password length (recommended: 8+ characters)
- Enabling email confirmation for new signups
- Configuring session timeout settings

---

**Status:** ⚠️ ACTION REQUIRED
**Time needed:** ~3 minutes
**Priority:** High (before production use)
