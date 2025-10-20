# 🚀 Quick Setup Guide - Anjali Connect

This guide will help you get the Durga Puja Community Portal up and running in under 30 minutes.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18.x or higher installed
- [ ] npm or yarn package manager
- [ ] A Google account (for Firebase)
- [ ] A bank account for Razorpay integration
- [ ] Basic command line knowledge

## ⚡ Quick Start (5 Steps)

### Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project directory
cd anjali-connect

# Install all dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

### Step 2: Firebase Setup (10 minutes)

#### 2.1 Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `anjali-connect` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click **"Create Project"**

#### 2.2 Register Web App

1. In Firebase Console, click the **</>** (Web) icon
2. Register app name: `Anjali Connect Web`
3. **Copy the configuration object** - you'll need this!
4. Click **"Continue to Console"**

#### 2.3 Enable Authentication

1. Click **"Authentication"** from left sidebar
2. Click **"Get Started"**
3. Click **"Email/Password"** under Sign-in providers
4. **Enable** the first option (Email/Password)
5. Click **"Save"**

#### 2.4 Create Admin User

1. Still in Authentication, go to **"Users"** tab
2. Click **"Add User"**
3. Enter admin email: `admin@yourclub.com`
4. Enter a secure password
5. Click **"Add User"**
6. **Save these credentials** - you'll need them to login!

#### 2.5 Enable Firestore Database

1. Click **"Firestore Database"** from left sidebar
2. Click **"Create Database"**
3. Select **"Start in production mode"**
4. Choose your location (preferably closest to your users)
5. Click **"Enable"**

#### 2.6 Enable Storage

1. Click **"Storage"** from left sidebar
2. Click **"Get Started"**
3. Click **"Next"** (keep default rules)
4. Choose same location as Firestore
5. Click **"Done"**

#### 2.7 Upgrade to Blaze Plan (for Cloud Functions)

1. Click the **gear icon** > **"Usage and billing"**
2. Click **"Details & Settings"**
3. Click **"Modify plan"**
4. Select **"Blaze (Pay as you go)"**
5. Add payment method
6. **Don't worry**: Small projects stay within free tier!

### Step 3: Configure Environment Variables (3 minutes)

#### 3.1 Create .env file

```bash
# Copy the example file
cp .env.example .env
```

#### 3.2 Edit .env file

Open `.env` in your text editor and paste your Firebase config:

```env
# From Firebase Console > Project Settings > Your apps
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Leave this empty for now - we'll add Razorpay later
VITE_RAZORPAY_KEY_ID=
```

### Step 4: Deploy Firebase Configuration (5 minutes)

#### 4.1 Login to Firebase

```bash
firebase login
```

This will open your browser - login with your Google account.

#### 4.2 Initialize Firebase

```bash
firebase init
```

**Select the following options:**

- **Features**: Use arrow keys and space to select:
  - ✅ Firestore
  - ✅ Functions
  - ✅ Hosting
  - ✅ Storage

- **Use existing project**: Select your project from the list

- **Firestore Rules**: Press Enter (use default: `firestore.rules`)
- **Firestore Indexes**: Press Enter (use default: `firestore.indexes.json`)

- **Functions Language**: Choose **JavaScript**
- **ESLint**: No (or yes if you prefer)

- **Install dependencies**: Yes

- **Hosting directory**: Enter `dist`
- **Single-page app**: Yes
- **GitHub deployment**: No

- **Storage Rules**: Press Enter (use default: `storage.rules`)

#### 4.3 Deploy Firebase Rules

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### Step 5: Start Development Server (1 minute)

```bash
npm run dev
```

✅ **Your app is now running at http://localhost:3000**

## 🎉 Test Your Setup

1. **Visit the homepage**: http://localhost:3000
2. **Try registration**: Click "Join Us" and fill the form
3. **Login as admin**: 
   - Go to http://localhost:3000/admin/login
   - Use the admin credentials you created
4. **Check the dashboard**: You should see member data!

## 🔧 Optional: Setup Payment Gateway

### Razorpay Setup (5 minutes)

#### 1. Create Razorpay Account

1. Visit [Razorpay](https://razorpay.com/)
2. Click **"Sign Up"**
3. Complete registration with your details
4. Verify email and phone

#### 2. Get Test API Keys

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** > **API Keys**
3. Click **"Generate Test Key"**
4. **Copy the Key ID** (starts with `rzp_test_`)
5. Add to your `.env` file:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX
```

#### 3. Add Razorpay Script

The script is already added in `index.html`, but verify:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

#### 4. Test Payment Flow

1. Restart your dev server
2. Go to **Donate** page
3. Fill in details and click **"Proceed to Payment"**
4. Use Razorpay test cards:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

## 📧 Optional: Setup Email Reminders

### Gmail Configuration (10 minutes)

#### 1. Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **"2-Step Verification"**
3. Follow the setup process

#### 2. Generate App Password

1. Still in Security settings
2. Click **"App passwords"**
3. Select **"Mail"** and **"Other (Custom name)"**
4. Enter name: `Anjali Connect`
5. Click **"Generate"**
6. **Copy the 16-character password**

#### 3. Configure Firebase Functions

```bash
firebase functions:config:set gmail.user="your-email@gmail.com"
firebase functions:config:set gmail.password="xxxx xxxx xxxx xxxx"
```

Replace with your actual email and the app password.

#### 4. Deploy Functions

```bash
# Install function dependencies
cd functions
npm install
cd ..

# Deploy functions
firebase deploy --only functions
```

**Note**: This may take 5-10 minutes on first deployment.

## 🌐 Deploy to Production

When ready to go live:

### 1. Build for Production

```bash
npm run build
```

### 2. Deploy to Firebase Hosting

```bash
firebase deploy
```

### 3. Your site will be live at:
```
https://your-project-id.web.app
```

### 4. Add Custom Domain (Optional)

1. Go to **Hosting** in Firebase Console
2. Click **"Add custom domain"**
3. Follow the DNS configuration steps

## 📊 Firebase Console Overview

After setup, regularly check:

- **Authentication**: Monitor active users
- **Firestore Database**: View members and payments
- **Functions**: Check execution logs
- **Hosting**: Monitor bandwidth usage

## 🎯 Next Steps

1. ✅ Customize the content in pages (About, Gallery)
2. ✅ Upload gallery images to Firebase Storage
3. ✅ Configure Razorpay with live keys for production
4. ✅ Test email reminder system
5. ✅ Invite committee members as admins
6. ✅ Share the registration link with community

## 🆘 Quick Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase CLI not working
```bash
npm install -g firebase-tools
firebase login --reauth
```

### Port 3000 already in use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### Payment not loading
- Check Razorpay script in index.html
- Verify API key in .env
- Restart dev server after .env changes

## 📞 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review Firebase [documentation](https://firebase.google.com/docs)
- Check Razorpay [documentation](https://razorpay.com/docs/)

---

**🎊 Congratulations! Your Durga Puja Community Portal is ready!**
