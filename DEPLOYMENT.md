# Deploying DriftCity to Vercel

This guide walks you through deploying the DriftCity: Statistics for MLOps project to Vercel.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18.x or later
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, for CLI deployment)
- GitHub/GitLab/Bitbucket account (for Git integration)

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: DriftCity Statistics for MLOps"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/stats-for-mlops.git

# Push to main branch
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub account and the `stats-for-mlops` repository
4. Click **"Import"**

### Step 3: Configure Project Settings

Vercel auto-detects Next.js projects. Verify these settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` (auto-detected) |
| Install Command | `npm install` |
| Node.js Version | 18.x or 20.x |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (typically 1-2 minutes)
3. Your site is live at `https://your-project.vercel.app`

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy to Preview

```bash
# From project root directory
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (first time) or **Yes** (subsequent)
- Project name? `driftcity` (or your preferred name)
- Directory? `.` (current directory)

### Step 4: Deploy to Production

```bash
vercel --prod
```

---

## Environment Variables (Optional)

This project works without any environment variables, but you can configure:

### Via Vercel Dashboard

1. Go to Project Settings > Environment Variables
2. Add variables as needed:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | No |
| `NEXT_PUBLIC_SITE_URL` | Production URL for SEO | No |

### Via CLI

```bash
vercel env add NEXT_PUBLIC_GA_ID
```

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project Settings > Domains
2. Enter your domain (e.g., `driftcity.yourdomain.com`)
3. Click **"Add"**

### Step 2: Configure DNS

Add these records at your DNS provider:

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (driftcity.yourdomain.com):**
```
Type: CNAME
Name: driftcity
Value: cname.vercel-dns.com
```

### Step 3: Enable HTTPS

Vercel automatically provisions SSL certificates. Wait a few minutes after DNS propagation.

---

## Continuous Deployment

With Git integration, Vercel automatically deploys:

| Branch | Deployment Type | URL |
|--------|----------------|-----|
| `main` | Production | `your-project.vercel.app` |
| Feature branches | Preview | `your-project-git-branch.vercel.app` |
| Pull Requests | Preview | Linked in PR comments |

---

## Build Configuration

### vercel.json

The project includes a pre-configured `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    // CSV caching headers
    // Security headers
  ],
  "rewrites": [
    {
      "source": "/",
      "destination": "/chapters/chapter-1"
    }
  ]
}
```

### Key Configurations

- **CSV Caching**: All `.csv` files cached for 1 year (immutable)
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, XSS Protection
- **Home Redirect**: Root `/` redirects to Chapter 1
- **Clean URLs**: No trailing slashes

---

## Pre-Deployment Checklist

Run these commands before deploying:

```bash
# 1. Install dependencies
npm install

# 2. Run linter
npm run lint

# 3. Build locally to catch errors
npm run build

# 4. Test production build locally
npm run start
# Visit http://localhost:3000
```

### Verify Before Deploy

- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` passes
- [ ] All CSV fixtures are committed (check `app/chapters/*/fixtures/`)
- [ ] No hardcoded `localhost` URLs in code
- [ ] All images have alt text
- [ ] Charts load correctly on local production build

---

## Troubleshooting

### Build Fails: "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Plotly Charts Not Rendering

Ensure dynamic imports are correct:
```typescript
"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
```

### CSV Files Return 404

1. Check file paths are correct (case-sensitive on Vercel)
2. Ensure files are in `public/` or chapter `fixtures/` directories
3. Verify files are committed to git

### Build Timeout

For large Plotly bundles:
```bash
# Increase build timeout in vercel.json
{
  "buildCommand": "npm run build",
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 60
    }
  }
}
```

### npm Cache Permission Errors

```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm

# Or clear cache and retry
npm cache clean --force
rm -rf node_modules .next
npm install
```

### PageNotFoundError: /_document

This error occurs with stale build artifacts. Fix:
```bash
# Remove all caches and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Note:** This error won't occur on Vercel since it uses a clean build environment.

---

## Performance Optimization

### After Deployment

1. **Run Lighthouse Audit**
   - Open Chrome DevTools > Lighthouse
   - Target scores: Performance ≥80, Accessibility ≥90

2. **Check Vercel Analytics**
   - Enable in Project Settings > Analytics
   - Monitor Core Web Vitals (LCP, FID, CLS)

3. **Review Function Logs**
   - Project Dashboard > Logs
   - Check for runtime errors

### Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "ANALYZE=true npm run build"

# Install bundle analyzer
npm install @next/bundle-analyzer --save-dev
```

---

## Rollback Deployment

If issues arise after deployment:

### Via Dashboard
1. Go to Project > Deployments
2. Find the previous working deployment
3. Click **"..."** > **"Promote to Production"**

### Via CLI
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

---

## Useful Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# View deployment logs
vercel logs [deployment-url]

# List all deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# View project info
vercel inspect [deployment-url]
```

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)

---

## Support

- **Vercel Status**: [status.vercel.com](https://status.vercel.com)
- **Next.js Discord**: [nextjs.org/discord](https://nextjs.org/discord)
- **Project Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/stats-for-mlops/issues)
