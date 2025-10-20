# 🔥 How to Get Your Firebase Configuration

## Method 1: Firebase Console (Easiest)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/anjali-672fc/settings/general

2. **Scroll down to "Your apps" section**

3. **If you don't have a web app:**
   - Click the **</>** (Web) icon
   - Enter app name: `Anjali Connect Web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click **"Register app"**

4. **Copy the configuration**
   - You'll see something like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "anjali-672fc.firebaseapp.com",
     projectId: "anjali-672fc",
     storageBucket: "anjali-672fc.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

5. **Copy these values to your .env file** (see below)

## Method 2: Using Firebase CLI

```bash
# Login to Firebase
firebase login

# Get project info
firebase projects:list

# Initialize (it will show your config)
firebase init
```

---

## 📝 Update Your .env File

Based on your project ID `anjali-672fc`, your .env should look like:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy_YOUR_ACTUAL_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=anjali-672fc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=anjali-672fc
VITE_FIREBASE_STORAGE_BUCKET=anjali-672fc.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Razorpay (leave empty for now)
VITE_RAZORPAY_KEY_ID=
```

---

## ⚠️ Important: Enable Required Services

### 1. Enable Firestore Database
- Go to: https://console.firebase.google.com/project/anjali-672fc/firestore
- Click "Create Database"
- Choose production mode
- Select location

### 2. Enable Authentication
- Go to: https://console.firebase.google.com/project/anjali-672fc/authentication
- Click "Get Started"
- Enable "Email/Password" provider

### 3. Enable Storage
- Go to: https://console.firebase.google.com/project/anjali-672fc/storage
- Click "Get Started"
- Use default rules

### 4. Create Admin User
- Go to Authentication > Users
- Click "Add User"
- Email: admin@yourclub.com
- Password: (create a secure password)
- Save these credentials!

---

## 🚀 After Configuration

1. Restart your dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. Test the app at http://localhost:3000

3. Try logging in at http://localhost:3000/admin/login

---

## 🆘 Need Help?

If you're stuck, share the firebaseConfig object from Firebase Console and I'll help you format it correctly!
