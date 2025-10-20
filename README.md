# 🙏 Anjali Connect - Durga Puja Community Portal

A comprehensive web portal for managing Durga Puja club memberships, automating monthly donation reminders, and showcasing celebration history.

![React](https://img.shields.io/badge/React-18.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sekhar03/anjali)

**Live Demo**: Coming soon on Vercel

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Security](#security)
- [Contributing](#contributing)

## ✨ Features

### Public Features
- **🏠 Home Page**: Beautiful landing page with community statistics
- **ℹ️ About Us**: Club history, mission, committee details, and event schedule
- **🖼️ Gallery**: Photo archive from past celebrations with lightbox viewer
- **💰 Payments**: Secure donation system with Razorpay integration
- **👥 Member Registration**: Public registration form for new members

### Admin Features (Protected)
- **📊 Dashboard**: Real-time overview of members, payments, and statistics
- **👤 Member Management**: Full CRUD operations on member database
- **💳 Payment Tracking**: Monitor all donations with advanced filtering
- **📧 Automated Reminders**: Scheduled monthly email reminders for pending payments
- **📈 Analytics**: Revenue tracking and payment status monitoring
- **📤 Data Export**: Export payment data to CSV

### Automated Systems
- **⏰ Scheduled Reminders**: Automatic email reminders on the 5th of every month
- **✉️ Receipt Emails**: Automatic thank you emails after successful payments
- **📝 Email Logging**: Track all sent emails with success/failure status

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2 with Vite
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router DOM 6.20
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend & Database
- **Database**: Firebase Firestore (Real-time NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Functions**: Firebase Cloud Functions (Node.js 18)
- **Email Service**: Nodemailer with Gmail

### Payment Gateway
- **Provider**: Razorpay
- **Features**: Support for one-time and recurring payments
- **Security**: Server-side validation and PCI compliance

## 📁 Project Structure

```
anjali-connect/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Gallery.jsx
│   │   ├── Payments.jsx
│   │   ├── Register.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── MemberDatabase.jsx
│   │       └── PaymentTracking.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── functions/
│   ├── index.js
│   └── package.json
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Firebase account
- Razorpay account (for payments)
- Gmail account (for sending emails)

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd anjali-connect

# Install dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

### Step 2: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Follow the setup wizard

2. **Enable Services**
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable with default rules
   - **Functions**: Upgrade to Blaze plan (pay-as-you-go)

3. **Create Admin User**
   - Go to Authentication > Users
   - Click "Add User"
   - Create admin account with email/password

4. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon to register web app
   - Copy the configuration object

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Step 4: Razorpay Setup

1. **Create Account**
   - Sign up at [Razorpay](https://razorpay.com/)
   - Verify your account

2. **Get API Keys**
   - Go to Settings > API Keys
   - Generate Test Keys for development
   - Copy Key ID to `.env` file

3. **Configure Webhook** (Optional)
   - Go to Settings > Webhooks
   - Add webhook URL: `https://your-domain.com/api/razorpay-webhook`

### Step 5: Email Configuration

1. **Generate Gmail App Password**
   - Go to Google Account Settings
   - Enable 2-Step Verification
   - Go to Security > App Passwords
   - Generate password for "Mail"

2. **Configure Firebase Functions**
   ```bash
   firebase functions:config:set gmail.user="your-email@gmail.com"
   firebase functions:config:set gmail.password="your-app-password"
   ```

### Step 6: Deploy Firebase Rules and Indexes

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage
```

### Step 7: Deploy Cloud Functions

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Go back to root
cd ..

# Deploy functions
firebase deploy --only functions
```

### Step 8: Run Development Server

```bash
# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

## 🔧 Configuration

### Razorpay Payment Script

Add Razorpay checkout script to `index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Firebase Hosting (Optional)

To deploy the frontend to Firebase Hosting:

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 📱 Usage Guide

### For Members

1. **Registration**
   - Visit the "Join Us" page
   - Fill in personal details
   - Select donation preference
   - Submit the form

2. **Making Donations**
   - Go to "Donate" page
   - Choose one-time or monthly donation
   - Select or enter amount
   - Complete payment via Razorpay

### For Admins

1. **Login**
   - Navigate to `/admin/login`
   - Enter admin credentials
   - Access admin dashboard

2. **Managing Members**
   - View all registered members
   - Search and filter members
   - Edit member information
   - Update payment status
   - Delete inactive members

3. **Tracking Payments**
   - Monitor all donations
   - Filter by type, status, and date
   - Export data to CSV
   - View revenue statistics

4. **Sending Reminders**
   - Automatic reminders sent on 5th of each month
   - Manual reminders can be triggered from dashboard

## 🔒 Security

### Authentication
- Admin routes protected with Firebase Auth
- Email/password authentication
- Session management

### Database Security
- Firestore security rules enforce access control
- Members can only create records (registration)
- Admins have full CRUD access
- Payment data secured

### Payment Security
- Razorpay PCI DSS Level 1 compliant
- No card data stored locally
- Server-side validation
- HTTPS required for production

### Environment Variables
- Sensitive data stored in `.env`
- Never commit `.env` to version control
- Use Firebase Functions config for backend secrets

## 🚀 Deployment

### Option 1: Deploy to Vercel (Recommended - Easiest)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sekhar03/anjali)

**Manual Deploy:**

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables (Firebase config)
6. Click "Deploy"

**See detailed guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Option 2: Deploy to Firebase Hosting

```bash
# Build for production
npm run build

# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

### Production Checklist

- [ ] Update Firebase to production mode
- [ ] Switch to Razorpay live keys
- [ ] Configure custom domain
- [ ] Enable SSL (automatic on Vercel/Firebase)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Update email templates with production URLs
- [ ] Test all payment flows
- [ ] Test automated reminders
- [ ] Set up error logging
- [ ] Add environment variables to hosting platform

## 📊 Firebase Functions

### Scheduled Function: `sendMonthlyReminders`
- **Schedule**: 5th of every month at 9:00 AM IST
- **Purpose**: Send email reminders to members with pending payments
- **Trigger**: Cloud Scheduler (Pub/Sub)

### Callable Function: `sendManualReminder`
- **Purpose**: Manually trigger reminders for specific members
- **Auth**: Requires authentication
- **Usage**: Call from admin dashboard

### Trigger Function: `onPaymentCompleted`
- **Purpose**: Send thank you email after successful payment
- **Trigger**: Firestore onCreate for payments collection
- **Action**: Automatic email with receipt

## 🔍 Monitoring

### Firebase Console
- Monitor function executions
- View Firestore usage
- Check authentication logs
- Review storage usage

### Email Logs
- All sent emails logged in `emailLogs` collection
- Track success/failure rates
- Debug email issues

## 🐛 Troubleshooting

### Common Issues

**Payment not working**
- Verify Razorpay script is loaded
- Check API key in `.env`
- Ensure HTTPS in production

**Emails not sending**
- Verify Gmail app password
- Check Firebase Functions config
- Review function logs: `firebase functions:log`

**Admin login fails**
- Verify Firebase Auth is enabled
- Check user exists in Firebase Console
- Clear browser cache

**Build errors**
- Delete `node_modules` and reinstall
- Clear npm cache: `npm cache clean --force`
- Check Node.js version (18.x required)

## 📄 License

MIT License - feel free to use for your community!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Email: info@anjaliconnect.org
- Create an issue on GitHub

## 🙏 Acknowledgments

- React and Vite teams
- Firebase team
- Razorpay team
- Tailwind CSS team
- All contributors and community members

---

**Built with ❤️ for the Durga Puja community**
