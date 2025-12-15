# Deployment Checklist

## Pre-Deployment Verification ✅

### Code Quality
- [x] Boundary checks pass (`npm run check-boundaries`)
- [x] Build succeeds (`npm run build` in `apps/web`)
- [x] Type checking passes (`npm run typecheck`)
- [x] Linting passes (`npm run lint`)
- [x] All routes compile successfully

### Configuration Files
- [x] `apps/web/vercel.json` - Vercel configuration
- [x] `apps/web/.vercelignore` - Ignore patterns
- [x] `apps/web/next.config.js` - Next.js configuration
- [x] `apps/web/.eslintrc.json` - ESLint configuration
- [x] `apps/web/package.json` - Dependencies configured

### Documentation
- [x] `VERCEL_DEPLOYMENT.md` - Deployment guide
- [x] `apps/web/README.md` - Web app README
- [x] `VERIFICATION_SUMMARY.md` - Verification results

## Vercel Deployment Steps

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import GitHub repository: `settler-oss`

### Step 2: Configure Project
- **Root Directory**: `apps/web`
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Verify deployment URL

### Step 4: Add Custom Domain
1. Go to Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `settler.dev`)
4. Configure DNS as instructed by Vercel

## Post-Deployment Verification

### Route Testing
Test all routes after deployment:
- [ ] `/` - Homepage loads
- [ ] `/protocol` - Protocol page loads
- [ ] `/protocol/sdk` - SDK docs load
- [ ] `/protocol/spec` - API spec loads
- [ ] `/protocol/examples` - Examples load
- [ ] `/download` - Download page loads
- [ ] `/docs` - Docs page loads
- [ ] `/docs/self-hosting` - Self-hosting guide loads
- [ ] `/console` - Console info page loads
- [ ] `/enterprise` - Enterprise info page loads
- [ ] `/pricing` - Pricing page loads

### Functionality Testing
- [ ] All links work correctly
- [ ] Navigation works
- [ ] Pages render without errors
- [ ] Mobile responsive (check on mobile device)
- [ ] Fast page loads (< 3 seconds)

### SEO & Analytics (Optional)
- [ ] Add Google Analytics (if needed)
- [ ] Verify meta tags
- [ ] Check Open Graph tags
- [ ] Test social sharing

## Environment Variables (If Needed)

Currently no environment variables required. If you need to add them later:

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables:
   - `NEXT_PUBLIC_API_URL` (if needed)
   - `NEXT_PUBLIC_ANALYTICS_ID` (if using analytics)
3. Redeploy after adding variables

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics in Dashboard
- Monitor page views and performance

### Error Tracking (Optional)
- Set up Sentry or similar
- Monitor production errors

## Rollback Plan

If deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Support**: https://vercel.com/support

---

## Quick Deploy Command

```bash
cd apps/web
vercel --prod
```

---

**Status**: ✅ Ready for deployment
