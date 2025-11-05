# Farcaster Deployment Guide for Catch Items

## ✅ Completed Setup

The following has been configured for your Farcaster Mini App:

1. **SDK Integration**: Farcaster SDK properly initialized with error handling
2. **Manifest Route**: Express server serves manifest at `/.well-known/farcaster.json`
3. **Meta Tags**: Updated HTML with correct production URL and embed information
4. **Splash Screen**: SDK ready() call properly dismisses the loading splash

## 🚀 Next Steps: Sign Your Manifest

To deploy your app on Farcaster, you need to sign the manifest with your Farcaster account. This proves you own the domain.

### Option 1: Using Warpcast Developer Tools (Recommended)

1. **Enable Developer Mode**
   - Open Farcaster/Warpcast mobile app
   - Go to Settings → Advanced
   - Enable "Developer Mode"

2. **Access Developer Dashboard**
   - Visit: https://farcaster.xyz/~/developers
   - Click on "Hosted Manifests" or "Manifest Tool"

3. **Claim Ownership**
   - Click "Claim Ownership" or "Sign Manifest"
   - Scan the QR code with your Farcaster app
   - Sign the message with your Farcaster account
   - The tool will generate the signature

4. **Get Signature Values**
   - Copy the generated JSON with:
     - `header`
     - `payload`
     - `signature`

5. **Update Your Manifest**
   - Open `server/routes.ts`
   - Find the `accountAssociation` section (lines 11-15)
   - Replace the empty strings with your signature values:
   
   ```typescript
   accountAssociation: {
     header: "YOUR_HEADER_HERE",
     payload: "YOUR_PAYLOAD_HERE",
     signature: "YOUR_SIGNATURE_HERE"
   }
   ```

### Option 2: Using CLI Tool

```bash
npx create-onchain --manifest
```

- Connect your Farcaster custody wallet
- Enter your production URL: `https://basexfruits.vercel.app`
- Sign the manifest
- Copy the generated values into `server/routes.ts`

## 📋 Deployment Checklist

Before deploying to Vercel/production:

- [ ] Sign the manifest and update `server/routes.ts` with signature values
- [ ] Ensure all URLs in the manifest point to `https://basexfruits.vercel.app`
- [ ] Deploy to Vercel
- [ ] Verify manifest is accessible: `https://basexfruits.vercel.app/.well-known/farcaster.json`
- [ ] Test the manifest using Warpcast Embed Tool

## 🔍 Verify Your Deployment

### 1. Check Manifest Endpoint

Visit: `https://basexfruits.vercel.app/.well-known/farcaster.json`

You should see JSON with your app metadata and signature.

### 2. Test with Warpcast Embed Tool

1. Go to: https://farcaster.xyz/~/developers
2. Click "Embed Tool" or "Mini Apps"
3. Paste your URL: `https://basexfruits.vercel.app`
4. Click "Refetch"
5. Look for green checkmarks indicating success
6. Click "Manifest" to inspect the manifest

### 3. Test the Mini App

1. Share your URL in a Farcaster cast
2. The embed should show your app icon and "Play Now" button
3. Clicking should launch your mini app

## 🎮 Current Manifest Configuration

Your manifest is configured with:

- **Name**: Catch Items
- **Description**: Catch falling items game on Base Network
- **Category**: Games
- **Tags**: game, web3, base, blockchain, casual
- **Required Chain**: Base Network (eip155:8453)
- **Splash Color**: #1a0b2e (dark purple)
- **Icon**: /favicon.png

## 🔧 Troubleshooting

### Splash Screen Stuck
✅ **Fixed**: SDK ready() is now properly called with await and error handling

### Manifest Not Found
- Ensure the route is deployed to Vercel
- Check that `.well-known` directory is not blocked
- Verify CORS headers are set (already configured)

### Signature Invalid
- Must sign with your Farcaster **custody wallet** (from Settings → Advanced → Recovery Phrase)
- Not a regular crypto wallet
- Domain in signature must exactly match deployment URL

### Domain Mismatch
- All URLs in manifest must use `https://basexfruits.vercel.app`
- Already configured correctly in your code

## 📱 Local Testing with Tunnel (Optional)

For local development testing:

```bash
# Install cloudflared
brew install cloudflared  # or download from cloudflare.com

# Run tunnel
cloudflared tunnel --url http://localhost:5000
```

Use the provided HTTPS URL for testing in Farcaster.

## 📚 Resources

- Farcaster Mini Apps Docs: https://miniapps.farcaster.xyz/docs
- Publishing Guide: https://miniapps.farcaster.xyz/docs/guides/publishing
- Developer Tools: https://farcaster.xyz/~/developers
- Base Network Docs: https://docs.base.org/wallet-app/build-with-minikit/quickstart

## 🎉 Ready to Deploy!

Your app is now ready for Farcaster deployment. Just sign the manifest and deploy to Vercel!
