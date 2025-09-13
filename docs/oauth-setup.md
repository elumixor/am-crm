# OAuth Authentication Setup

This document explains how to set up OAuth authentication with various providers for the AM CRM application.

## Supported Providers

The application supports the following OAuth providers:
- Google
- Apple
- Facebook/Meta
- Instagram
- WhatsApp (via Facebook Business)
- Telegram (via Widget)

## Setup Instructions

### 1. Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

### 2. Apple OAuth

1. Sign in to the [Apple Developer Console](https://developer.apple.com/)
2. Go to "Certificates, Identifiers & Profiles"
3. Create a new App ID
4. Create a Services ID
5. Configure Sign in with Apple
6. Set redirect URLs:
   - Development: `http://localhost:3000/api/auth/callback/apple`
   - Production: `https://yourdomain.com/api/auth/callback/apple`
7. Generate a private key and download it
8. Configure your `.env` file with the Services ID and private key

### 3. Facebook/Meta OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Set valid OAuth redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/facebook`
   - Production: `https://yourdomain.com/api/auth/callback/facebook`
5. Copy App ID and App Secret to your `.env` file

### 4. Instagram OAuth

1. Use the same Facebook app from step 3
2. Add "Instagram Basic Display" product
3. Create an Instagram app
4. Set redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/instagram`
   - Production: `https://yourdomain.com/api/auth/callback/instagram`
5. Copy Instagram App ID and App Secret to your `.env` file

### 5. WhatsApp Business

WhatsApp Business authentication uses the Facebook OAuth flow. Follow the Facebook setup instructions and ensure your app has WhatsApp Business permissions.

### 6. Telegram Widget

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set the domain for your widget:
   - Use `/setdomain` command with BotFather
   - Development: `localhost:3000`
   - Production: `yourdomain.com`
4. Add the bot token and username to your `.env` file

## Environment Variables

Copy `.env.example` to `.env` and fill in your OAuth credentials:

```bash
cp .env.example .env
```

## Database Migration

After setting up OAuth providers, run the database migration to add the required tables:

```bash
bun run migrate
```

## Testing

1. Start the development server:
   ```bash
   bun run dev
   ```

2. Navigate to the login page at `http://localhost:3000/login`

3. Test each OAuth provider by clicking their respective buttons

## Troubleshooting

### Common Issues

1. **Invalid redirect URI**: Ensure your redirect URIs match exactly in both the provider settings and your application
2. **Missing environment variables**: Check that all required variables are set in your `.env` file
3. **Telegram widget not loading**: Verify your bot domain is set correctly with BotFather
4. **Apple OAuth issues**: Ensure your private key is properly formatted and your Services ID is correct

### Debug Mode

Set `NODE_ENV=development` to enable debug logging for NextAuth.

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique secrets for production
- Regularly rotate your OAuth credentials
- Ensure HTTPS is enabled in production
- Set up proper CORS policies