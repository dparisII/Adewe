# Setup Instructions - Fix White Screen

## The white screen is caused by missing Supabase credentials.

### Quick Fix:

1. **Create a `.env` file** in the root directory (c:/Users/dagma/Desktop/duolingo/)

2. **Add these lines** to the `.env` file:
   ```
   VITE_SUPABASE_URL=https://zjxffkulsznxkjxvmxrk.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key_here
   ```

3. **Get your Supabase key:**
   - Go to https://supabase.com/dashboard
   - Select your project (zjxffkulsznxkjxvmxrk)
   - Go to Settings > API
   - Copy the "anon public" key
   - Paste it in the `.env` file

4. **Restart the dev server:**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again
   - Refresh your browser

### Alternative: Run Without Database

If you don't have Supabase credentials, I can modify the app to work in demo mode without a database. Let me know if you'd prefer this option.

### Check Browser Console

Open DevTools (F12) and check the Console tab for specific error messages that can help diagnose the issue.
