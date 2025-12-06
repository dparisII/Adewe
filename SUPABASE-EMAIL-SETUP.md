# Supabase Email Confirmation Setup

## To ENABLE Email Confirmation (Recommended for Production)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zjxffkulsznxkjxvmxrk

2. Navigate to **Authentication** → **Providers** → **Email**

3. Make sure these settings are configured:
   - ✅ **Enable Email provider** = ON
   - ✅ **Confirm email** = ON (this requires users to verify their email)
   - ✅ **Secure email change** = ON

4. Configure **Email Templates** (Authentication → Email Templates):
   - Customize the confirmation email template
   - Make sure the `{{ .ConfirmationURL }}` variable is in the template

5. For **Custom SMTP** (recommended for production):
   - Go to **Project Settings** → **Auth** → **SMTP Settings**
   - Add your SMTP provider (SendGrid, Mailgun, AWS SES, etc.)
   - This ensures emails are delivered reliably

## To DISABLE Email Confirmation (For Testing Only)

1. Go to: https://supabase.com/dashboard/project/zjxffkulsznxkjxvmxrk/auth/providers

2. Click on **Email**

3. Turn **OFF** "Confirm email"

4. Save changes

⚠️ **Warning**: Disabling email confirmation is NOT recommended for production as it allows anyone to create accounts with any email address.

## Current Behavior

- When **Confirm email = ON**: User signs up → Gets email → Must click link → Then can login
- When **Confirm email = OFF**: User signs up → Can login immediately (no email sent)

## Troubleshooting Email Not Sending

1. **Check Supabase Email Quota**: Free tier has limited emails per hour
2. **Check Spam Folder**: Supabase emails often go to spam
3. **Use Custom SMTP**: For reliable delivery, set up your own SMTP
4. **Check Email Logs**: Go to Authentication → Logs to see email attempts
