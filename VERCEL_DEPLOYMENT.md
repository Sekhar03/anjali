# 🚀 Vercel Deployment Guide - Anjali Connect

Complete guide to deploy your Durga Puja Community Portal on Vercel.

## 📋 Prerequisites

- [x] GitHub repository: https://github.com/Sekhar03/anjali.git
- [x] Vercel account (Sign up at https://vercel.com)
- [x] Firebase project configured
- [x] Environment variables ready

---

## 🌐 Deploy to Vercel (5 Minutes)

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Connect your GitHub account (if not already connected)
5. Search for **"anjali"** repository
6. Click **"Import"**

#### Step 2: Configure Project

**Framework Preset:** Vite  
**Root Directory:** `./` (leave as default)  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

#### Step 3: Add Environment Variables

Click **"Environment Variables"** and add the following:

```plaintext
VITE_FIREBASE_API_KEY=AIzaSyAiteO9PgdFDWrWK6gixSbkGlZB5Y904rU
VITE_FIREBASE_AUTH_DOMAIN=anjali-672fc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=anjali-672fc
VITE_FIREBASE_STORAGE_BUCKET=anjali-672fc.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=865437591429
VITE_FIREBASE_APP_ID=1:865437591429:web:88baa841420269876bc6ec
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Important:** 
- Replace with your actual Firebase credentials
- For Razorpay, use test key for staging, live key for production

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Your site will be live at: `https://your-project-name.vercel.app`

---

### Method 2: Deploy via Vercel CLI

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Login to Vercel

```bash
vercel login
```

#### Deploy

```bash
# Navigate to project directory
cd c:\Users\sekha\OneDrive\Desktop\debashis

# Deploy to production
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **anjali-connect**
- In which directory is your code located? **./
**
- Want to override settings? **N**

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

Example domains:
- `anjaliconnect.org`
- `www.anjaliconnect.org`

### 2. Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/project/anjali-672fc/authentication/settings)
2. Click **"Authorized domains"**
3. Add your Vercel domain:
   - `your-project-name.vercel.app`
   - Your custom domain (if applicable)
4. Click **"Add domain"**

### 3. Update Razorpay Webhook (If using payments)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Settings → Webhooks
3. Update webhook URL to: `https://your-domain.vercel.app/api/razorpay-webhook`

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update description"
git push origin main

# Vercel automatically deploys! ✨
```

**Deployment Branches:**
- `main` → Production (your-project.vercel.app)
- Other branches → Preview deployments

---

## 📊 Monitor Deployments

### Vercel Dashboard

View deployment status at:
- https://vercel.com/dashboard
- See build logs
- Check deployment history
- View analytics

### Deployment Notifications

Get notifications via:
- Email (automatic)
- Slack integration (optional)
- GitHub comments (automatic)

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix dependencies"
git push
```

**Error: "Environment variables not set"**
- Go to Project Settings → Environment Variables
- Ensure all VITE_ variables are added
- Redeploy: Deployments → ⋯ → Redeploy

### Firebase Not Connecting

**Error: "Firebase: Error (auth/api-key-not-valid)"**
- Check environment variables spelling (must start with `VITE_`)
- Ensure no spaces in values
- Redeploy after fixing

### Routing Issues (404 on refresh)

Already fixed in `vercel.json` with:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

## 🚀 Performance Optimization

### Enable Edge Caching

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Enable Analytics

1. Go to Project Settings
2. Click **"Analytics"**
3. Enable Web Analytics
4. View real-time traffic data

---

## 🔒 Security Best Practices

### Environment Variables

✅ **DO:**
- Store all secrets in Vercel environment variables
- Use different keys for staging/production
- Rotate API keys regularly

❌ **DON'T:**
- Commit `.env` to GitHub
- Share credentials publicly
- Use production keys in development

### Firebase Security

1. Enable App Check (recommended)
2. Update Firestore rules
3. Enable Storage rules
4. Monitor usage in Firebase Console

---

## 📈 Scaling

Vercel automatically scales based on traffic:
- **Free Tier**: 100GB bandwidth/month
- **Pro Tier**: Unlimited bandwidth
- **CDN**: Global edge network
- **Serverless**: Auto-scaling functions

---

## 🎯 Deployment Checklist

Before going live:

- [ ] All environment variables added
- [ ] Firebase authorized domains updated
- [ ] Test all pages work correctly
- [ ] Test authentication flow
- [ ] Test payment gateway (use test mode first)
- [ ] Check mobile responsiveness
- [ ] Test form submissions
- [ ] Verify gallery images load
- [ ] Check admin dashboard access
- [ ] Test member registration
- [ ] Verify email functionality (if configured)
- [ ] Setup custom domain (optional)
- [ ] Enable analytics
- [ ] Configure error monitoring

---

## 🔗 Important Links

**Your Project:**
- GitHub: https://github.com/Sekhar03/anjali
- Vercel Dashboard: https://vercel.com/dashboard

**Firebase:**
- Console: https://console.firebase.google.com/project/anjali-672fc
- Firestore: https://console.firebase.google.com/project/anjali-672fc/firestore

**Payment:**
- Razorpay: https://dashboard.razorpay.com

---

## 🆘 Support

**Vercel Documentation:**
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/vite

**Community:**
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: https://github.com/Sekhar03/anjali/issues

---

## ✅ Quick Deploy Button

Add this to your README.md for one-click deploy:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sekhar03/anjali)
```

---

## 🎊 Success!

Once deployed, your portal will be live at:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://git-branch-name-project.vercel.app` (for branches)

Your Anjali Connect portal is now accessible worldwide! 🙏🕉️

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Platform:** Vercel + Firebase
